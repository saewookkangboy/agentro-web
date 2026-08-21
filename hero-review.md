# Agentro Hero review

## Reference adaptation

The Home Hero now follows the supplied Agentic reference's orchestration language: a central Agentro Core, four connected workflow nodes, animated connection pulses, orbit rings, live system status, and an operational footer rail. The existing Korean headline, program CTA, webinar CTA, shader background, and mobile navigation remain intact.

## Responsive verification

At 1280×720, the headline and orchestration field sit in a two-column composition with four visible nodes and the center core. At 390×844, the Hero stacks the copy above the orchestration field, keeps both CTAs visible, and scales the node field to avoid horizontal overflow. Screenshots were captured for both breakpoints.

## Accessibility and motion

The orchestration visual has a descriptive `role="img"` and Korean `aria-label`. Decorative grid, rings, and connection lines are hidden from assistive technology. The CSS includes an explicit `prefers-reduced-motion: reduce` rule that disables orbit, pulse, line, and node animations while retaining the static visual hierarchy.

## Performance sanity

The visual is CSS-only with lightweight Lucide icons and no additional image or runtime animation dependency. It uses transform/opacity animations rather than layout animation and was checked through the responsive preview. `pnpm check` and `pnpm test` both pass; Vitest reports 2 files and 4 tests passing.
