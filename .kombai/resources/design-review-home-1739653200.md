# Design Review Results: Home Page (/)

**Review Date**: February 15, 2026
**Route**: `/` (Home/Landing page)
**Focus Areas**: Visual Design, Responsive/Mobile, Micro-interactions, Consistency

## Summary
The home page has a strong visual foundation with good use of design tokens and attractive glassmorphism effects. However, critical responsive issues cause content loss on mobile, and several micro-interactions are missing or inconsistent across different sections.

## Issues

| # | Issue | Criticality | Category | Location |
|---|-------|-------------|----------|----------|
| 1 | Rising Stars card disappears completely on mobile viewport | 🔴 Critical | Responsive | `apps/web/src/components/home/bento-grid.tsx:28-91` |
| 2 | PostHog survey modal appears on page load (potentially intrusive UX) | 🟠 High | UX/Consistency | Page load behavior (external script) |
| 3 | Hardcoded gradient colors bypass design token system | 🟡 Medium | Visual Design | `apps/web/src/components/home/bento-grid.tsx:31,95` |
| 4 | No hover animation on "View Rankings" link despite using group/link pattern | ⚪ Low | Micro-interactions | `apps/web/src/components/home/bento-grid.tsx:82-88` |
| 5 | Inconsistent button styling between "Login" and search buttons | 🟡 Medium | Consistency | `apps/web/src/components/header/header.tsx` vs `apps/web/src/components/home/home-search.tsx` |
| 6 | Missing loading state animation for character search | 🟡 Medium | Micro-interactions | `apps/web/src/components/home/home-search.tsx` |
| 7 | Character name input lacks keyboard navigation to search button | 🟠 High | Accessibility | `apps/web/src/components/home/home-search.tsx` |
| 8 | Ribbon announcement banner lacks close/dismiss button | 🟡 Medium | UX | `apps/web/src/components/ribbon/ribbon.tsx` |
| 9 | Bento grid cards use hardcoded shadow values instead of shadow-* utilities | ⚪ Low | Visual Design | `apps/web/src/components/home/bento-grid.tsx:30,94` |
| 10 | Top gainer cards have jarring scale animation on hover (scale-[1.02]) | ⚪ Low | Micro-interactions | `apps/web/src/components/home/bento-grid.tsx:50` |
| 11 | Mobile menu hamburger icon missing focus visible state | 🟠 High | Accessibility | `apps/web/src/components/header/mobile-header.tsx` |
| 12 | Inconsistent spacing between hero section and bento grid (gap-8 md:gap-12) vs other sections | ⚪ Low | Consistency | `apps/web/src/app/[locale]/(public)/page.tsx:31` |

## Criticality Legend
- 🔴 **Critical**: Breaks functionality or violates accessibility standards
- 🟠 **High**: Significantly impacts user experience or design quality
- 🟡 **Medium**: Noticeable issue that should be addressed
- ⚪ **Low**: Nice-to-have improvement

## Next Steps
1. **Priority 1**: Fix responsive layout for Rising Stars card (Issue #1)
2. **Priority 2**: Add keyboard navigation support for character search (Issue #7)
3. **Priority 3**: Review and adjust PostHog survey timing/triggers (Issue #2)
4. **Priority 4**: Standardize button styling across components (Issue #5)
5. **Future Enhancement**: Refactor hardcoded values to use design tokens (Issues #3, #9)
