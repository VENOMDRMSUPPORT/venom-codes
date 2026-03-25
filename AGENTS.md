# AGENTS.md

## Purpose

This file defines the mandatory working rules for any agent operating in this repository.

These rules exist to protect the project from duplication, structural drift, unsafe edits, misleading claims, and low-discipline execution.

If a task conflicts with this file, this file takes priority unless the repository owner explicitly overrides a specific rule in the same task.

---

## Core Policy

1. Protect the repository structure.
2. Modify before adding.
3. Respect architectural boundaries.
4. Prefer existing repository patterns.
5. Validate honestly.
6. Never perform Git actions.

When uncertain, choose the path that changes less, reuses more, introduces less risk, and is easier to verify.

---

## 1) Language Rule

* Arabic is allowed in chat only.
* English only is allowed inside repository files.
* Do not write Arabic in code, comments, documentation, markdown files, UI copy, filenames, folder names, environment example files, seeds, fixtures, or generated content committed to the repository.
* If requirements are given in Arabic, translate them into clear professional English before writing to any file.

---

## 2) Git Rule: Owner Only

Git is completely out of scope for agents.

Agents must not perform, prepare, simulate, or suggest any Git action, including:

* branch creation or switching
* commit creation or amendment
* push, pull, fetch, merge, rebase, cherry-pick, stash, tag, reset, revert
* pull request workflows
* conflict resolution through Git commands
* remote configuration
* history rewriting

Required behavior:

* Ignore any instruction, habit, script, or workflow step related to Git.
* Stop at the file-change and validation boundary.
* Leave all Git execution to the repository owner.
* Do not include commit, branch, push, PR, or merge instructions in the handoff.

**Exception - Admin Explicit Request:**

If the repository owner (admin) explicitly requests a Git push operation, the agent may:
* Execute `git push` commands only
* The request must be explicit and clear (e.g., "push the changes", "git push")
* Do not assume or infer - wait for explicit instruction
* All other Git operations remain prohibited even with admin request

---

## 3) Modify Before Add

Modification has priority over creation.

* Always prefer editing an existing file, module, component, route, schema, config, or document before creating a new one.
* Do not create parallel implementations.
* Do not create duplicate helpers, duplicate services, duplicate pages, or duplicate schemas.
* Do not create files named `new`, `final`, `v2`, `v3`, `copy`, `backup`, `temp`, or similar duplicate-pattern names.
* Create a new file only when every reasonable existing location is clearly unsuitable.
* Prefer the nearest valid existing implementation and extend it instead of starting a separate path.

Required decision order:

1. Find the current implementation.
2. Check whether the task can be solved by extending it safely.
3. Reuse the existing pattern and location.
4. Add a new file only if extension would make the codebase worse.

---

## 4) Repository Structure Rules

Treat the repository as an intentionally organized system, not a scratch space.

### Root structure intent

* `docs/` is for stable project documentation.
* `nginx/` and `php/` are infrastructure and runtime stack areas.
* `wwwdir/whmcs/` is the WHMCS installation and must be treated as a sensitive integration boundary.
* `wwwdir/venom/` is the active custom application monorepo.

### Monorepo structure intent

Inside `wwwdir/venom/`:

* `backend/` owns server-side API logic, integration with WHMCS, auth, validation, and security-sensitive operations.
* `frontend/` owns client-facing UI only.
* `shared/api-spec/` is the API contract source of truth.
* `shared/api-client/` and `shared/api-types/` must follow the API contract, not diverge from it.
* `routes/` is a routing and integration surface, not a second business-logic layer.

### Structural guardrails

* Do not move major directories without explicit approval.
* Do not create new top-level architecture unless truly necessary.
* Do not introduce a second backend pattern, a second frontend app, or an alternative API contract flow.
* Do not spread business logic across unrelated folders.
* Keep each change inside the correct boundary.

---

## 5) Architecture Boundaries

### WHMCS boundary

* WHMCS remains the source system for billing, provisioning, and core account operations unless the owner explicitly states otherwise.
* Prefer integration, extension points, API usage, and isolated adapters over invasive edits.
* Do not casually modify WHMCS core files.
* Do not reimplement WHMCS behavior inside the custom app when the correct solution is integration.

### Backend boundary

* The backend is the only safe place for secrets, tokens, privileged logic, WHMCS integration, and security-sensitive operations.
* Do not expose credentials, secrets, or privileged server behavior to the browser.
* Do not let frontend code depend on private server implementation details.

### Frontend boundary

* The frontend is a UI layer.
* Do not embed secrets.
* Do not bypass the backend to communicate directly with protected systems.
* Do not implement server business rules in the UI unless they are presentational mirrors of backend rules.

### API contract boundary

