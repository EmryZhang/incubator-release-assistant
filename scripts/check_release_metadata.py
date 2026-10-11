# SPDX-License-Identifier: Apache-2.0
"""Read-only Maven/Cargo metadata checks; not release or legal approval.

Python 3.11+, standard library only. Expected identities are caller-supplied
project decisions, not inferred universal namespace rules. No builds/network.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys
import tomllib
import xml.etree.ElementTree as ET

def normalized(text):
    return ' '.join(text.split())

def inspect(source, ecosystem, apache_project, expected_package,
            expected_repository, expected_group=None, expected_library=None):
    source = Path(source).resolve()
    findings, checks, hashes = [], [], {}
    def check(rule, path, condition, message):
        row = {'id': rule, 'path': path, 'status': 'pass' if condition else 'fail', 'message': message}
        checks.append(row)
        if not condition:
            findings.append(row)
    def read(name):
        path = (source / name).resolve()
        if not path.is_relative_to(source):
            raise ValueError('Referenced file is outside the inspected source directory')
        data = path.read_bytes()
        hashes[name] = hashlib.sha256(data).hexdigest()
        return data.decode('utf-8-sig')
    try:
        disclaimer = normalized(read('DISCLAIMER'))
        check('INC-DISCLAIMER-FILE', 'DISCLAIMER', bool(disclaimer), 'A nonempty reference disclaimer is required; its policy correctness needs separate review.')
        for name in ('LICENSE', 'NOTICE'):
            check('LEGAL-FILE-'+name, name, bool(read(name).strip()), 'Required legal file is present; text/coverage need separate review.')
        if ecosystem == 'maven':
            if not expected_group:
                raise ValueError('Maven checks require --expected-group from the applicable project decision')
            data = read('pom.xml')
            if '<!DOCTYPE' in data.upper() or '<!ENTITY' in data.upper():
                raise ValueError('DTD/entity declarations are not accepted by this metadata reader')
            pom = ET.fromstring(data)
            ns = {'m': 'http://maven.apache.org/POM/4.0.0'}
            text = lambda name: (pom.findtext('m:'+name, default='', namespaces=ns) or '').strip()
            check('INC-MAVEN-GROUP', 'pom.xml', text('groupId') == expected_group, 'Source groupId must match the selected project coordinate.')
            check('INC-MAVEN-ARTIFACT', 'pom.xml', text('artifactId') == expected_package, 'Source artifactId must match the selected component.')
            check('INC-MAVEN-DESCRIPTION', 'pom.xml', bool(disclaimer) and disclaimer in normalized(text('description')), 'Description must contain the full reviewed disclaimer, not just Incubating.')
            names = [x.text for x in pom.findall('m:developers/m:developer/m:name', ns)]
            check('INC-MAVEN-DEVELOPER', 'pom.xml', apache_project in names, 'Developer entries include the Apache project; individual attribution may remain.')
            urls = [x.text or '' for x in pom.findall('m:licenses/m:license/m:url', ns)]
            check('INC-MAVEN-LICENSE', 'pom.xml', any(u.rstrip('/').replace('http://','https://') in ('https://www.apache.org/licenses/LICENSE-2.0','https://www.apache.org/licenses/LICENSE-2.0.txt') for u in urls), 'POM declares the Apache-2.0 license URL.')
            repository = expected_repository.rstrip('/').removesuffix('.git')
            check('INC-MAVEN-SCM', 'pom.xml', text('scm/m:url').rstrip('/').removesuffix('.git') == repository, 'SCM URL points to the expected repository.')
        elif ecosystem == 'cargo':
            if not expected_library:
                raise ValueError('Cargo checks require --expected-library to make import compatibility explicit')
            manifest = tomllib.loads(read('Cargo.toml'))
            package = manifest.get('package', {})
            check('INC-IDENTITY-PACKAGE', 'Cargo.toml', package.get('name') == expected_package, 'Cargo package matches the selected project/component name; no universal apache- prefix is imposed.')
            library = manifest.get('lib', {}).get('name', str(package.get('name','')).replace('-','_'))
            check('CARGO-LIBRARY', 'Cargo.toml', library == expected_library, 'Resolved library name preserves the selected consumer import.')
            check('CARGO-LICENSE', 'Cargo.toml', package.get('license') == 'Apache-2.0', 'First-party package metadata declares Apache-2.0; dependency licensing is separate.')
            check('CARGO-REPOSITORY', 'Cargo.toml', str(package.get('repository','')).rstrip('/').removesuffix('.git') == expected_repository.rstrip('/').removesuffix('.git'), 'Repository metadata matches the expected project.')
            readme = package.get('readme', 'README.md')
            if not isinstance(readme, str):
                raise ValueError('Cargo README must name a reviewable file')
            check('INC-DISCLAIMER-README', readme, bool(disclaimer) and disclaimer in normalized(read(readme)), 'Packaged README contains the full reviewed disclaimer.')
        else:
            raise ValueError('Unsupported ecosystem')
    except (OSError, UnicodeError, ValueError, ET.ParseError) as error:
        check('INPUT-UNVERIFIED', '.', False, str(error))
    return {'scope': 'source metadata only', 'ecosystem': ecosystem, 'source': str(source),
            'expected': {'apache_project': apache_project, 'package': expected_package, 'group': expected_group, 'library': expected_library, 'repository': expected_repository},
            'files_sha256': hashes, 'checks': checks, 'findings': findings,
            'metadata_checks_pass': not findings,
            'limits': ['No approval, provenance or LICENSE/NOTICE completeness decision.',
                       'Reference DISCLAIMER text must be separately checked against current policy.',
                       'No effective/published POM, generated artifact, README coordinate/link, workflow, registry-control, signature, build or vote verification.',
                       'Prior unresolved findings remain open until separately evidenced; this report cannot close them.']}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--ecosystem', required=True, choices=['maven','cargo'])
    parser.add_argument('--apache-project', required=True)
    parser.add_argument('--expected-package', required=True)
    parser.add_argument('--expected-repository', required=True)
    parser.add_argument('--expected-group')
    parser.add_argument('--expected-library')
    parser.add_argument('--output', type=Path)
    args = vars(parser.parse_args())
    output = args.pop('output')
    if output and output.resolve().is_relative_to(args['source'].resolve()):
        parser.error('--output must be outside the inspected source directory')
    report = inspect(**args)
    data = json.dumps(report, indent=2) + '\n'
    if output:
        output.write_text(data, encoding='utf-8')
    else:
        print(data, end='')
    return 0 if report['metadata_checks_pass'] else 1

if __name__ == '__main__':
    sys.exit(main())
