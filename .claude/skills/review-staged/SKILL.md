---
name: review-staged
description: Review code in git staged changes only, completely ignoring unstaged/working-tree edits. Use when the user asks to review staged changes, review what's about to be committed, review the index, or do a pre-commit review.
allowed-tools:
  - Read
  - Grep
  - Glob
  - ReportFindings
  - Agent
  - Bash(git status*)
  - Bash(git diff --cached*)
  - Bash(git diff --staged*)
  - Bash(git show*)
  - Bash(git ls-files*)
  - Bash(git rev-parse*)
  - Bash(git log*)
---

# Review Staged Changes

Review only what is in the git **index** (staged for commit). Never review, mention, or let unstaged working-tree edits influence the findings — even for a file that is partially staged (`git add -p`).

Do not edit files when using this skill.

## 0. Decide who reviews — you, or a fresh subagent

A reviewer that wrote the code, or has spent the conversation discussing it with the user, tends to go easy on it: it already believes the reasoning behind the change and wants to agree with the user. So the review must come from a context that has none of that history.

- **Fresh session** — this skill invocation is the first thing in the conversation (no earlier edits, discussion, or other work). Do sections 1–6 yourself.
- **Any other session** — there is earlier conversation of any kind. Do not review the code yourself. Spawn one subagent with the `Agent` tool and let it do the review.

If you're unsure which case applies, treat it as the second.

### Subagent configuration — read-only

- `subagent_type: "Plan"`. This built-in type has no `Edit`, `Write`, `NotebookEdit` or `Agent` tool, so the reviewer cannot change files or spawn further agents. It is used here for its tool set, not for planning.
- Never `"general-purpose"` or `"claude"` — those carry every tool, including the editing ones.
- Never `"fork"` — a fork inherits this conversation and the bias with it.
- Do not set `isolation`; the reviewer must see this repository's index, and a worktree has its own.

### Briefing the subagent

The subagent starts with no context, so the prompt must stand alone. Give it:

- The repository's absolute path.
- Its role: a code reviewer whose output is review findings, not an implementation plan.
- The instruction to read `.claude/skills/review-staged/SKILL.md` and carry out sections 1–4 as the reviewer, skipping sections 0, 5 and 6.
- The tools it may use, and nothing else: `Read`, `Grep`, `Glob`, and through the shell only these git commands, one per call with no chaining, piping or redirection — `git status`, `git diff --cached` / `--staged`, `git show`, `git ls-files`, `git rev-parse`, `git log`. No command that writes, stages, commits, checks out, stashes, installs, or runs project code.
- What to return: either "no staged changes", or a list of findings ordered most severe first, each with `file`, `line`, `summary`, `failure_scenario`, a `category`, and a `verdict` of `CONFIRMED` or `PLAUSIBLE`.

Leave out everything you know about the change: what it is for, why it was written this way, what the user thinks of it, and which parts you expect to be fine. The subagent should judge the diff as a stranger would.

### Relaying its result

When the subagent returns, do sections 5 and 6 with its findings exactly as reported. Don't drop, soften, or downgrade a finding because you know the intent behind the code. If you believe a finding is wrong, still report it, and say so in one line after the verdict so the user can decide.

If the subagent reports no staged changes, tell the user that and stop.

## 1. Confirm there's something to review

Run `git diff --cached --stat`. If it's empty, tell the user there are no staged changes and stop — do not fall back to reviewing unstaged changes.

## 2. Get the staged diff — index vs HEAD only

Use `git diff --cached` (equivalently `--staged`) as the source of truth for *what changed*. This already naturally excludes any unstaged hunks, including unstaged hunks in an otherwise-staged file.

## 3. For full-file context, read the staged blob — not the working tree

If you need to see a changed file in full (beyond the diff hunk) to judge correctness, do **not** use the `Read` tool on the file as it sits on disk — the working tree may contain additional unstaged edits that would leak into your review and contaminate the scope.

Instead get the staged (index) version of the file:

```
git show :path/to/file
```

Use `Read`/`Grep`/`Glob` freely for files that are *not* part of the staged diff (e.g. a neighboring module, a type definition, a config file) when you need that context to judge the changed code — those are read-only lookups, not the thing being reviewed.

## 4. Review

For each staged file/hunk, look for:
- Correctness bugs and logic errors
- Security issues (injection, auth/authz gaps, secret leakage, unsafe deserialization, etc.)
- Edge cases and error handling gaps
- Obvious reuse/simplification/efficiency problems introduced by the change

Don't flag pre-existing issues outside the staged hunks — stay scoped to what's actually staged.

## 5. Report

Call `ReportFindings` with the verified findings, most severe first (empty array if the staged changes look clean). Don't also print the findings as plain text when you use it.

## 6. Conclusion — ready to push?

After `ReportFindings`, add one short line stating a verdict:

- **Ready to push** — no findings, or only minor/stylistic ones with no `CONFIRMED` correctness or security issue.
- **Not ready to push** — at least one `CONFIRMED` correctness bug, security issue, or anything that would break behavior or leak data. Name the blocking finding(s) in one clause.

This verdict is about the staged changes only — don't factor in unstaged work, failing tests you didn't run, or anything outside the diff you reviewed.