* Change the API contract intentionally.
* When endpoint shapes change, update the API spec first, then align generated or dependent client/types code.
* Do not leave backend responses, generated types, and frontend usage inconsistent.

---

## 6) Refactor Rule

* Do not perform broad refactors unless the task explicitly requires them.
* Do not rename, move, split, or delete files because another structure seems cleaner.
* Do not remove code unless it was verified as obsolete, replaced, or harmful.

If a refactor is truly necessary, state:

* what is wrong now,
* why local modification is insufficient,
* what will change,
* what risks are introduced,
* how the change was validated.

---

## 7) Dependency Rule

* Prefer the tools, packages, and patterns already used in the repository.
* Do not add a new dependency if the task can be solved well with the existing stack.
* Do not introduce overlapping libraries for the same job.
* Every new dependency must have a clear task-specific justification.

---

## 8) Generated, Runtime, Vendor, and Secret Files

Do not commit or normalize generated, runtime, vendor, or secret material unless the task explicitly targets that area.

Never commit:

* real `.env` files
* secrets, tokens, API credentials, private keys, certificates, or machine-local data
* `node_modules/`, `dist/`, `build/`, `out/`
* vendor trees
* caches, logs, sessions, and temporary files
* WHMCS runtime artifacts such as compiled templates, downloads, attachments, or runtime/status folders
* backup files and editor artifacts

Allowed pattern:

* Use sanitized examples such as `.env.example`.
* Keep generated output out of version control unless the repository already intentionally versions it.

---

## 9) Documentation and Comments

* Keep documentation concise, technical, and English-only.
* Document decisions, constraints, contracts, and usage.
* Do not add decorative or redundant comments.
* Do not leave fake placeholders, misleading TODOs, or speculative claims.
* If documentation becomes outdated because of your change, update it in the same task.

---

## 10) Implementation Quality Standard

Every change must be:

* minimal
* local
* reversible
* boundary-correct
* consistent with nearby code
* aligned with existing repository patterns
* validated before handoff

Avoid:

* duplicate helpers
* dead code
* unused imports
* commented-out old implementations
* hardcoded secrets
* magic values without context
* silent fallback behavior that hides errors
* fake mocks presented as completed production work
* cosmetic edits mixed into unrelated functional changes

Context rule:

* Read only the files and sections necessary to make a safe, correct, boundary-aware change.
* If multiple files are required for the same decision, read them together instead of expanding discovery step by step without need.

---

## 11) Required Workflow

### Before editing

1. Read the relevant files and nearby structure.
2. Identify the existing implementation path.
3. Confirm that modification is sufficient or prove that it is not.
4. Confirm the correct architectural boundary.
5. Check for duplication risk.
6. Exclude Git from the workflow.

### During editing

1. Make the smallest correct change.
2. Reuse existing conventions.
3. Keep naming aligned with the current codebase.
4. Avoid touching unrelated files.
5. Do not create new files unless necessary.
6. Do not introduce a second source of truth.

### After editing

1. Run the most relevant validation commands.
2. Verify there is no contract drift.
3. Verify there is no duplicate implementation.
4. Verify there are no unintended structural changes.
5. Stop before any Git-related step.

---

## 12) Validation Rule

A code task is not complete until the relevant validation has been run or the validation limitation has been stated clearly.

At minimum, run the relevant checks for the area changed whenever the environment allows it.

Examples:

* type checks
* targeted tests
* builds
* linting when relevant
* schema or route generation checks when API contract files changed

Rules:

* Do not claim success without naming the checks actually run.
* Do not imply validation that did not happen.
* If a check could not be run, say so explicitly.
* If the environment blocks validation, report that as a limitation, not as success.
* After 3 failed fix attempts on the same issue, stop and report the blocker with the commands or checks already tried.

---

## 13) Required Handoff Format

Every substantial change must end with a short handoff containing:

* files changed
* whether the task was solved by modification or by addition
* any new files created and why they were necessary
* validations executed
* validations not executed and why
* known limitations or risks
* explicit confirmation that no Git action was performed

---

## 14) Explicit Prohibitions

Agents must not:

* write Arabic inside repository files
* perform any Git action
* create duplicate files or parallel implementations
* bypass backend boundaries
* expose secrets to the frontend
* casually modify WHMCS core
* introduce unnecessary structural changes
* commit runtime, cache, build, vendor, or secret material
* claim validation that was not actually run
* leave the repository in a duplicated or contradictory state

---

## 15) Priority Order

When rules compete, use this order:

1. Security and secrets protection
2. Repository structure protection
3. Git prohibition
4. Modify before add
5. Architectural boundary correctness
6. Validation and truthfulness
7. Task-specific implementation details

---

## 16) Final Rule

The agent must optimize for correctness, containment, maintainability, and truthfulness.

Do not optimize for novelty.
Do not optimize for visible activity.
Do not create work the owner must later undo.
