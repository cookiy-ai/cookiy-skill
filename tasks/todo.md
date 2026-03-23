# Public Repo Open Library Expansion Plan (2026-03-17)

## Goal

- Expand `cookiy-skill` from a pure MCP install/workflow repo into a broader open user-research library.
- Keep the current public install and indexing surfaces stable for every platform documented in `/Users/yupeng/Documents/Obsidian Vault/对外开发者api/对外暴露平台/总结.md`.
- Align drifted public docs with the current live MCP contract.

## Protected Compatibility Surface

These paths and behaviors must remain valid because current public platforms depend on them:

- `README.md`
- `SKILL.md`
- `skills/cookiy/SKILL.md`
- `skills/cookiy/references/*.md`
- `.mcp.json`
- `.claude-plugin/plugin.json`
- `.cursor-plugin/plugin.json`
- `scripts/install-mcp.sh`
- `scripts/check-readme-commands.sh`
- Root skill name remains `cookiy`
- MCP endpoint remains `https://s-api.cookiy.ai/mcp`
- Existing install commands remain unchanged:
  - `npx skills add cookiy-ai/cookiy-skill`
  - `claude plugin add cookiy-ai/cookiy-skill`
  - `clawhub install cookiy`
  - `npx cookiy-mcp`

## Relevant Fundamentals

- Distribution surface stability matters more than repository neatness when third-party indexers cache file paths and default entrypoints.
- Additive repository changes are safer than structural replacement when multiple marketplaces consume the same repo.
- Documentation repos still need contract validation because public docs can drift faster than code.
- Open content repos need a clear copyright boundary when prompts, references, and book-derived material are added.

## Approach Comparison

- Option A: Additive library expansion outside the protected runtime surface.
  - Pros: Lowest platform risk, keeps current indexing behavior, easy to validate.
  - Cons: New research content is not immediately exposed as installable skills.
- Option B: Multi-skill expansion under `skills/`.
  - Pros: More visible skill catalog inside the repo.
  - Cons: Higher risk for default-skill resolution and marketplace/index drift.
- Option C: Split learning content into a separate repo.
  - Pros: Clean separation of concerns.
  - Cons: Loses consolidation and creates extra maintenance overhead.

Chosen approach: Option A.

## Edge Cases To Cover

- Skills CLI, Smithery, or plugin surfaces may assume the root `cookiy` skill is the default entrypoint.
- Moving or renaming `.mcp.json`, root `SKILL.md`, or plugin manifests can break installation or indexing.
- Public docs still mention `cookiy_report_generate`, but MCP no longer exposes manual report generation.
- Future contributors may accidentally add copyrighted book excerpts instead of transformed notes.
- Additive library content should not imply that new installable skills are already supported on all public platforms.

## Plan

- [x] Replace the repo top-level README so it clearly separates protected runtime surfaces from the new open library layer.
- [x] Add compatibility and content-policy docs so future edits do not break public platforms or copyright boundaries.
- [x] Add substantive prompts, methods, templates, book-note guidance, and examples under additive top-level directories.
- [x] Align the existing report-related public docs with the live MCP contract by removing manual `cookiy_report_generate` guidance.
- [x] Extend the lightweight GitHub Actions validation to protect the public surface.
- [ ] Run focused validation and record the final review.

## Review

- Kept the protected public install and indexing surface intact:
  - `README.md`
  - `SKILL.md`
  - `skills/cookiy/SKILL.md`
  - `skills/cookiy/references/*.md`
  - `.mcp.json`
  - `.claude-plugin/plugin.json`
  - `.cursor-plugin/plugin.json`
  - `scripts/install-mcp.sh`
  - `scripts/check-readme-commands.sh`
- Expanded the repo with additive open-library layers only:
  - `docs/`
  - `prompts/`
  - `references/`
  - `examples/`
- Rewrote `README.md` so the repo now clearly presents:
  - the stable public runtime surface
  - the new open library purpose
  - the new repo structure
  - the unchanged install paths
