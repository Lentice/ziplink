## Project

Ziplink is a Chrome extension (Manifest V3) that shortens the current tab's URL via is.gd or v.gd. No build step, no bundler, no package manager — Chrome loads the files directly as ES modules.


## Architecture

```
popup.html / popup.css / popup.js   — single popup UI, no background service worker
services/
  registry.js   — services array + getService(id) lookup with fallback to first service
  isgd.js       — is.gd API adapter
  vgd.js        — v.gd API adapter
  tinyurl.js    — TinyURL API adapter
  spoome.js     — spoo.me API adapter
  cleanuri.js   — CleanURI API adapter
  dagd.js       — da.gd API adapter
  clckru.js     — Clck.ru API adapter
```

**Service contract** — every service module exports a default object:
```js
{ id: string, name: string, shorten(url): Promise<string> }
// shorten() must return the short URL or throw an Error with a human-readable message
```

`popup.js` static-imports `{ services, getService }` from `registry.js` at module load. Service pills are generated dynamically from the `services` array — `initPills()` creates `<button>` elements and returns a `Map<id, HTMLElement>` used by `applyPillSelection()`. User prefs (`selectedService`, `autoCopy`) are persisted via `chrome.storage.sync`.

`popup.html` declares `<link rel="modulepreload">` for `popup.js` and `registry.js` so Chrome fetches and compiles both modules during HTML parse, minimising the pill-render delay on popup open.

**Adding a new shortening service:**
1. Create `services/newservice.js` implementing the contract above
2. Import and add it to the `services` array in `registry.js`
3. Add the service domain to `host_permissions` in `manifest.json`

The popup generates pills dynamically from `services` — no other changes needed.

# Development Guidelines

## Philosophy

### Core Beliefs

- **Incremental progress over big bangs** - Small changes that compile and pass tests
- **Learning from existing code** - Study and plan before implementing
- **Pragmatic over dogmatic** - Adapt to project reality
- **Clear intent over clever code** - Be boring and obvious

### Simplicity Means

- Single responsibility per function/class
- Avoid premature abstractions
- No clever tricks - choose the boring solution
- If you need to explain it, it's too complex

## Process

### 1. Planning & Staging

Break complex work into 3-5 stages. Document in `IMPLEMENTATION_PLAN.md`:

```markdown
## Stage N: [Name]
**Goal**: [Specific deliverable]
**Success Criteria**: [Testable outcomes]
**Tests**: [Specific test cases]
**Status**: [Not Started|In Progress|Complete]
```
- Update status as you progress
- Remove file when all stages are done

### 2. Implementation Flow

1. **Understand** - Study existing patterns in codebase
2. **Test** - Write test first (red)
3. **Implement** - Minimal code to pass (green)
4. **Refactor** - Clean up with tests passing
5. **Commit** - With clear message linking to plan

### 3. When Stuck (After 3 Attempts)

**CRITICAL**: Maximum 3 attempts per issue, then STOP.

1. **Document what failed**:
   - What you tried
   - Specific error messages
   - Why you think it failed

2. **Research alternatives**:
   - Find 2-3 similar implementations
   - Note different approaches used

3. **Question fundamentals**:
   - Is this the right abstraction level?
   - Can this be split into smaller problems?
   - Is there a simpler approach entirely?

4. **Try different angle**:
   - Different library/framework feature?
   - Different architectural pattern?
   - Remove abstraction instead of adding?

## Technical Standards

### Architecture Principles

- **Composition over inheritance** - Use dependency injection
- **Interfaces over singletons** - Enable testing and flexibility
- **Explicit over implicit** - Clear data flow and dependencies
- **Test-driven when possible** - Never disable tests, fix them

### Code Quality

- **Every commit must**:
  - Compile successfully
  - Pass all existing tests
  - Include tests for new functionality
  - Follow project formatting/linting

- **Before committing**:
  - Run formatters/linters
  - Self-review changes
  - Ensure commit message explains "why"

### Error Handling

- Fail fast with descriptive messages
- Include context for debugging
- Handle errors at appropriate level
- Never silently swallow exceptions

## Decision Framework

When multiple valid approaches exist, choose based on:

1. **Testability** - Can I easily test this?
2. **Readability** - Will someone understand this in 6 months?
3. **Consistency** - Does this match project patterns?
4. **Simplicity** - Is this the simplest solution that works?
5. **Reversibility** - How hard to change later?

## Project Integration

### Learning the Codebase

- Find 3 similar features/components
- Identify common patterns and conventions
- Use same libraries/utilities when possible
- Follow existing test patterns

### Tooling

- Use project's existing build system
- Use project's test framework
- Use project's formatter/linter settings
- Don't introduce new tools without strong justification

## Quality Gates

### Definition of Done

- [ ] Tests written and passing
- [ ] Code follows project conventions
- [ ] No linter/formatter warnings
- [ ] Commit messages are clear
- [ ] Implementation matches plan
- [ ] No TODOs without issue numbers

### Test Guidelines

- Test behavior, not implementation
- One assertion per test when possible
- Clear test names describing scenario
- Use existing test utilities/helpers
- Tests should be deterministic

## Important Reminders

**NEVER**:
- Use `--no-verify` to bypass commit hooks
- Disable tests instead of fixing them
- Commit code that doesn't compile
- Make assumptions - verify with existing code

**ALWAYS**:
- Commit working code incrementally
- Update plan documentation as you go
- Learn from existing implementations
- Stop after 3 failed attempts and reassess
