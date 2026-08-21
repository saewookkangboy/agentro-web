# Agentro font review

## Review scope

Reviewed the Home, webinar, instructor, program, and admin routes at 1280×720 and 390×844 after loading the user-provided Google Fonts stylesheet.

## Findings and fixes

The Home hero display headline benefits from Gowun Batang's lighter editorial rhythm and remains legible over the shader background. The webinar page keeps Hahmlet for the stronger conversion headline while IBM Plex Sans KR carries form labels and explanatory copy. Instructor and program pages retain the editorial character at mobile widths because the display scale wraps without clipping, and their supporting copy uses Noto Sans KR for stable Korean readability. The admin dashboard uses IBM Plex Sans for controls and tabular numbers, preventing dense operational UI from inheriting the decorative display face.

The remaining requested families were assigned to concrete roles rather than left as unused tokens: Nanum Gothic is used for footer/legal navigation text, while Gowun Dodum is used for metric captions, FAQ summaries, profile credential headings, and workflow labels. The review showed no horizontal overflow or clipped type at the checked breakpoints.

## Verification

`pnpm check` passed. `pnpm test` passed with 2 test files and 4 tests. Desktop and mobile screenshots were captured for all five primary routes.