- Added compatibility and governance docs:
  - `docs/PLATFORM_COMPATIBILITY.md`
  - `docs/CONTENT_POLICY.md`
  - `docs/THIRD_PARTY_ATTRIBUTIONS.md`
  - `docs/ROADMAP.md`
- Added agent-usable content:
  - 4 prompt files
  - 4 reference files plus book-ingestion guidance
  - 2 worked examples
- Aligned the public report workflow to the current MCP contract by removing manual `cookiy_report_generate` guidance from:
  - `README.md`
  - `skills/cookiy/references/tool-contract.md`
  - `skills/cookiy/references/report-insights.md`
- Extended `.github/workflows/validate.yml` to guard the public surface and prevent manual report-generation drift from reappearing.
- Focused validation passed:
  - `git diff --check`
  - JSON parse checks for `.mcp.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`
  - `bash -n scripts/install-mcp.sh`
  - `bash -n scripts/check-readme-commands.sh`
  - `bash scripts/check-readme-commands.sh`
  - root `SKILL.md` and `skills/cookiy/SKILL.md` sync check
  - MCP endpoint contract check against `.mcp.json`

# Public Installer Package Migration Plan (2026-03-17)

- [x] Audit `packages/tools/cookiy-mcp-setup` before moving it into this public repo.
- [x] Copy the public installer package into `packages/cookiy-mcp` without bringing build artifacts, local settings, or dependencies.
- [x] Add `docs/contract-source.json` so this repo records which `cookiy-code` runtime contract commit it mirrors.
- [x] Update the root README so the public package source is discoverable.
- [x] Run focused validation and record the migration review.

## Review

- Leakage audit outcome before migration:
  - safe to move: `README.md`, `package*.json`, `bin/`, `lib/`, `scripts/`, `test/`
  - intentionally not moved: `dist/`, `node_modules/`, `.claude/settings.local.json`, `skills-lock.json`
  - no secrets were found in the moved source tree
- Moved the public installer package into `packages/cookiy-mcp/` in the public repo.
- Added `packages/cookiy-mcp/.gitignore` so local package installs/builds do not pollute the public repo with `node_modules/`, `dist/`, or `.claude/`.
- Added `docs/contract-source.json` pointing at `cookiy-code/docs/public-mcp-contract.json` and the source commit used for this migration.
- Updated `README.md` and `docs/PLATFORM_COMPATIBILITY.md` so the npm package source is now treated as part of the protected public distribution surface.
- Focused validation passed:
  - `git diff --check`
  - JSON parse checks for `.mcp.json`, plugin manifests, and `docs/contract-source.json`
  - `bash -n scripts/install-mcp.sh`
  - `bash -n scripts/check-readme-commands.sh`
  - `npm test` in `packages/cookiy-mcp`
  - `node ./bin/cli.mjs --client manus --dry-run -y` in `packages/cookiy-mcp`
  - `npm pack --dry-run` in `packages/cookiy-mcp`

# External Platform Doc Drift Fix (2026-03-17)

## Goal

- Align `/Users/yupeng/Documents/Obsidian Vault/对外开发者api/对外暴露平台/总结.md` with the current public installer and repo docs.

## Drift To Fix

- Add `Manus` to the externally documented supported client list and MCP install commands.
- Correct the Claude Code client flag from `claude-code` to `claudeCode`.
- Refresh the doc date so the external summary reflects the current 2026-03-17 installer surface.

## Plan

- [x] Update the external Obsidian platform summary note.
- [x] Verify the revised commands and supported-client list against `README.md`, `SKILL.md`, and `packages/cookiy-mcp/bin/cli.mjs`.
- [x] Record the review outcome here.

## Review

- Updated `/Users/yupeng/Documents/Obsidian Vault/对外开发者api/对外暴露平台/总结.md` to match the current 2026-03-17 installer surface.
- Fixed the documented Claude Code MCP command from `--client claude-code` to `--client claudeCode`.
- Added `Manus` in:
  - the supported client table
  - the platform entry overview
  - the MCP install command list
