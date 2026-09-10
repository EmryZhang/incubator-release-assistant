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

"""Refresh the file inventory after reviewing an intentional bundle edit."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
files = {
    p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
    for p in sorted(root.rglob("*"))
    if p.is_file() and p.name != "integrity.json" and "__pycache__" not in p.parts
}
(root / "integrity.json").write_text(
    json.dumps({"algorithm": "sha256", "files": files}, indent=2) + "\n", encoding="utf-8", newline="\n"
)
print(f"Recorded {len(files)} files")
