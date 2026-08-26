# Release readiness standard

This is the non-negotiable release standard for every IRA adapter and RC. CI
answers whether the selected commit passed the project's normal automated
checks. It does not alone establish that the final source package is safe and
permitted to distribute as an Apache release.

## Before signing an RC

1. Select one exact upstream commit and retain evidence that its target-project
   CI passed.
2. Build the final source archive from that commit; inspect its top-level layout
   and required files, not merely the working tree.
3. Run Apache RAT on that final source archive. Resolve every finding. An
   exclusion is acceptable only when its file/pattern, origin, applicable
   license, reason, attribution location, reviewer, and review date are
   documented. Do not add broad exclusions merely to produce a clean report.
4. Perform a human review of the archive's `LICENSE`, `NOTICE`, `DISCLAIMER`,
   bundled or copied third-party material, generated files, test fixtures,
   images, archives, and other files that cannot carry normal ASF headers.
5. Do not sign until the archive has zero unexplained RAT findings and the
   review records identify any remaining legal or provenance follow-up.

## Before a binding release vote

1. Download the signed public RC and verify its checksum, detached signature,
   and public `KEYS` entry.
2. Independently unpack the source archive, build it, and run the appropriate
   project tests. This is a reviewer responsibility; IRA `prepare` deliberately
   does not execute untrusted target-project code.
3. Confirm that the files proposed for voting are the immutable archive,
   checksum, and signature that will be promoted if the vote passes.

If any of those files changes, create a new RC number and repeat the review.