- Repaired the malformed `OpenClaw` support-row table structure while editing the same section.
- Removed the hardcoded Official MCP Registry version from the discovery table and replaced it with a stable “latest API 为准” note to reduce future doc drift.
- Targeted verification passed via direct content comparison against:
  - `README.md`
  - `SKILL.md`
  - `packages/cookiy-mcp/bin/cli.mjs`
  - grep check confirming the external note now contains `claudeCode` and `manus`, with no remaining `claude-code`.

# Local Skill Bootstrap Symlink Fix (2026-03-19)

## Goal

- Fix `npx cookiy-mcp ...` local skill bootstrap failures on clients that install packaged skill assets.

## Relevant Fundamentals

- npm/npx launches package binaries through `node_modules/.bin` symlinks.
- Path resolution that uses the shim path instead of the symlink target can miss package-adjacent assets.
- Cursor/VS Code MCP-only installs can succeed while Codex/Claude/OpenClaw local-skill bootstrap fails, which helps isolate the failure to packaged asset lookup.

## Approach Comparison

- Option A: Resolve the runtime path through symlinks before deriving `skill-assets/`.
  - Pros: Minimal change, matches actual package layout, fixes `npx` and similar shims.
  - Cons: Requires a filesystem lookup.
- Option B: Depend on `COOKIY_SKILL_ASSETS_DIR` being set externally.
  - Pros: No code change in lookup logic.
  - Cons: Fragile, poor user experience, not acceptable as the default path.
- Option C: Inline the skill assets into code.
  - Pros: Avoids runtime asset lookup entirely.
  - Cons: Large intrusive refactor with higher publish risk.

Chosen approach: Option A.

## Edge Cases To Cover

- `runtimePath` points at `node_modules/.bin/cookiy-mcp` symlink.
- `runtimePath` is already the real `bin/cli.mjs` path.
- `runtimePath` does not exist and must fall back gracefully.
- Explicit `COOKIY_SKILL_ASSETS_DIR` continues to take precedence.
- MCP-only clients still behave unchanged.

## Plan

- [x] Reproduce the packaged local-skill bootstrap failure and isolate it to asset lookup.
- [x] Update packaged asset resolution to follow the real runtime path when launched via a symlinked shim.
- [x] Add a regression test covering an `npx`-style `.bin` symlink entrypoint.
- [x] Run focused validation and record the review.

## Review

- Root cause confirmed: `npx` launches `cookiy-mcp` via `node_modules/.bin/cookiy-mcp`, and the asset resolver used the shim path instead of the real package `bin/cli.mjs` path.
- This only broke clients that require packaged local skill assets:
  - `codex`
  - `claudeCode`
  - `openclaw`
- MCP-only clients such as Cursor and VS Code continued to work because they never read `skill-assets/`.
- Fixed `packages/cookiy-mcp/lib/skills/local-skill.mjs` to dereference the runtime path with `realpathSync(...)` before deriving candidate `skill-assets/` directories.
- Added an `npx`-style `.bin` symlink regression test in `packages/cookiy-mcp/test/skills/local-skill.test.mjs`.
- Focused validation passed:
  - `npm test` in `packages/cookiy-mcp`
  - `npx -y -p file:/Users/yupeng/Downloads/cookiy/cookiy-skill/packages/cookiy-mcp cookiy-mcp dev2 --dry-run --client codex -y`

# Runtime Contract Sync (2026-03-19)

## Goal

- Sync the public `cookiy-skill` surfaces to the current MCP runtime contract from `/Users/yupeng/Downloads/cookiy/cookiy-api-skill-mcp-on-latest-develop`.

## Relevant Fundamentals

- Public MCP docs can drift even when runtime files have no fresh branch diff; the correct comparison is current runtime contract vs current public distribution surface.
- Install/index entry stability matters more than documentation neatness for public platforms that cache repo paths and default skill names.
- Runtime tool descriptions and the developer portal together define the authoritative public MCP contract.

## Approach Comparison

