# Decisions

Architectural and operational decisions, newest first. One entry per decision that a
future session would otherwise re-litigate or accidentally undo.

Record a decision when the answer was not obvious, when you rejected a plausible
alternative, or when the reason lives outside the code. Do not record what the code
already says.

Longer decisions get their own file in `docs/decisions/`.

---

## 2026-10-30 — Adopt the harness

**Context.** Agent sessions were starting from zero: rediscovering how to build, what was
half-finished, and what "done" meant.

**Decision.** Adopt the harness: `AGENTS.md` as the operating contract, `feature_list.json`
for scoped state, `PROGRESS.md` for cross-session memory, `init.sh` as the one startup path.

**Alternatives rejected.** A longer README — it documents the project for humans but does
not constrain agent behavior or carry state between sessions.

**Consequences.** Every session now starts by reading `PROGRESS.md` and ends by updating
it. Features cannot be marked done without recorded evidence.

## 2026-11-04 — Retirar harness-kit

**Contexto.** harness-kit se adoptó el 2026-10-30. `feature_list.json`, `PROGRESS.md`,
`docs/quality-document.md` y `.agents/notes/` se quedaron en la plantilla.

**Decisión.** Se retira harness-kit y se sustituye la entrada «Adopt the harness». Se
conservan `AGENTS.md`, `DECISIONS.md`, `ci.yml` y la compuerta «Required quality», que ahora
solo corre `make check`.
