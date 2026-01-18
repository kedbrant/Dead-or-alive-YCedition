# YC Archive Improvements Plan

## Overview
This plan addresses all items from the Improvements document, organized by priority and complexity.

---

## 1. Branding & Assets (High Priority)

### 1.1 New Logo
- [ ] Fetch the new logo from the other branch (orange backdrop with black skull/rocket)
- [ ] Add to `/public/logo.png`
- [ ] Update navbar to use new logo (if showing image instead of text)

### 1.2 YC Orange Accent Color
- [ ] Define YC orange color variable (`#FF6600` or similar)
- [ ] Apply to "YC-ARCHIVE" text branding
- [ ] Apply to accent elements throughout the app
- [ ] Update `globals.css` with new accent color variable

---

## 2. Homepage Improvements (High Priority)

### 2.1 Input Field Redesign
- [ ] Make input field wider (AI chat-style)
- [ ] Change to 2 rows tall instead of 3
- [ ] Style like modern AI input (rounded, prominent)

### 2.2 Remove Feature Badges
- [ ] Delete the "5,500+ YC startups", "Live trends", "Real sentiment" badges section

### 2.3 100vh Desktop Height
- [ ] Ensure homepage fits within 100vh on desktop (no scroll)
- [ ] Adjust spacing/margins to fit content

---

## 3. Loading Screen Improvements (Medium Priority)

### 3.1 Remove YC Archive Text
- [ ] Remove the "YC-ARCHIVE" logo text from loading state

### 3.2 YC Orange Accent Colors
- [ ] Progress bar: YC orange fill
- [ ] Checkmark ticks: YC orange when complete
- [ ] Box borders: YC orange when item completed
- [ ] Keep neutral colors for pending/loading states

---

## 4. Report Page - Major Overhaul (High Priority)

### 4.1 New Top Card Design
- [ ] Create combined header card with:
  - Score displayed as circular progress (100% = full circle)
  - Rating/verdict below the score
  - "Idea" tag on the left
  - User's idea text displayed prominently
- [ ] Make this visually striking

### 4.2 Competitor Analysis Section (NEW - Top Position)
- [ ] Move AI competitive analysis to top of report (after header)
- [ ] Rename to "Competitor Analysis"
- [ ] This summarizes all competitor data before showing details

### 4.3 Collapsible Data Sections
Create 3 collapsible cards below the analysis:
- [ ] **YC Companies** (collapsible)
- [ ] **Product Hunt Launches** (collapsible)
- [ ] **Competitor Landscape** (collapsible)

### 4.4 YC Companies Section Improvements
- [ ] Add company favicon to each item (fetch from company domain or YC)
- [ ] Show only: Company name + one-liner tagline
- [ ] Remove full "about" text (show on company page only)
- [ ] Make items clickable → navigate to company page
- [ ] Company page needs back button to return to report

### 4.5 Competitor Landscape Improvements
- [ ] Make companies clickable (if URL available)
- [ ] Add favicon or fallback circle with first letter
- [ ] Keep status badges (Active/Acquired/Dead/Unknown)

### 4.6 Google Trends Section (MISSING - CRITICAL)
- [ ] Re-add Google Trends data fetching
- [ ] Display keyword analysis
- [ ] Add trend graphs/charts
- [ ] This was a key visual element

### 4.7 Section Summaries
- [ ] Add AI summary paragraph before each data section
- [ ] Currently some sections have this, ensure consistency

### 4.8 Share Button
- [ ] Add share button at bottom of report
- [ ] Copy link to clipboard functionality
- [ ] Optional: social share buttons

---

## 5. Bug Fixes (High Priority)

### 5.1 Product Hunt GraphQL Error
```
Field 'posts' doesn't accept argument 'query'
Variable $query is declared but not used
```
- [ ] Fix the GraphQL query in `/lib/data-sources/producthunt.ts`
- [ ] Update to use correct PH API schema

### 5.2 Stats 401 Errors
```
GET /api/stats 401
```
- [ ] The navbar was calling `/api/stats` for Oracle score
- [ ] Already fixed by simplifying navbar (no more stats calls)
- [ ] Verify no other components are calling this

### 5.3 Session/Middleware Error on Company Pages
- [ ] Debug the company page navigation issue
- [ ] Ensure clicking YC company → company page works
- [ ] Add proper back navigation

---

## 6. Visual Improvements (Medium Priority)

### 6.1 More Visual Elements
- [ ] Score circle graphic (gauge/progress circle)
- [ ] Google Trends line chart
- [ ] Consider icons for each section
- [ ] Better visual hierarchy

### 6.2 Reduce Text Density
- [ ] Collapsible sections help with this
- [ ] Summary-first approach
- [ ] Progressive disclosure of details

---

## Implementation Order (Suggested)

### Phase 1: Critical Fixes
1. Fix Product Hunt GraphQL error
2. Fix company page navigation
3. Verify stats calls are removed

### Phase 2: Homepage Polish
4. Remove feature badges
5. Redesign input field (AI-style, 2 rows)
6. Ensure 100vh height

### Phase 3: Loading Screen
7. Remove YC Archive text
8. Apply YC orange to progress elements

### Phase 4: Report Overhaul
9. Create new header card with score circle
10. Add Competitor Analysis section at top
11. Make data sections collapsible
12. Improve YC Companies (favicons, one-liners, clickable)
13. Improve Competitor Landscape (clickable, favicons)
14. Re-add Google Trends with graphs
15. Add share button

### Phase 5: Branding
16. Add YC orange accent color
17. Update logo if needed

---

## Notes
- Navbar has already been simplified to validation-only ✓
- Accessibility improvements already done ✓
- The report is the biggest piece of work
- Google Trends re-integration is critical for visuals
