# Palette and curriculum-link runtime findings

The updated Home route renders the Color Hunt palette in the main action language: blue is used for the primary navigation CTA and curriculum metadata, yellow is used for Hero emphasis and active node/icon accents, and the dark maroon family supports the Hero/process atmosphere. The mobile and desktop previews retain readable contrast and the existing composition.

The interactive browser preview exposes three `섹션 링크 복사` buttons in the curriculum track area. After scrolling into the section, each button is positioned at the upper-right of its corresponding track row, stays compact, and shows the `LINK` label. The browser also exposes the floating `TOP` control after scrolling. Clipboard behavior includes the native Clipboard API with a textarea fallback and a temporary `COPIED` confirmation state.
