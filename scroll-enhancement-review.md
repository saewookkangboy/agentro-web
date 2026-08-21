# Scroll enhancement review

The Home page now shows a fixed, keyboard-accessible TOP control after the user scrolls beyond the Hero region. It uses smooth scrolling to the top and clears the current hash; reduced-motion users receive an immediate scroll instead.

An IntersectionObserver watches the three curriculum tracks and the process/output anchor. The corresponding Hero node receives the `is-active` visual state while its section is in the reading viewport. Hero node activation sets the same state immediately, updates the hash, and adds a temporary `arrival-highlight` class that fades after 1.6 seconds. The highlight also has a static reduced-motion fallback.

Desktop and mobile screenshots were captured after the changes. The Home Hero remained legible, node buttons retained usable touch targets, and the fixed control styling is constrained for narrow viewports. `pnpm check` and `pnpm test` pass with 2 test files and 4 tests.