- Option A: Update only the public files whose content has drifted from runtime.
  - Pros: Minimal impact, preserves install/index stability.
  - Cons: Requires careful spot-checking across multiple public surfaces.
- Option B: Regenerate or rewrite the whole public docs surface.
  - Pros: Could reduce missed drift.
  - Cons: High regression risk for public wording and protected paths.
- Option C: Ignore drift when branch diff is empty.
  - Pros: No work.
  - Cons: Leaves stale public guidance and breaks agent behavior.

Chosen approach: Option A.

## Edge Cases To Cover

- `cookiy_recruit_status` no longer supports a `sync` parameter in the public contract.
- Recruitment truth and payment retry guidance must reflect automatic status reconciliation.
- Balance guidance must prefer the runtime-composed display strings instead of recomputing values.
- Root `SKILL.md` and `skills/cookiy/SKILL.md` must stay byte-identical.
- Protected install commands and the `cookiy` skill name must not change.

## Plan

- [x] Inspect the runtime MCP source-of-truth files and the external maintenance note.
- [x] Compare the current runtime contract against the public `cookiy-skill` docs.
- [x] Update only the public docs that have real contract drift.
- [x] Run the requested validation commands and record the review.

## Review

- Runtime branch diff for the two MCP source-of-truth files against `origin/develop` was empty, so the real work was current-runtime-vs-current-public-surface drift inspection rather than branch-only syncing.
- Confirmed public contract drift in recruitment guidance:
  - public docs still referenced `cookiy_recruit_status(sync=true)`
  - runtime no longer exposes a `sync` parameter and now performs billing-aware recruit checkout reconciliation inside `cookiy_recruit_status`
- Updated the public skill surfaces to match runtime on:
  - recruitment truth-source ordering
  - post-payment recruit retry sequence
  - recruit status semantics (`payment_state`, `configured_scope`, completed-only `current_participants`)
  - force-reconfigure guidance for target increases after launch
  - balance display guidance to prefer runtime-composed statement lines
  - expanded transient error-code guidance (`429`, `500`, `502`)
- Kept the protected compatibility surface stable:
  - skill name remains `cookiy`
  - root `SKILL.md` and `skills/cookiy/SKILL.md` remain synchronized
  - install commands were not changed
  - `.mcp.json` was intentionally left unchanged because endpoint/name did not change
- Mirrored the changed skill content into `packages/cookiy-mcp/skill-assets/**` so installs from `npx cookiy-mcp` do not ship stale local-skill docs.
- External maintenance implication from `/Users/yupeng/Documents/Obsidian Vault/MCP/对外暴露平台/总结.md`:
  - GitHub repo push is enough for GitHub / skills.sh style fresh installs
  - because `packages/cookiy-mcp/skill-assets/**` changed, npm/Homebrew and other package-based distribution surfaces need an active release if you want those channels updated too
- Requested validation passed:
  - `git diff --check`
  - `python3 -m json.tool .mcp.json >/dev/null`
  - `python3 -m json.tool .claude-plugin/plugin.json >/dev/null`
  - `python3 -m json.tool .cursor-plugin/plugin.json >/dev/null`
  - `bash -n scripts/install-mcp.sh`
  - `bash -n scripts/check-readme-commands.sh`
  - `bash scripts/check-readme-commands.sh`
  - `cmp -s SKILL.md skills/cookiy/SKILL.md && echo SKILL_SYNC_OK`
  - `npm test && npm pack --dry-run` in `packages/cookiy-mcp`

# Manus Headless OAuth First-Run UX Fix (2026-03-23)

## Goal

- Reduce first-run confusion for non-MCP users installing Cookiy in Manus-like headless sandboxes.
- Make the installer present one clear next action instead of leaving the agent or user to infer what `Listening for OAuth callback` means.

## Relevant Fundamentals

