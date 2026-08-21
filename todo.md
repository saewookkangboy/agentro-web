# Project TODO

- [x] Establish Agentro deep-green visual system with monospace accents and persistent light/dark theme
- [x] Build responsive public navigation with mobile hamburger menu
- [x] Build Home landing page with WebGL/shader-style dynamic hero, metric ribbon, curriculum tracks, process, cases, instructor preview, program comparison, and FAQ
- [x] Build webinar pre-registration page with orb/space visual treatment, benefits, counter, form validation, and submitted state
- [x] Build instructor index and individual instructor profile routes with minimalist portfolio layout
- [x] Build curriculum/program listing and detail routes with tracks, learning steps, schedule, price, and enrollment CTA
- [x] Design and migrate database schema for editable site settings, page sections, instructors, instructor curriculum items, programs, program steps, FAQs, webinar settings, and webinar applicants
- [x] Add public tRPC queries for published content and webinar registration mutation
- [x] Add protected admin procedures with admin role enforcement for all CRUD operations
- [x] Build DashboardLayout-based admin dashboard with sidebar navigation
- [x] Build admin content editor for global settings and Home sections
- [x] Build admin webinar editor and applicant management table
- [x] Build admin instructor CRUD with public/private toggle and curriculum item management
- [x] Build admin program and FAQ CRUD interfaces
- [x] Implement instructor photo upload to S3 and automatic profile URL connection
- [x] Implement webinar applicant CSV export
- [x] Implement administrator in-app notification on webinar submission
- [x] Add loading, empty, error, validation, and success states across public and admin flows
- [x] Add responsive and accessibility verification for desktop and mobile
- [x] Write and run Vitest coverage for content, permissions, registration, CSV, and upload helpers
- [x] Save final checkpoint after all completed items are marked complete

- [x] Review taste-skill guidance from https://github.com/Leonxlnx/taste-skill and translate it into Agentro design decisions
- [x] Refine visual tokens, typography hierarchy, spacing rhythm, surface treatment, and interactive states across public pages
- [x] Strengthen Home hero, navigation, cards, section transitions, and conversion CTAs using the taste-skill direction
- [x] Refine webinar Orb composition, form card, and trust/benefit presentation
- [x] Refine instructor and program layouts with more editorial portfolio character
- [x] Improve admin dashboard hierarchy, navigation, tables, and editor affordances
- [x] Re-run desktop/mobile screenshots, TypeScript, and Vitest checks after the design pass
- [x] Save a new design refinement checkpoint

- [x] Replace the current font import with the user-provided Google Fonts stylesheet
- [x] Apply IBM Plex Sans KR, IBM Plex Sans, Gowun Batang, Hahmlet, Noto Sans KR, Nanum Gothic, and Gowun Dodum through explicit role-based typography tokens across the site
- [x] Verify typography hierarchy and responsive readability on public and admin routes
- [x] Run TypeScript/Vitest checks and save the font refinement checkpoint

- [x] Define the text-based Agentro wordmark treatment using the current Korean editorial font system
- [x] Create a reusable SVG wordmark and compact SVG favicon with the Agentro rounded-square system motif
- [x] Apply the brand assets to public navigation, webinar header, instructor/program headers, admin shell, page title, and favicon metadata
- [x] Verify logo legibility and responsive sizing, then run checks and save the branding checkpoint

- [x] Design webinar and instructor social preview compositions using the generated Agentro wordmark and brand mark
- [x] Create optimized OG image assets for webinar and instructor profile sharing
- [x] Add route-aware Open Graph and Twitter Card metadata for webinar and instructor pages
- [x] Verify OG assets and metadata, run checks, and save the social sharing checkpoint

- [x] Analyze the provided Agentic AI Hero reference and map its animation language to Agentro's brand
- [x] Design an orchestration-style Hero animation state model with reduced-motion fallback
- [x] Replace the Home Hero visual treatment while preserving Agentro copy, CTA, and mobile navigation
- [x] Verify Hero animation performance, responsive behavior, accessibility, and save the Hero refinement checkpoint

- [x] Map Hero nodes to the corresponding curriculum track anchors
- [x] Add click and keyboard activation with smooth scrolling and URL hash updates
- [x] Verify focus states, reduced-motion behavior, mobile interaction, and save the navigation checkpoint

- [x] Add an accessible floating button that smoothly returns the user to the Home Hero top
- [x] Track curriculum scroll position and show the corresponding active state on Hero nodes
- [x] Add temporary arrival highlighting to curriculum sections after Hero node navigation
- [x] Verify desktop/mobile scrolling, keyboard behavior, reduced-motion behavior, tests, and save the interaction checkpoint

- [x] Review the supplied Color Hunt palette and map the four colors to Agentro semantic design tokens
- [x] Apply the new palette across global CSS, Hero, buttons, cards, states, navigation, webinar, instructor, program, and admin surfaces
- [x] Add unique copy-link buttons to the top-right of each curriculum section with hash URLs and copied feedback
- [x] Verify contrast, responsive placement, clipboard fallback, tests, and save the palette/link checkpoint

- [x] Audit the project for all legacy green color literals, green-named tokens, gradients, shadows, and inline styles
- [x] Replace all green visual treatments with the Color Hunt blue/yellow/magenta/maroon palette across shared, public, and admin surfaces
- [x] Verify no legacy green values remain, then run screenshots, TypeScript/Vitest, and save the palette cleanup checkpoint

- [x] Apply the same global header menu to Programs and Instructors pages and detail views
- [x] Remove the top text-based 관리자 button from public headers
- [x] Add a distinct accessible admin icon link to the footer and preserve discoverability on mobile
- [x] Verify cross-page navigation, responsive headers/footers, accessibility, tests, and save the navigation checkpoint

- [x] Review the failed AgentOrchestration visual edit target and inspect all Hero text/background color declarations
- [x] Apply explicit readable text colors to the orchestration core, node labels, status copy, and supporting metadata
- [x] Verify contrast and responsive rendering, run TypeScript/Vitest, and save the visual correction checkpoint

- [x] Inspect the failed Instructors detail edit target and review current profile container spacing
- [x] Rebalance left/right margins and the two-column detail grid for desktop and mobile
- [x] Verify the instructor detail route visually, run TypeScript/Vitest, and save the spacing correction checkpoint

- [x] Review the failed AgentOrchestration white-text edit target and the malformed Home Hero inline style values
- [x] Remove invalid empty px styles, set all four Hero node text labels to white, and smooth the swirl background gradient boundaries
- [x] Tune Hero headline letter spacing and line spacing for readability on desktop and mobile
- [x] Verify the corrected Hero visually, run TypeScript/Vitest, and save the Hero cleanup checkpoint

- [x] Define a typed CMS setting format for four Hero node descriptions tied to curriculum anchors
- [x] Extend public/admin content loading and protected setting save coverage for Hero node descriptions
- [x] Replace hardcoded Hero node copy with CMS-backed descriptions and curriculum-derived fallbacks
- [x] Add administrator fields for all four Hero node descriptions with hydration, save, and success states
- [x] Add tests and verify public/admin data flow, responsive rendering, and save a new checkpoint
