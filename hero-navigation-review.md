# Hero node navigation review

Each orchestration node is now a native button with an explicit Korean accessible name. The four mappings are `업무 맥락 → curriculum-context`, `판단 기준 → curriculum-decision`, `도구 연결 → curriculum-tools`, and `운영 결과 → curriculum-output`.

Activation uses `scrollIntoView` with smooth behavior by default and automatic behavior when `prefers-reduced-motion: reduce` is active. The current target is written to the URL hash with `history.replaceState`, so the destination remains shareable without a full page reload. After scrolling, the target receives programmatic focus without changing the scroll position. Curriculum rows and the process heading have visible focus outlines and scroll margins for the sticky site navigation.

Desktop and mobile Hero screenshots were rechecked after the interaction pass. TypeScript and Vitest pass with 2 files and 4 tests.