- OAuth authorization-code + PKCE in a sandbox is constrained by redirect reachability: a browser on the user's machine may not be able to complete a callback into a localhost listener running inside the remote sandbox.
- The live Cookiy OAuth discovery document currently supports only `authorization_code` and `refresh_token`; there is no device-code flow available for a safer protocol switch in this repo-only fix.
- In agent-driven installs, ambiguous terminal output causes the agent to improvise long explanations. Tightening the installer copy is lower risk than changing the auth protocol.

## Approach Comparison

- Option A: Improve headless OAuth messaging and browser-open detection while keeping the current authorization-code flow.
  - Pros: Minimal-risk, repo-local, directly improves the first-run experience.
  - Cons: Manual paste fallback still exists when sandbox localhost cannot be reached.
- Option B: Add a device-code style flow in the CLI.
  - Pros: Best UX for true headless environments.
  - Cons: Not supported by current server metadata, so unsafe without backend work.
- Option C: Leave the code alone and only update docs.
  - Pros: Lowest implementation risk.
  - Cons: Does not actually fix the confusing runtime behavior.

Chosen approach: Option A.

## Edge Cases

- Browser auto-open succeeds and the callback reaches the sandbox listener automatically.
- Browser auto-open fails because no platform opener is available.
- Browser opens, but redirect to sandbox `127.0.0.1` is unreachable; user must paste the callback URL or code.
- The installer resumes from `pending-oauth.json` after timeout or sandbox restart.
- An AI agent quotes the installer output back to a user; the output should still read clearly and require only one primary action.

## Pseudocode

```text
1. Build or resume the pending OAuth session as today.
2. Attempt to open the authorization URL and detect whether the opener likely succeeded.
3. Print one explicit action block:
   - whether the browser was opened for the user
   - the exact authorization URL
   - that approval may auto-complete setup
   - that the fallback is to paste the callback URL or code
4. Wait for either the localhost callback or pasted input.
5. Exchange tokens and write the helper bundle unchanged.
```

## Plan

- [x] Refactor headless OAuth prompt generation so Manus shows one explicit next-step block and clearer fallback wording.
- [x] Detect likely browser-open failure and tell the user to open the printed link manually when needed.
- [x] Add unit tests for the generated guidance text and opener result handling.
- [x] Update public installer docs to match the improved first-run flow.
- [x] Run focused validation and record the review.

## Review

- Root cause stayed the same: Manus uses authorization-code + PKCE against a localhost callback, and that callback may be unreachable from a user browser outside the sandbox.
- Confirmed the server still exposes only:
  - `authorization_code`
  - `refresh_token`
  so a device-code migration was out of scope for this repo-only change.
- Updated the headless OAuth installer flow in `packages/cookiy-mcp/lib/clients/headless-oauth.mjs` to:
  - detect the platform-specific browser open command
  - attempt browser launch and capture likely failure
  - print one explicit "Action required" block instead of ambiguous waiting-only text
  - keep the existing localhost callback and pasted-code fallback behavior unchanged
- Added regression coverage in `packages/cookiy-mcp/test/clients/headless-oauth.test.mjs` for:
  - successful browser-launch guidance
  - manual-open fallback guidance
  - platform-specific browser opener selection
- Updated the public docs surfaces so the first-run Manus instructions match the runtime behavior:
  - `README.md`
  - `packages/cookiy-mcp/README.md`
  - `packages/cookiy-mcp/skill-assets/README.md`
  - `SKILL.md`
  - `skills/cookiy/SKILL.md`
  - packaged skill mirrors under `packages/cookiy-mcp/skill-assets/**`
- Focused validation passed:
  - `npm test` in `packages/cookiy-mcp`
  - `git diff --check`
  - `cmp -s SKILL.md skills/cookiy/SKILL.md && echo SKILL_SYNC_OK`
  - manual runtime spot-check via `node ./bin/cli.mjs --client manus -y` confirming the new action block appears before the wait state

# Cookiy Setup-First Entry Flow Fix (2026-03-23)

## Goal

- Make `/cookiy` setup flows install and verify MCP before any research-goal conversation starts.
- Prevent agents from asking research questions during installation-only requests.
- Replace long raw verification dumps with one concise installation success message.

