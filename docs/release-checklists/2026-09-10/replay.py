#!/usr/bin/env python3
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

"""Verify the published bundle, restore reviewed source trees, or rerun RAT.

Requires Python 3.12+ and Git; RAT additionally needs Java and a supplied JAR.
Never commits, pushes, signs, publishes, or executes target-project code.
"""
import argparse
import hashlib
import json
import subprocess
import tarfile
import xml.etree.ElementTree as ET
from pathlib import Path

HERE = Path(__file__).resolve().parent


def run(*args, cwd=None):
    return subprocess.check_output(args, cwd=cwd, stderr=subprocess.PIPE).decode("utf-8").strip()


def verify():
    manifest = json.loads((HERE / "integrity.json").read_text(encoding="utf-8"))
    for name, digest in manifest["files"].items():
        file = (HERE / name).resolve()
        if not file.is_relative_to(HERE):
            raise ValueError("Manifest path escapes bundle")
        if hashlib.sha256(file.read_bytes()).hexdigest() != digest:
            raise ValueError(f"Bundle hash mismatch: {name}")
    print(f"Verified {len(manifest['files'])} bundled files")


def project_data():
    return json.loads((HERE / "projects.json").read_text(encoding="utf-8"))["projects"]


def restore(project, destination):
    repo = destination / project["id"]
    if repo.exists():
        raise ValueError(f"Destination exists; choose a fresh output directory: {repo}")
    destination.mkdir(parents=True, exist_ok=True)
    run("git", "clone", "-c", "core.autocrlf=false", "--no-checkout", project["repository"], str(repo))
    run("git", "checkout", "--detach", project["base_commit"], cwd=repo)
    if project["patch"]:
        run("git", "apply", "--index", str(HERE / project["patch"]), cwd=repo)
        actual = run("git", "write-tree", cwd=repo)
        if actual != project["patched_tree"]:
            raise ValueError(f"Restored tree mismatch: {project['id']} {actual}")
    print(f"Restored {project['id']} at {project['base_commit']} with recorded patch")


def rat(project, sources, destination, jar):
    repo = sources / project["id"]
    if not project["patched_tree"]:
        raise ValueError("No patched RAT baseline is recorded for this project")
    if run("git", "rev-parse", "HEAD", cwd=repo) != project["base_commit"]:
        raise ValueError("Source checkout is not the recorded baseline commit")
    if run("git", "write-tree", cwd=repo) != project["patched_tree"]:
        raise ValueError("Source index does not match the recorded patched tree")
    run("git", "diff", "--exit-code", cwd=repo)
    out = destination / project["id"]
    if out.exists():
        raise ValueError(f"Report destination exists: {out}")
    out.mkdir(parents=True)
    archive = out / "source.tar"
    run("git", "archive", "--format=tar", "--prefix=source/", "-o", str(archive), project["patched_tree"], cwd=repo)
    with tarfile.open(archive) as bundle:
        bundle.extractall(out, filter="data")
    source = out / "source"

    def scan(folder, filename, exclusions=None):
        report = out / filename
        command = ["java", "-jar", str(jar), "--output-style", "xml", "--output-file", str(report), "--input-include-std", "HIDDEN_DIR"]
        if exclusions:
            command += ["--input-exclude-file", str(exclusions)]
        proc = subprocess.run(command + ["--", str(folder)], capture_output=True)
        report.with_suffix(".stderr.txt").write_bytes(proc.stderr)
        document = ET.parse(report).getroot()
        bad = [r.get("name") for r in document.findall("resource") if any(l.get("approval") == "false" for l in r.findall("license"))]
        if proc.returncode or bad:
            raise ValueError(f"RAT failed: {report}; unapproved={bad}")

    scan(source, "rat.xml", source / ".rat-excludes")
    if project["id"] == "casbin-sqlx-adapter":
        folder = out / "rust-text-scan"
        folder.mkdir()
        mapping = []
        for file in sorted((source / "src").glob("*.rs")):
            data = file.read_bytes()
            (folder / (file.name + ".txt")).write_bytes(data)
            mapping.append({"source": "src/" + file.name, "sha512": hashlib.sha512(data).hexdigest()})
        (out / "rust-map.json").write_text(json.dumps(mapping, indent=2), encoding="utf-8")
        scan(folder, "rust-rat.xml")
    print(f"RAT passed for {project['id']}; inspect {out} and the exact exclusions")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["verify", "restore", "rat"])
    parser.add_argument("--project", default="all", help="Project ID, or all (the four patched projects)")
    parser.add_argument("--output", type=Path)
    parser.add_argument("--sources", type=Path)
    parser.add_argument("--rat-jar", type=Path)
    args = parser.parse_args()
    verify()
    if args.command == "verify":
        return
    selected = [p for p in project_data() if (bool(p["patch"]) if args.project == "all" else p["id"] == args.project)]
    if not selected or args.output is None:
        parser.error("Choose a listed project and supply --output")
    if args.command == "rat" and (args.sources is None or args.rat_jar is None):
        parser.error("rat requires --sources and --rat-jar")
    for project in selected:
        if args.command == "restore":
            restore(project, args.output.resolve())
        else:
            rat(project, args.sources.resolve(), args.output.resolve(), args.rat_jar.resolve())


if __name__ == "__main__":
    main()
