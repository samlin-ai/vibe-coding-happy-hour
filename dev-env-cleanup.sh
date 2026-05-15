#!/usr/bin/env bash

set -euo pipefail

REPO_DIR="$HOME/vibe-coding-happy-hour"
LOG_DIR="$HOME/logs"

echo "Removing folders: $REPO_DIR & $LOG_DIR"
rm -rf "$REPO_DIR"
rm -rf "$LOG_DIR"
