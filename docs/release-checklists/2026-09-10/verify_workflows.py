# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import hashlib
import json
import os
import subprocess
import tarfile
import xml.etree.ElementTree as ET
from pathlib import Path
import yaml
import argparse
import sys
import shlex
import replay

parser=argparse.ArgumentParser(description='Replay local workflow packaging checks; no real GitHub writes or publishing.')
parser.add_argument('--sources', type=Path, required=True)
parser.add_argument('--work', type=Path, required=True, help='Fresh fixture directory; existing directories are rejected')
parser.add_argument('--bash', default='bash', help='Bash executable; use Git Bash on Windows')
args=parser.parse_args()
replay.verify()
SOURCES=args.sources.resolve()
CHECKS=args.work.resolve()
CHECKS.mkdir(parents=True,exist_ok=False)
BASH=args.bash
SHIMS=CHECKS/'bin'; SHIMS.mkdir()
python_path=Path(sys.executable).as_posix()
if os.name=='nt':python_path='/'+python_path[0].lower()+python_path[2:]
(SHIMS/'python3').write_text('#!/usr/bin/env bash\nexec '+shlex.quote(python_path)+' "$@"\n',encoding='utf-8',newline='\n')
(SHIMS/'gh').write_text('#!/usr/bin/env bash\nprintf "%s\\n" "$*" >> "$MOCK_GH_LOG"\nif [ "$1" = release ] && [ "$2" = view ]; then exit 0; fi\nexit 99\n',encoding='utf-8',newline='\n')
for shim in SHIMS.iterdir():shim.chmod(0o700)
results=[]

def git(repo,*args):
    return subprocess.check_output(['git','-C',str(repo),*args],stderr=subprocess.PIPE).decode('utf-8').strip()

def run(repo,steps,title,values,expected=0,replacements=None):
    script=next(s['run'] for s in steps if s.get('name')==title)
    for key,value in (replacements or {}).items():script=script.replace(key,value)
    assert '${{' not in script, title
    slug=title.lower().replace(' ','-').replace('/','-')
    file=repo.parent/(slug+'.sh');file.write_text(script,encoding='utf-8',newline='\n')
    env=os.environ.copy();env.update({k:str(v) for k,v in values.items()})
    # Both tools are local shims. No GitHub or registry write can occur.
    prefix=SHIMS.as_posix()
    if os.name=='nt':prefix='/'+prefix[0].lower()+prefix[2:]
    script_path=file.as_posix()
    wrapper='export PATH='+shlex.quote(prefix+':/usr/bin')+':"$PATH"; bash '+shlex.quote(script_path)
    proc=subprocess.run([BASH,'-c',wrapper],cwd=repo,env=env,capture_output=True,text=True,encoding='utf-8',timeout=60)
    (repo.parent/(slug+'.log')).write_text(proc.stdout+proc.stderr,encoding='utf-8')
    assert (proc.returncode==0)==(expected==0),(title,proc.returncode,proc.stdout,proc.stderr)
    return proc

