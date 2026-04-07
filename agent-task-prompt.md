# Task: Add structural regression tests for {{COMPONENT}}

## Your goal

Add structural regression tests for the **{{COMPONENT}}** widget, comparing native GTK4/Adwaita rendering against the web React rendering. The upstream GTK4 and libadwaita source code in the `upstream/` git submodules is the **source of truth** — our React components and CSS must match their behavior. If tests reveal mismatches, **fix our codebase** (React components, CSS, layout classes, transform pipeline, etc.) to match upstream, not the other way around.

If the component doesn't have a web implementation yet, implement it by studying the upstream source first.

## Before you write any code

Read these files in order — they contain the project conventions, architecture, and testing patterns you MUST follow:

1. **`AGENTS.md`** — project-wide instructions, architecture, cross-referencing rules, tooling
2. **`.agents/skills/gtk-js-testing/SKILL.md`** — how to add tests, naming conventions, key files to read
3. **`CLAUDE.md`** — same as AGENTS.md (for Claude Code users), confirms conventions
4. **`TEST-COMPONENTS.md`** — tracks which components have tests and which test variants exist
5. **`.github/workflows/test.yml`** — CI setup so you understand the environment tests run in

Then read the existing test infrastructure files listed in the skill doc to understand the patterns:

- `tests/harness.ts` — `WidgetSnapshot` type, `compare()` tolerances, `gtkTest` / `gtkTestExpectFailure` signatures
- `tests/assert.ts` — `gtkAssert` helpers for custom test callbacks
- `tests/client.tsx` — case map and component imports
- `tests/native/src/main.rs` — Command enum and match arms
- `tests/native/src/cases/mod.rs` — module list
- `tests/native/src/cases/*.rs` — existing case patterns (read at least 2-3)
- `tests/cases/*.test.ts` — existing test patterns (read both simple and custom-assertion examples)

## What to do

### 1. Study the upstream source of truth

The `upstream/` directory contains git submodules with the actual GTK4 and libadwaita source code. These are the authoritative reference for how every widget should look and behave:

- **`upstream/gtk/`** — GTK4 C source. Find the widget's C file to check: CSS node name (`gtk_widget_class_set_css_name`), layout manager (`set_layout_manager_type`), dynamic CSS classes, default property values, internal child structure.
- **`upstream/libadwaita/`** — libadwaita C source + SCSS stylesheets. Check `upstream/libadwaita/src/stylesheet/widgets/` for exact CSS values, state changes, placeholder selectors.
- **`upstream/adwaita-icon-theme/`** — Adwaita icons.

Read the relevant upstream files for {{COMPONENT}} before writing anything.

### 2. Check if the web component exists and is correct

Look in `packages/` for an existing React implementation of {{COMPONENT}}.

- **If it doesn't exist:** implement it by following existing component patterns in the codebase, guided by what you found in the upstream source.
- **If it exists but doesn't match upstream:** fix it. Our React components must match the upstream CSS node tree, layout managers, CSS classes, and default property values. Fix any discrepancies you find — wrong CSS classes, missing nodes, incorrect defaults, bad layout, etc.
- Make sure the component is exported from the appropriate package (`@gtk-js/gtk4` or `@gtk-js/adwaita`).

### 2. Add test cases

For each meaningful variant of {{COMPONENT}} (default state, common props, disabled state, etc.):

**Three places need changes per case** (as described in the skill doc):

1. **Native side** — `tests/native/src/cases/{{case_name}}.rs` + register in `mod.rs` + add Command variant and match arm in `main.rs`
2. **Web side** — add case entry in `tests/client.tsx`
3. **Test file** — `tests/cases/{{case-name}}.test.ts`

### 3. Decide which variants to test

Look at what the existing tested components cover for guidance (GtkButton has: text-default, text-flat, text-suggested, text-destructive, icon, circular, pill, disabled). Choose variants that make sense for {{COMPONENT}} based on:

- The upstream C source (what CSS classes / states does it support?)
- The upstream SCSS (what visual variants are styled?)
- What existing similar components test

### 4. Run and fix

```sh
bun test {{filter}}
```

Where `{{filter}}` is a substring matching your test cases. Tests run against both Chromium and Firefox.

If tests fail, the native snapshot is the source of truth — **fix our web implementation to match it**. Investigate the diff between native and web snapshots (dumped to stderr on failure). Common issues and how to fix them:

- **Wrong CSS values** — fix the React component's CSS classes, or fix the CSS transform pipeline (`packages/gtk-css/`) if selectors aren't being mapped correctly
- **Wrong layout** — check the upstream C source for the correct layout manager, apply the right layout CSS class
- **Missing CSS node** — our component's DOM tree doesn't match the upstream widget tree; add the missing elements
- **Wrong default props** — check upstream C source for default values and fix the React component
- **Color/number slightly off** — only use relaxed tolerances (custom assertions with `gtkAssert`) when the mismatch is caused by a known, documented conversion issue (e.g. color-mix gamut shifts). Don't use tolerances to paper over bugs in our code.

### 5. Update the checklist

Mark {{COMPONENT}} and its test variants as checked in `TEST-COMPONENTS.md`, matching the format of existing entries.

### 6. Lint and type-check

```sh
bun run check
bun run fix
```

Fix any issues before committing.

### 7. Open a pull request

Commit your changes and open a PR. The PR title should be something like `feat: add structural regression tests for {{COMPONENT}}`. If you also fixed the web component, mention that in the PR body. Include a summary of which test variants you added and any fixes you made to the codebase.

## CI environment

Tests run in CI inside the `ghcr.io/gtk-rs/gtk4-rs/gtk4:latest` Docker image (Fedora-based with GTK4 pre-installed). Additional deps installed: `sassc`, `unzip`, `cargo`. Submodules are checked out recursively. Your changes must work in this environment — don't depend on anything not available there.

## Important rules

- **Upstream submodules are the source of truth** — `upstream/gtk/`, `upstream/libadwaita/`, `upstream/adwaita-icon-theme/` contain the real GTK code. When our web rendering doesn't match, fix our code, not the tests.
- **Fix our codebase when needed** — if a component, CSS transform, layout class, or anything else in our code is wrong or incomplete, fix it. Don't just write tests around broken behavior.
- **ALWAYS cross-reference upstream** — check the C source and SCSS before implementing anything
- **Match existing patterns exactly** — naming conventions, file structure, code style
- **`content-box` sizing** — do NOT use `border-box`
- **Use Bun, not Node.js**
- **Run `bun run check` and `bun run fix` before committing**
