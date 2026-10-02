#!/usr/bin/env bash
# wt.sh - git worktree helper for the EnglishForce monorepo (Node/React)
# Creates a worktree, links .env files from the main worktree's
# EnglishForce-backend/ and EnglishForce-frontend/ folders (a hardcoded
# list below, not parsed from .gitignore), and runs npm/yarn/pnpm install
# in each.
#
# Install (macOS/Linux):
#   chmod +x wt.sh
#   sudo cp wt.sh /usr/local/bin/wt   (or add its folder to PATH)
#
# Install (Windows, via Git Bash):
#   mkdir -p ~/bin
#   cp wt.sh ~/bin/wt.sh
#   chmod +x ~/bin/wt.sh
#   echo 'wt() { ~/bin/wt.sh "$@"; }' >> ~/.bashrc
#   Restart Git Bash (or `source ~/.bashrc`)
#
#   For real symlinks (not the copy fallback below) on Windows, turn on:
#   Settings > Privacy & Security > For developers > Developer Mode
#
# Run without installing:
#   No install needed. From inside the repo (any subfolder), in Git Bash:
#     bash EnglishForce-general/Script/wt.sh add feature/login
#   or make it executable once and run it directly:
#     chmod +x EnglishForce-general/Script/wt.sh
#     ./EnglishForce-general/Script/wt.sh add feature/login
#   The install steps above only add a global `wt` shortcut - skip them
#   if calling the file directly is fine.
#
# Usage:
#   wt add <branch> [path]        # existing local or origin branch, or creates new one
#   With no [path], the worktree is created inside a shared
#   EnglishForce-worktrees/ folder next to the repo, e.g.
#   ../EnglishForce-worktrees/feature-login
#
# Examples:
#   wt add feature/login
#   wt add feature/login ../myapp-login

set -euo pipefail

# The first entry of `git worktree list` is always the main worktree, even
# when this script is run from inside a linked one
MAIN_WORKTREE="$(git worktree list --porcelain | sed -n '1s/^worktree //p')"

# All worktrees are created inside this shared folder, next to the repo
WORKTREES_ROOT="$(dirname "$MAIN_WORKTREE")/EnglishForce-worktrees"

# Packages in this monorepo that carry their own .env and package.json
PROJECT_DIRS=(EnglishForce-backend EnglishForce-frontend)

usage() {
  echo "Usage: wt add <branch> [path]"
  exit 1
}

[[ $# -lt 2 ]] && usage
[[ "$1" != "add" ]] && usage
shift

BRANCH="$1"
WT_PATH="${2:-$WORKTREES_ROOT/${BRANCH//\//-}}"

mkdir -p "$(dirname "$WT_PATH")"

echo "==> Creating worktree for '$BRANCH' at $WT_PATH"
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add "$WT_PATH" "$BRANCH"
elif git show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  # Branch only exists on the remote: track it instead of branching off HEAD
  git worktree add --track -b "$BRANCH" "$WT_PATH" "origin/$BRANCH"
else
  git worktree add -b "$BRANCH" "$WT_PATH"
fi

cd "$WT_PATH"

# ---- 1. Link gitignored .env files from the main worktree ----
ENV_FILES=(.env .env.local .env.development .env.test .env.production)

link_env_files() {
  local dir="$1"
  for f in "${ENV_FILES[@]}"; do
    local SRC="$MAIN_WORKTREE/$dir/$f"
    local DEST="$dir/$f"
    if [[ -f "$SRC" && ! -e "$DEST" ]]; then
      # Git Bash's ln -s silently copies by default; nativestrict makes it
      # create a real symlink or fail (it needs Developer Mode or an elevated
      # shell). Fall back to a plain copy so the script still works either way.
      if MSYS=winsymlinks:nativestrict ln -s "$SRC" "$DEST" 2>/dev/null && [[ -L "$DEST" ]]; then
        echo "    symlinked $DEST"
      else
        cp "$SRC" "$DEST"
        echo "    copied $DEST (symlink not permitted here - enable Developer Mode on Windows to symlink instead)"
      fi
    fi
  done
}

echo "==> Linking env files from main worktree"
for dir in "${PROJECT_DIRS[@]}"; do
  [[ -d "$dir" ]] && link_env_files "$dir"
done

# ---- 2. Install Node deps in each project folder ----
install_node() {
  if [[ -f pnpm-lock.yaml ]]; then pnpm install
  elif [[ -f yarn.lock ]]; then yarn install
  else npm install
  fi
}

echo "==> Installing dependencies"
for dir in "${PROJECT_DIRS[@]}"; do
  if [[ -f "$dir/package.json" ]]; then
    echo "==> Node project detected: $dir"
    (cd "$dir" && install_node)
  fi
done

echo "==> Worktree '$BRANCH' is ready at $WT_PATH"
