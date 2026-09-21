# Evidence-backed preparation review

This update adds a structured preparation review to the existing workbench,
without a second state store or a new release provider. It addresses two failure
modes: an unresolved finding disappearing when a PR is reduced, and treating a
rule from another ecosystem as the whole project-specific review.

Each release owns its review history. PREP-01–08 and AUDIT-01–07 begin pending;
additional findings can describe individual components, ecosystems or channels.
Every update is appended under a stable ID. There is no delete operation, and
updates cannot silently retarget an existing finding to another component.
Resolved and non-applicable records require observations, a basis, evidence,
a disposition and reviewer identity; accepted exceptions additionally name the
decision authority. The server stamps the repository snapshot and time. Changed
source or release check settings makes closed records require review again.

The API enforces record completeness, concurrency and state transitions. It does
not authenticate a claimed human reviewer, inspect linked evidence, decide legal
compliance, or infer a registry naming policy. A record of an Agent's rationale
is not an exception approval. Project notes and the canonical readiness standard
remain part of every Agent packet.

Existing schema-1 state loads without rewriting or inventing historical review.
The new log is optional until an explicit update. Existing completed operations
remain historical facts when a new blocker is added. Current review blockers
are shown separately and prevent new preparation-complete / subsequent-stage
progress claims. Editing organizational phases or drafting mail grants no release
approval and does not execute publication.

## Use the review

Open **准备审查** in a release. Blockers and stale results appear first. Update a
standard gate or add a project-specific finding with a stable ID such as
`NAME-01`. Once saved, its title/component and a non-empty ecosystem cannot be
reassigned; give a mistaken item a reasoned non-applicable disposition and add
the correct item. Previous updates remain visible.

Another task for the same project and exact version inherits the latest task's
review log with `readinessInheritedFrom`. A new RC label makes closed entries
stale; unresolved issues stay unresolved and progress starts pending. Different
versions/projects start with their own pending gates: this is not a cross-version
issue tracker, so carry applicable findings to a different version explicitly.

## Agent API

Read `/api/packet?releaseId=ID` for `readiness.items`, `readiness.unresolved`,
`readiness.ready`, `readiness.revision`, `readinessText` and instructions.
`/api/progress` also returns readiness and prefixes its text with review status.
Submit one full item using `recordReadiness`. Take the revision, Git snapshot and context
from `readiness.revision`, `readiness.snapshot` and `readiness.context` in the
packet. The context is
`JSON.stringify([release.version, release.rc, release.toolchain, project.incubating])`.
On a conflict, reload and reconcile the evidence, not just the revision value.

```json
{
  "op": "recordReadiness",
  "releaseId": "<release id>",
  "readinessRevision": 0,
  "readinessSnapshot": "<packet readiness.snapshot>",
  "readinessContext": "[\"1.0.0\",\"RC1\",\"builtin\",true]",
  "readiness": {
    "id": "NAME-01",
    "title": "Component package identity",
    "component": "Example adapter",
    "ecosystem": "Cargo / crates.io",
    "status": "blocked",
    "observed": "Manifest and consumer instructions need project identity review.",
    "basis": "Project review; do not substitute Maven naming rules.",
    "evidence": "<manifest path, candidate and review reference>",
    "disposition": "",
    "exception": false,
    "authority": "",
    "reviewer": "Agent",
    "nextAction": "Assess naming, registry control and consumer migration.",
    "changeReason": "Record a source-affecting issue before candidate creation."
  }
}
```

States are `pending`, `blocked`, `pass`, `not-applicable`. Closure requires
ecosystem, observation, basis, evidence, disposition and reviewer. Exceptions
also require the actual authority and decision evidence. Do not submit the
server-generated `at`, `snapshot`, `context` or derived `stale` inside the item.
The API does not establish that an asserted reviewer or decision is authentic.

The progress guard rejects deletion of existing step IDs. Incomplete review
rejects new `done` claims for `prepare`/`verify`, new `running`/`done` claims for
`sign`/`stage`/`vote`/`publish`/`announce`, and overall `complete`. Historical
operations can remain unchanged in a blocked report. Custom labels are not
interpreted semantically; overall completion is still blocked. External tools
and release authorization remain outside this recording guard.
