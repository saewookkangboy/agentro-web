# Scroll runtime findings

The Home route loaded with `#curriculum-context`, confirming the anchor is addressable. The browser preview exposes the four native Hero node buttons with Korean hints and, after the node activation, the viewport moved into the curriculum section; the fixed `TOP` control became visible in the interactive element list. The destination curriculum track is rendered with the expected focused/outlined presentation, and the page remains usable at the scrolled position.

Desktop and mobile screenshots after the enhancement show the Hero nodes retain readable active styling and the mobile layout keeps the orchestration field within the viewport. The updated observer clears the active node when no tracked destination section is intersecting, preventing stale Hero state above or below the curriculum area.
