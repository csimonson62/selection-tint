# selection-tint: working rules for Claude Code

## Every change that ships to users

Remind Christine of these steps whenever a change to the mod is committed, and do them on her OK:

1. Run `claude plugin validate .`. It must pass. One warning is known and expected: this CLAUDE.md is not loaded as plugin context (it is for working on the repo, not for users).
2. Bump `"version"` in `.claude-plugin/plugin.json` (semver: fix = patch, new option or feature = minor).
3. Commit the bump, then push to `main`. Force-pushes and deleting `main` are blocked by the `protect-main` ruleset.
4. Publish a release with a matching tag: `gh release create vX.Y.Z --target main --title vX.Y.Z --notes "..."`.
   The tag must equal the `plugin.json` version.
5. Update the README if the change alters what the mod does, its options or `/tint`.

Docs-only changes (README, SECURITY.md, this file) need no version bump or release.

## Repo settings already in place

- `SECURITY.md` points to private vulnerability reporting (enabled); Christine watches Security alerts.
- Secret scanning is on. Dependabot and code scanning are off on purpose: no dependencies, small codebase.
