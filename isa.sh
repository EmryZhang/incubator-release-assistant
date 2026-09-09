#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$root"
if [ ! -f node_modules/tsx/dist/cli.mjs ]; then
  printf '%s\n' 'Run npm install in the ISA repository first.' >&2
  exit 1
fi
if [ "$#" -eq 0 ]; then set -- serve; fi
if [ "$1" = serve ]; then set -- "$@" --dev; fi
exec node "$root/node_modules/tsx/dist/cli.mjs" "$root/src/server/cli.ts" "$@"
