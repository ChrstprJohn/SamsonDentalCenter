# PrimeraDental Copilot Instructions

## Global Instructions & AI Directives

- **Plan Before Execution (Architecture & Best Practices):** Never write or output code immediately.
  Always propose a high-level architectural plan first. Rely strictly on the latest industry best
  practices. If there are multiple valid "best practice" approaches for a system or architectural
  design, you must present at least two structured options. Highlight the trade-offs (pros/cons) of
  each and wait for explicit selection before writing any code.
- **Zero Assumptions:** If a request is ambiguous, lacks scope, or you do not have sufficient
  context from the open files, stop. Do not hallucinate or guess. Ask specific, clarifying questions
  to get the required information.
- **Strict Dependency Management:** Do not introduce new npm packages, libraries, or technologies
  unless absolutely necessary and highly useful. If a new dependency is the best solution, you must
  ask for permission first. Suggest the package, explain exactly why it is the best choice over a
  native implementation, and wait for approval.
- **Match Existing Patterns:** Analyze the surrounding codebase. Strictly adapt to and replicate the
  existing coding style, naming conventions, and structural patterns.
- **Long-Term Maintainability:** Prioritize the long run. Code must be clean, modular, and scalable.
  Provide only the complete code for the approved solution. Do not use placeholders, and do not omit
  sections for brevity.

## Database, Security & Backend Guidelines

- **The Single Source of Truth & Migrations:** `FINAL-COMPLETE-SCHEMA.sql` is the absolute authority
  for the database. Do not hallucinate database logic, tables, or relationships. If a feature
  requires schema updates, you must output a standalone SQL migration script. The user will execute
  this script themselves and manually update `FINAL-COMPLETE-SCHEMA.sql`. Remind the user to do so,
  but do not attempt to modify the schema file directly.
- **Atomic & Secure:** All database mutations must be handled using atomic transactions to prevent
  partial updates or orphaned data.
- **Performance & Safety:** Keep security (e.g., input validation, SQL injection prevention,
  role-based access) and speed (e.g., proper indexing, avoiding N+1 query problems) top of mind for
  every backend operation.

## UI / UX Directives

- **Data-Driven UI:** I do not care about heavy UI scaffolding. Your primary directive for UI
  generation is to ensure that the interface perfectly matches and can be fully supported by the
  current database schema. Do not design frontend inputs for data we do not track in the backend.
- **Uncodixfy UI Skills:** STRICTLY adhere to the UI rules defined in `Uncodixfy/Uncodixfy.md`.
  Avoid default AI aesthetic patterns (e.g., oversized rounded corners, floating panels, soft
  gradients). Stick to standard, functional components that feel human-designed and honest (e.g.,
  Linear, GitHub). Do not invent new layouts; replicate clean components without unnecessary
  decoration.

## Documentation & Markdown Standards

- **Core Focus:** When writing `.md` files or documentation, strictly focus on the core ideas,
  flows, and essential logic. Do not add fluff.
- **Improvement Proposals:** If you see areas for architectural or logical improvement while
  documenting, list them in a distinct "Proposed Improvements" section at the bottom of the file.
  Suggest, but keep the primary document focused on the current core implementation.

## Architecture Overview

- **Monorepo setup**: Built using Turborepo (`pnpm turbo`).
- **Services**:
    - `apps/api`: Backend service (runs on `http://localhost:5000`)
    - `apps/user`: Patient facing app (`http://localhost:5173`)
    - `apps/admin`: Administrator portal (`http://localhost:5174`)
    - `apps/secretary`: Reception/Booking management (`http://localhost:5175`)
    - `apps/doctor`: Clinician interface (`http://localhost:5176`)

## Development Workflows

- **Package Manager**: Always use `pnpm` (version `10.29.3` specified).
- **Start the environments**: Use `pnpm run dev` from the root, which runs `turbo dev` and spits out
  local links.
- **Build**: Use `pnpm run build` from root.

## Conventions

- Changes spanning frontend and backend should be properly grouped by feature in `apps/`.
- Ensure appropriate usage of turbo when resolving build tasks.
