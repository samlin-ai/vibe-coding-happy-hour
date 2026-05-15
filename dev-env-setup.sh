#!/usr/bin/env bash
# Dev env setup for Cloud Sandbox (Google Cloud Shell Editor).
# Automates the scriptable steps in dev-env-setup.md.
# Manual steps first: login builder[n]@csequityai.org in Chrome, zoom to 150%+,
# open https://shell.cloud.google.com/, then run this script in a Cloud Shell terminal.

set -euo pipefail

REPO_URL="https://github.com/samlin-ai/vibe-coding-happy-hour.git"
REPO_DIR="$HOME/vibe-coding-happy-hour"
GCP_PROJECT_NAME="VibeCodingHappyHour"
TEAM_DIR="$REPO_DIR/examples/$(whoami)"
LOG_DIR="$HOME/logs"

HTTP_PORT="${HTTP_PORT:-8080}"

log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$*" >&2; }

log "Cloning repo (if needed)"
if [ -d "$REPO_DIR/.git" ]; then
  echo "Repo already exists at $REPO_DIR, pulling latest."
  git -C "$REPO_DIR" pull --ff-only || warn "git pull failed; continuing"
else
  git clone "$REPO_URL" "$REPO_DIR"
fi

log "Setting gcloud project to $GCP_PROJECT_NAME"
if command -v gcloud >/dev/null 2>&1; then
  PROJECT_ID="$(gcloud projects list --filter="name:'$GCP_PROJECT_NAME'" --format="value(projectId)" | head -n1)"
  if [ -n "$PROJECT_ID" ]; then
    gcloud config set project "$PROJECT_ID"
  else
    warn "No project named $GCP_PROJECT_NAME found for this account; skipping."
  fi
else
  warn "gcloud not found; skipping project set. (Expected on non-Cloud-Shell machines.)"
fi

log "Creating team folder: $TEAM_DIR"
mkdir -p "$TEAM_DIR"
mkdir -p "$LOG_DIR"

log "Starting HTTP server on port $HTTP_PORT (background)"
LOG_FILE="$LOG_DIR/.http-server.log"
PID_FILE="$LOG_DIR/.http-server.pid"
if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "HTTP server already running (pid $(cat "$PID_FILE"))."
else
  (cd "$TEAM_DIR" && nohup python3 -m http.server "$HTTP_PORT" >"$LOG_FILE" 2>&1 &
   echo $! > "$PID_FILE")
  sleep 1
  echo "Server pid: $(cat "$PID_FILE")  log: $LOG_FILE"
fi

cat <<EOF

Next steps (manual):
  1. cd "$TEAM_DIR" && gemini      # start Gemini CLI in this folder
  2. Click the Cloud Shell "Web Preview" button (port $HTTP_PORT) to view the app.
  3. Pre-test the live demo prompt, e.g.:
       Build a simple Tetris web game without frameworks.
     Remember to remove the generated code before the session.

To stop the HTTP server:
  kill \$(cat "$PID_FILE")
EOF
