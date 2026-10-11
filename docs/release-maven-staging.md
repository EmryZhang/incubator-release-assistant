# Maven staging and replacement candidates

Use this checklist with the readiness standard and evidence record. It records
the JCasbin RC2 review lesson without making its hosting choice a universal ASF
requirement. Official policy and actual project review remain authoritative.
Sources below were checked 2026-10-11.

## During preparation

Identify exact GAV, main/sources/Javadoc JARs and flattened POM. Check source
correspondence, embedded metadata, incubation display and legal-file placement
for each format. Inspect resources copied by the actual JDK/doclet, nested
libraries and their license texts. A source-only ballot does not dispose of a
known request to review the planned convenience binaries.

Choose staging and promotion routes before the first preparation PR if they
change POMs, workflows or distribution contents. Separate upload/close from
release/promotion. Trace final tags, manual/reusable workflows and retries so
they cannot publish an unapproved candidate, rebuild different binaries after
review or duplicate publication. Promote the reviewed Maven originals. Never
run a real deploy as a settings test. Audit any newly introduced staging tool
and its actual dependency realm; a Nexus-specific extension is not mandatory
for the ordinary Maven deploy and manual close/promote route.

For ASF Nexus, verify that the actual profile covers the groupId, its LDAP
mapping and the release manager's deployment permission. ASF login, another
visible profile and Central Portal permission do not establish Nexus permission.
Anonymous HTTP 401 does not prove a profile is absent. Ask Infra to check
existing configuration before creating a duplicate. INFRA Jira tickets require
authentication to read/comment; an anonymous search error is not evidence that
no request exists. Prepare the project URL, source repository, groupIds and
responsible PMC for the official setup request; Infra configures LDAP mapping.
Keep credentials outside
Git/evidence; this route uses server ID `apache.releases.https`.

Local preparation can pass before a real staging repository exists. Resolve
known source-affecting decisions before submission; authenticated upload,
signatures, repository URL and votes are later gates. A new defect after merge
requires a reported blocker and validated correction before the project's
process exception; do not silently open another preparation PR or push directly.

## Before voting

Stage signed source originals in ASF dev distribution. Upload Maven artifacts
to the selected review repository and close it without releasing it. ASF Nexus
does not accept SHA-256/SHA-512 sidecars; retain SHA-512 in the evidence manifest
separately. ASF source archives still require their SHA-512 sidecars.

Record the real repository ID, closed state, public URL and file manifest.
Independently download the JARs/POM/signatures; verify hashes, public KEYS, GAV,
legal files, metadata and source correspondence. Named human review must cover
these binaries and documentation resources; old source review does not cover
added artifact types.

The ballot identifies candidate/tag/commit, source and Maven URLs, verification
material and test scope. A sequential IPMC request links the dev ballot and
result. A concurrent request links the active dev ballot and says endorsement
is pending. Do not invent a dev result or count PPMC-only votes as IPMC binding.

For a cancelled candidate, preserve files and historical results, reconcile
findings and assign the replacement a new RC number. Start fresh PPMC/IPMC
ballots; cancelled RC votes do not transfer. Each component and voting body
keeps separate tally, roles and result. Check cancellation delivery using reply
headers and the original thread's reply tree: a changed subject can appear
separately in the archive index without breaking the reply relation.

## After approval

Promote approved source and staged Maven originals after required project
endorsement/IPMC approval and corresponding authorization. Inspect public state
before retries, avoid overwrites and verify registry/download display and
consumer resolution afterward. Close is review preparation, not publication.

## Basis and public case

- [ASF Maven guide](https://infra.apache.org/publishing-maven-artifacts.html): profile/LDAP setup, signing, close/vote/promote and podling IPMC approval.
- [Infra Jira guidelines](https://infra.apache.org/jira-guidelines): authenticated INFRA search and setup-request access.
- [ASF release policy](https://www.apache.org/legal/release-policy.html): source, binary correspondence, signing and approval.
- [Incubation Policy](https://incubator.apache.org/policy/incubation.html#releases): distinct project/IPMC approval and sequential or concurrent voting.
- [Third-party license policy](https://www.apache.org/legal/resolved.html#javadoc): actual documentation resources and their permissions.
- [Curator guide](https://curator.apache.org/community/releasing-curator/): practical source/Maven staging example; its TLP process does not replace podling approvals.
- JCasbin RC2: [PJ's binary finding](https://lists.apache.org/thread/5fs0rnw9sdb8h2osmrhlkd0zvm65p3wh), [tison's staging/template finding](https://lists.apache.org/thread/p67byy9314jx7qcghgsk278nsbo2s2pl), [RM cancellation](https://lists.apache.org/thread/4cjsgl0qp14d0sb552xlvd1qnjq7dj47). Duplicate tar.gz/ZIP was a separate suggestion, not a Maven-review waiver.
