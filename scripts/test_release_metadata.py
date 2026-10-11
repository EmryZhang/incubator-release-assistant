# SPDX-License-Identifier: Apache-2.0
"""Regression checks for failures missed in release preparation; no network."""
import tempfile
from pathlib import Path
import subprocess
import sys
import unittest
from check_release_metadata import inspect

DISCLAIMER = 'Apache Example is undergoing incubation. The project has yet to be fully endorsed by the ASF.'
POM = '''<project xmlns="http://maven.apache.org/POM/4.0.0">
<groupId>org.apache.example</groupId><artifactId>library</artifactId>
<description>Library. DISCLAIMER</description>
<developers><developer><name>Apache Example</name></developer><developer><name>Original Contributor</name></developer></developers>
<licenses><license><url>https://www.apache.org/licenses/LICENSE-2.0.txt</url></license></licenses>
<scm><url>https://github.com/apache/example</url></scm></project>'''.replace('DISCLAIMER',DISCLAIMER)
CARGO = '''[package]
name = "example-adapter"
version = "1.0.0"
license = "Apache-2.0"
repository = "https://github.com/apache/example"
readme = "README.md"
[lib]
name = "adapter"
'''

class MetadataRegression(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for name,text in {'LICENSE':'license fixture','NOTICE':'notice fixture','DISCLAIMER':DISCLAIMER,'README.md':DISCLAIMER,'pom.xml':POM,'Cargo.toml':CARGO}.items():
            (self.root/name).write_text(text,encoding='utf-8')
    def run_check(self, ecosystem='maven', **kwargs):
        args=dict(source=self.root,ecosystem=ecosystem,apache_project='Apache Example',expected_package='library' if ecosystem=='maven' else 'example-adapter',expected_repository='https://github.com/apache/example',expected_group='org.apache.example',expected_library='adapter')
        args.update(kwargs)
        return inspect(**args)
    def change(self,name,old,new):
        p=self.root/name
        p.write_text(p.read_text().replace(old,new),encoding='utf-8')
    def ids(self, report):
        return {f['id'] for f in report['findings']}
    def test_complete_maven_with_original_contributor(self):
        self.assertTrue(self.run_check()['metadata_checks_pass'])
    def test_rc1_legacy_group(self):
        self.change('pom.xml','org.apache.example','org.example')
        self.assertIn('INC-MAVEN-GROUP',self.ids(self.run_check()))
    def test_coordinate_fix_does_not_hide_missing_description(self):
        self.change('pom.xml',DISCLAIMER,'Incubating')
        self.assertEqual({'INC-MAVEN-DESCRIPTION'},self.ids(self.run_check()))
    def test_individual_developer_is_not_project_entry(self):
        self.change('pom.xml','<name>Apache Example</name>','<name>Another Individual</name>')
        self.assertIn('INC-MAVEN-DEVELOPER',self.ids(self.run_check()))
    def test_malformed_input_is_unverified(self):
        (self.root/'pom.xml').write_text('<project>')
        self.assertIn('INPUT-UNVERIFIED',self.ids(self.run_check()))
    def test_missing_notice_is_not_pass(self):
        (self.root/'NOTICE').unlink()
        self.assertIn('INPUT-UNVERIFIED',self.ids(self.run_check()))
    def test_cargo_identity_does_not_require_apache_prefix(self):
        self.assertTrue(self.run_check('cargo')['metadata_checks_pass'])
    def test_rc1_generic_crate_name(self):
        self.change('Cargo.toml','example-adapter','adapter')
        self.assertIn('INC-IDENTITY-PACKAGE',self.ids(self.run_check('cargo')))
    def test_rename_preserves_library_import(self):
        self.change('Cargo.toml','[lib]\nname = "adapter"','')
        self.assertEqual({'CARGO-LIBRARY'},self.ids(self.run_check('cargo')))
    def test_archive_disclaimer_does_not_replace_readme_display(self):
        (self.root/'README.md').write_text('Incubating')
        self.assertIn('INC-DISCLAIMER-README',self.ids(self.run_check('cargo')))
    def test_no_empty_disclaimer_false_positive(self):
        (self.root/'DISCLAIMER').write_text('')
        self.assertIn('INC-DISCLAIMER-FILE',self.ids(self.run_check('cargo')))
    def test_readme_cannot_escape_source(self):
        self.change('Cargo.toml','README.md','../README.md')
        self.assertIn('INPUT-UNVERIFIED',self.ids(self.run_check('cargo')))
    def test_expected_identity_is_required(self):
        self.assertIn('INPUT-UNVERIFIED',self.ids(self.run_check(expected_group=None)))
    def test_cli_cannot_write_into_reviewed_source(self):
        output=self.root/'audit.json'
        p=subprocess.run([sys.executable,str(Path(__file__).with_name('check_release_metadata.py')),'--source',str(self.root),'--ecosystem','maven','--apache-project','Apache Example','--expected-package','library','--expected-group','org.apache.example','--expected-repository','https://github.com/apache/example','--output',str(output)],capture_output=True)
        self.assertEqual(2,p.returncode)
        self.assertFalse(output.exists())

if __name__ == '__main__':
    unittest.main()
