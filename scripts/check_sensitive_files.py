#!/usr/bin/env python3
"""Fail when tracked files contain common publication hazards."""

from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
paths = subprocess.check_output(
    ["git", "-C", str(ROOT), "ls-files"], text=True
).splitlines()

problems = []
secret_patterns = {
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "GitHub token": re.compile(r"(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})"),
    "AWS access key": re.compile(r"\bAKIA[A-Z0-9]{16}\b"),
    "private IPv4 address": re.compile(
        r"\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b"
    ),
    "Tailscale IPv4 address": re.compile(r"\b100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}\b"),
}

for relative in paths:
    path = Path(relative)
    name = path.name
    if name == ".env" or (name.startswith(".env.") and name != ".env.example"):
        problems.append(f"{relative}: local environment file")
    if name == "config.local.js":
        problems.append(f"{relative}: private local configuration")
    if path.suffix.lower() in {".pem", ".key", ".p12", ".pfx"}:
        problems.append(f"{relative}: key or certificate container")
    if any(part in {".secrets", "secrets", "node_modules", ".vscode"} for part in path.parts):
        problems.append(f"{relative}: forbidden tracked directory")

    full_path = ROOT / path
    if not full_path.is_file() or full_path.stat().st_size > 1_000_000:
        continue
    text = full_path.read_text(encoding="utf-8", errors="ignore")
    for label, pattern in secret_patterns.items():
        if pattern.search(text):
            problems.append(f"{relative}: {label}")

if problems:
    print("Sensitive-file guard failed:", file=sys.stderr)
    for problem in sorted(set(problems)):
        print(f"- {problem}", file=sys.stderr)
    sys.exit(1)

print(f"Sensitive-file guard passed for {len(paths)} tracked files")
