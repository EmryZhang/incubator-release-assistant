# Source metadata checks

This optional, read-only repository tool covers selected Maven and Cargo
metadata fields that were missed during release preparation. It complements
the [official rule map](release-readiness.md#official-authority-and-common-rule-map)
and required evidence record. It is not a release adapter or legal approval.
Python 3.11 or newer is sufficient; it does not install dependencies, build,
sign, connect to registries or publish.

Run it against a disposable extraction of the exact reviewed source archive,
using the identity selected for this project/component. For example:

```text
python scripts/check_release_metadata.py --source /review/jcasbin --ecosystem maven --apache-project "Apache Casbin" --expected-package jcasbin --expected-group org.apache.casbin --expected-repository https://github.com/apache/casbin-jcasbin --output /evidence/jcasbin-metadata.json
python scripts/check_release_metadata.py --source /review/sqlx --ecosystem cargo --apache-project "Apache Casbin" --expected-package casbin-sqlx-adapter --expected-library sqlx_adapter --expected-repository https://github.com/apache/casbin-sqlx-adapter --output /evidence/sqlx-metadata.json
```

These names illustrate project-specific inputs, not defaults imposed on other
projects. A proposed name still needs the applicable project review. The Cargo
mode currently checks library packages with an explicit expected import name.

The JSON report includes inspected-file hashes, expected identities, individual
checks, findings and coverage limits. Exit 0 means only these metadata checks
passed; exit 1 means a mismatch or unreadable/unsupported input needs review.
Compare report hashes to the candidate inventory. An inherited or workspace
manifest may require a separate effective-metadata review rather than editing
the source merely to satisfy this intentionally limited reader.

| Scope | Checks performed |
| --- | --- |
| Shared | Nonempty LICENSE, NOTICE and reference DISCLAIMER exist |
| Maven source POM | Selected groupId/artifactId, complete reference disclaimer in description, Apache project developer entry, Apache-2.0 license URL, expected SCM URL |
| Cargo library | Selected package name, effective library target name, Apache-2.0 metadata, expected repository and full reference disclaimer in the packaged README |

The reference disclaimer must first be reviewed against current Incubator
policy: copying an incorrect disclaimer consistently is not compliance. Legal
file contents/provenance, bundled license obligations, SCM connection fields,
generated/published metadata, consumer resolution, all displayed coordinates
and links, release workflows, registry ownership, builds and votes remain
separate checks. Do not close an earlier finding just because this tool passes.

Run deterministic regressions with:

```text
python scripts/test_release_metadata.py
```

The cases include a legacy Maven coordinate, missing disclaimer/developer after
coordinate repair, Cargo identity without an invented universal prefix, import
breakage after a package rename, README display, missing legal input and unsafe
references. They are synthetic regression tests, not Agent/Skill benchmark
results. Applying the checker to an actual RC1 and its corrected candidate must
retain the exact inputs and disclose that the historical defects are known.

When Docker is unavailable, inspect available native tools and isolated local
database processes before classifying all tests as blocked. Preserve installed
services and their data, bind temporary databases to loopback on separate ports,
record versions/features and stop the temporary processes afterward. Do not
change production dependencies or require a toolchain migration merely to
accommodate a local setup problem. A skipped check remains unverified.