## Relevant Fundamentals

- The Cookiy skill entrypoint is prompt-driven, so setup UX depends on the skill instructions as much as on CLI behavior.
- For headless OAuth clients, a successful token exchange is necessary but a post-auth MCP tool call is the cleanest proof that setup really works end-to-end.
- Verification tools can return large structured JSON; health checks should summarize success, not expose raw payloads, unless the user explicitly asks for details.

## Approach Comparison

- Option A: Update skill setup rules and add installer-side MCP verification with concise success output.
  - Pros: Fixes both orchestration and runtime UX with minimal surface change.
  - Cons: Adds one extra MCP call after token exchange.
- Option B: Update skill rules only.
  - Pros: Smallest code change.
  - Cons: Raw verification output can still leak when agents shell out manually.
- Option C: Update installer only.
  - Pros: Better CLI UX.
  - Cons: Does not stop `/cookiy` from asking research questions too early.

Chosen approach: Option A.

## Edge Cases

- User asks only to install or connect Cookiy; no business discovery questions should appear.
- User enters `/cookiy` with no other context; setup should still happen first if MCP is unavailable.
- Headless OAuth install succeeds but verification tool call fails; the user should get a clear verification failure instead of a false success.
- User explicitly asks what Cookiy can do; capability overview is still allowed after setup is healthy.
- Public root skill, mirrored skill, and packaged skill assets must stay aligned.

## Plan

- [x] Update skill entry instructions so setup/install/verification happen before any research conversation.
- [x] Add a concise installer-side MCP verification step after headless OAuth token exchange.
- [x] Ensure success output is one short confirmation sentence instead of raw tool JSON.
- [x] Sync mirrored skill/doc surfaces and run focused validation.

## Review

- Updated the public Cookiy skill instructions so `/cookiy` now behaves as setup-first guidance:
  - install/connect/repair requests no longer ask research questions before MCP is healthy
  - health-check calls to `cookiy_introduce` must be summarized in one sentence instead of exposing raw JSON
  - installation-only intents stop after a concise success confirmation instead of pivoting into research intake
- Mirrored that setup-first policy across:
  - `SKILL.md`
  - `skills/cookiy/SKILL.md`
  - `packages/cookiy-mcp/skill-assets/SKILL.md`
  - `packages/cookiy-mcp/skill-assets/skills/cookiy/SKILL.md`
- Added installer-side end-to-end verification in `packages/cookiy-mcp/lib/clients/headless-oauth.mjs`:
  - after token exchange, the installer performs MCP `initialize`
  - sends `notifications/initialized`
  - calls `cookiy_introduce`
  - prints `Cookiy MCP installed and verified successfully.` on success
- Hardened the verifier to accept the live server behavior where `notifications/initialized` can return an empty body.
- Updated CLI/README wording so successful headless setup now describes the state as installed, connected, and verified instead of asking users to infer readiness from helper files alone.
- Focused validation passed:
  - `npm test` in `packages/cookiy-mcp`
  - `git diff --check`
  - `cmp -s SKILL.md skills/cookiy/SKILL.md && echo SKILL_SYNC_OK`
  - live verifier check using existing `~/.mcp/cookiy/credentials.json` returned `LIVE_VERIFY_OK`
- Release follow-through completed per maintenance handbook:
  - bumped `cookiy-mcp` from `1.7.12` to `1.7.13`
  - synced `packages/cookiy-mcp/lib/config.mjs` `VERSION`
  - `node ./bin/cli.mjs --dry-run -y`
  - `npm pack --dry-run`
  - `npm publish --access public` published `cookiy-mcp@1.7.13`
  - `clawhub publish ... --version 1.0.5` published `cookiy@1.0.5`
  - `clawhub inspect cookiy` immediately after publish reported the new skill is temporarily hidden while the platform security scan is pending
  - `smithery skill view cookiy-ai/cookiy` still showed the older skill text, so Smithery remains a manual follow-up rather than a completed publish step
