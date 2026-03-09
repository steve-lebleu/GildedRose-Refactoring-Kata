# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install          # Install dependencies
npm run test:jest    # Run tests with Jest (includes coverage)
npm run test:jest:watch  # Run Jest in watch mode
npm run test:mocha   # Run tests with Mocha + nyc coverage
npm run test:vitest  # Run tests with Vitest (includes coverage)
npm run compile      # Compile TypeScript
```

Run the golden master text fixture (useful for manually inspecting output):
```sh
npx ts-node test/golden-master-text-test.ts
npx ts-node test/golden-master-text-test.ts 10  # with number of days
```

## Architecture

This is the [Gilded Rose kata](https://github.com/emilybache/GildedRose-Refactoring-Kata) — a refactoring exercise with intentionally messy legacy code.

**The constraint**: You may not alter the `Item` class or its properties. Only `GildedRose` and its `updateQuality()` method are meant to be refactored.

### Key files

- `app/gilded-rose.ts` — The only production file. Contains `Item` and `GildedRose` classes. The goal of the kata is to refactor `updateQuality()` and add support for "Conjured" items.
- `test/golden-master-text-test.ts` — TextTest fixture used by approval tests; simulates multi-day inventory updates.

### Test structure

Three independent test suites, each in its own subdirectory:

| Suite | Directory | Style |
|-------|-----------|-------|
| Jest | `test/jest/` | Unit tests (`gilded-rose.spec.ts`) + snapshot/approval tests (`approvals.spec.ts`) |
| Mocha | `test/mocha/` | Unit tests with Chai assertions |
| Vitest | `test/vitest/` | Mirrors Jest suite |

Path alias `@/*` maps to `app/*` (configured in `tsconfig.json` and picked up by each test runner).

### Item rules (business logic)

- Normal items: quality degrades by 1/day; degrades 2x after `sellIn < 0`; quality never below 0
- **Aged Brie**: quality increases with age; max quality 50
- **Sulfuras**: never changes (sellIn and quality immutable; quality is always 80)
- **Backstage passes**: quality increases by 1 normally, +2 when `sellIn ≤ 10`, +3 when `sellIn ≤ 5`; drops to 0 after concert (`sellIn < 0`)
- **Conjured** (not yet implemented): degrades in quality 2x as fast as normal items