for name in ['casbin-sqlx-adapter','casbin-jcasbin-jdbc-adapter','casbin-typeorm-adapter','casbin-mongodb-adapter']:
    out=CHECKS/name;out.mkdir(exist_ok=True)
    original=SOURCES/name
    project=next(p for p in replay.project_data() if p['id']==name)
    if git(original,'write-tree') != project['patched_tree']:
        raise ValueError('Restored source tree does not match checklist: '+name)
    git(original,'diff','--exit-code')
    archive=out/'patched.tar'
    git(original,'archive','--format=tar','--prefix=source/','-o',str(archive),project['patched_tree'])
    with tarfile.open(archive) as bundle:bundle.extractall(out,filter='data')
    repo=out/'source'
    git(repo,'init','-q')
    git(repo,'config','core.autocrlf','false')
    git(repo,'add','--all')
    git(repo,'-c','user.name=IRA workflow fixture','-c','user.email=ira@example.invalid','commit','-qm','test: local packaging fixture')
    steps=yaml.safe_load((repo/'.github/workflows/release.yml').read_text(encoding='utf-8'))['jobs']['release']['steps']
    result={'repo':name,'checks':[]}
    if name=='casbin-jcasbin-jdbc-adapter':
        version=ET.parse(repo/'pom.xml').getroot().findtext('{http://maven.apache.org/POM/4.0.0}version')
        run(repo,steps,'Verify the committed POM version',{'VERSION':'99.0.0'},1)
        run(repo,steps,'Verify the committed POM version',{'VERSION':version})
        result['checks'].append('POM mismatch rejected; committed version accepted without rewriting')
        meta='Resolve version from tag';build='Build the source package';field='src_name'
    elif name=='casbin-typeorm-adapter':
        version=json.loads((repo/'package.json').read_text())['version']
        git(repo,'tag','v'+version)
        run(repo,steps,'Build source release tarball',{'ARTIFACT':'mismatch-fixture','TAG':'v'+version,'BASE_VERSION':'99.0.0'},1)
        assert json.loads((repo/'package.json').read_text())['version']==version
        result['checks'].append('package version mismatch rejected without rewriting source')
        meta='Resolve release metadata';build='Build source release tarball';field='artifact'
    elif name=='casbin-sqlx-adapter':
        import tomllib
        version=tomllib.loads((repo/'Cargo.toml').read_text())['package']['version']
        meta='Resolve Tag';build='Build Apache Source Package';field='artifact'
    else:
        version='4.99.0';meta='Compute release metadata';build='Build source release tarball';field='basename'

    # Derive the metadata step by its behavior, not a guessed display label.
    metadata=[s for s in steps if 'run' in s and 'GITHUB_REF_NAME' in s['run']]
    assert len(metadata)==1
    meta=metadata[0]['name']
    payloads=[]
    for suffix in ['-rc1','']:
        tag='v'+version+suffix
        if not git(repo,'tag','--list',tag):git(repo,'tag',tag)
        output=out/('metadata'+('rc' if suffix else 'final')+'.txt')
        output.write_text('')
        workflow=yaml.safe_load((repo/'.github/workflows/release.yml').read_text(encoding='utf-8'))
        metadata_env={**workflow.get('env',{}),**workflow['jobs']['release'].get('env',{}),'GITHUB_REF_NAME':tag,'GITHUB_OUTPUT':output.as_posix()}
        run(repo,steps,meta,metadata_env)
        values=dict(line.split('=',1) for line in output.read_text().splitlines() if '=' in line)
        artifact=values[field]
        args={'TAG':tag,'BASE_VERSION':version,'ARTIFACT':artifact,'BASENAME':artifact,'SRC_NAME':artifact}
        run(repo,steps,build,args,replacements={'${{ steps.tag.outputs.artifact }}':artifact})
        filename=artifact if artifact.endswith('.tar.gz') else artifact+'.tar.gz'
        folder=repo/('dist-release' if name=='casbin-typeorm-adapter' else 'dist' if name=='casbin-mongodb-adapter' else '')
        built=folder/filename
        payloads.append(built.read_bytes())
        with tarfile.open(built) as bundle:
            files=[m for m in bundle.getmembers() if m.isfile()]
            for member in files:
                rel=member.name.split('/',1)[1]
                original=subprocess.check_output(['git','-C',str(repo),'show','HEAD:'+rel])
                assert bundle.extractfile(member).read()==original,(name,rel)
    assert payloads[0]==payloads[1],name+' RC/final bytes differ'
    result['checks'].append('RC and final tags on the same local fixture commit produce identical SHA-512 and source file bytes')
    result['fixture_archive_sha512']=hashlib.sha512(payloads[0]).hexdigest()
    if name=='casbin-typeorm-adapter':
        log=out/'mock-gh.log'
        run(repo,steps,'Create GitHub release',{'TAG':'v'+version+'-rc1','BASE_VERSION':version,'RC_NUMBER':'1','IS_RC':'true','MOCK_GH_LOG':log.as_posix()},1)
        assert log.read_text().splitlines()==['release view v'+version+'-rc1']
        result['checks'].append('existing release is rejected; mocked gh receives only release view, no edit/upload/create')
    results.append(result)
    print(json.dumps(result,ensure_ascii=False),flush=True)
(CHECKS/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
