# Plan: Landing Page Visual Upgrade with mmx CLI

## TL;DR
Generate AI-powered hero illustration, step illustrations for "How It Works", and OG social sharing images using mmx CLI image generation.

## Context

### Original Request
User chose option A: Landing page visuals improvement using mmx CLI.

### Interview Summary
- Focus area: Landing page visual upgrade
- Priority: High visual impact, quick win
- No specific preferences on image style mentioned yet

## Work Objectives

### Core Objective
Replace generic numbered boxes in "How It Works" with AI-generated illustrative images, and add a hero illustration that matches the app's brand.

### Concrete Deliverables
1. Hero section: AI-generated illustration showing AI-powered transfer planning
2. How It Works: 3 step illustrations (goal setting, roadmap generation, tracking)
3. OG image: Social sharing image with CareerAC branding

### Definition of Done
- [ ] Hero illustration visible on landing page above the fold
- [ ] Each "How It Works" step has a contextual illustration
- [ ] OG image generated and configured in layout metadata
- [ ] All images responsive and optimized

### Must Have
- Images match CareerAC brand (blue/indigo gradient theme)
- Images clearly communicate transfer planning concept
- Fast loading (WebP format, appropriately sized)

### Must NOT Have
- Generic stock photo aesthetic
- Images that don't convey the AI/transfer planning concept
- Large file sizes that slow page load

---

## TODOs

- [ ] 1. Generate hero illustration using mmx CLI

  **What to do**:
  - Run mmx CLI to generate hero image with prompt describing transfer planning concept
  - Prompt: "Modern illustration of AI-powered academic planning, showing a student with a clear pathway from community college to university, blue and indigo color scheme, clean minimalist style, suitable for tech startup landing page"
  - Save to `public/images/hero-transfer-planning.png`
  - Use `mmx image generate --prompt "..." --aspect-ratio 16:9 --out-dir ./public/images --out-prefix hero`

  **Must NOT do**:
  - Don't use realistic photos (doesn't match current glassmorphism aesthetic)
  - Don't generate multiple variations yet (just one hero first)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: Simple image generation task, no complex logic needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4 (hero integration)
  - **Blocked By**: None

  **References**:
  - `src/app/page.tsx:29-68` - Hero section structure to integrate image into

  **Acceptance Criteria**:
  - [ ] Image generated at `public/images/hero-transfer-planning.png`
  - [ ] Image file exists and is < 2MB
  - [ ] Dimensions approximately 1920x1080 or similar 16:9 ratio

  **QA Scenarios**:

  ```
  Scenario: Hero image generation
    Tool: Bash
    Preconditions: mmx CLI authenticated
    Steps:
      1. Run: mmx image generate --prompt "Modern illustration..." --aspect-ratio 16:9 --out-dir ./public/images --out-prefix hero --quiet
      2. Verify file exists: ls -la public/images/hero*.png
    Expected Result: PNG file exists with reasonable file size
    Evidence: public/images/hero-transfer-planning.png

  Scenario: Image integration into hero section
    Tool: Playwright
    Preconditions: Dev server running, image exists
    Steps:
      1. Open http://localhost:3000
      2. Verify hero image loads (no broken image icon)
      3. Take screenshot of hero section
    Expected Result: Hero shows both text content and illustration
    Evidence: .sisyphus/evidence/landing-hero.png
  ```

  **Commit**: YES
  - Message: `feat(landing): add hero illustration`
  - Files: `public/images/hero-transfer-planning.png`, `src/app/page.tsx`

---

- [ ] 2. Generate "How It Works" step illustrations

  **What to do**:
  - Generate 3 step illustrations using mmx CLI
  - Step 1 (Goals): "Illustration of student sharing their academic goals with AI chat interface, community college to university pathway visualization, blue gradient, minimalist clean style"
  - Step 2 (Roadmap): "Illustration of semester-by-semester roadmap calendar with checkmarks, AI generating personalized plan, blue indigo color scheme, modern tech startup aesthetic"
  - Step 3 (Tracking): "Illustration of student staying on track with progress indicators, smart recovery suggestions, connected pathway to university, blue purple gradient, clean minimalist"
  - Save to `public/images/step-1-goals.png`, `step-2-roadmap.png`, `step-3-tracking.png`

  **Must NOT do**:
  - Don't make step numbers prominent (they're already in the design)
  - Don't use photos - illustrations only

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (all 3 images independent)
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 4 (step illustrations)
  - **Blocked By**: None

  **References**:
  - `src/app/page.tsx:86-135` - How It Works section structure

  **Acceptance Criteria**:
  - [ ] 3 step images generated in `public/images/`
  - [ ] Each image < 1MB
  - [ ] All images use consistent blue/indigo color scheme

  **QA Scenarios**:

  ```
  Scenario: Step illustrations generated
    Tool: Bash
    Preconditions: mmx CLI ready
    Steps:
      1. Generate step 1: mmx image generate --prompt "..." --aspect-ratio 1:1 --out-dir ./public/images --out-prefix step-1 --quiet
      2. Generate step 2: mmx image generate --prompt "..." --aspect-ratio 1:1 --out-dir ./public/images --out-prefix step-2 --quiet
      3. Generate step 3: mmx image generate --prompt "..." --aspect-ratio 1:1 --out-dir ./public/images --out-prefix step-3 --quiet
      4. Verify: ls -la public/images/step-*.png
    Expected Result: 3 PNG files exist
    Evidence: public/images/step-{1,2,3}-*.png

  Scenario: Step illustrations display correctly
    Tool: Playwright
    Preconditions: Dev server running, images exist
    Steps:
      1. Open http://localhost:3000
      2. Scroll to "How It Works" section
      3. Verify 3 step images display
      4. Take screenshot
    Expected Result: All 3 illustrations visible, consistent style
    Evidence: .sisyphus/evidence/landing-how-it-works.png
  ```

  **Commit**: YES
  - Message: `feat(landing): add step illustrations`
  - Files: `public/images/step-*.png`, `src/app/page.tsx`

---

- [ ] 3. Generate OG social sharing image

  **What to do**:
  - Generate OG image (1200x630) for social media sharing
  - Prompt: "CareerAC branded social card, AI-powered transfer planning platform, blue indigo gradient background, text 'Your Transfer Path, Perfectly Clear', modern tech startup aesthetic, clean minimalist design suitable for social media"
  - Save to `public/images/og-image.png`
  - Add OG metadata to `src/app/layout.tsx`

  **Must NOT do**:
  - Don't include actual UI screenshots (quick to become outdated)
  - Don't use photos - illustration style only

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5 (OG integration)
  - **Blocked By**: None

  **References**:
  - `src/app/layout.tsx` - Add OG image metadata here

  **Acceptance Criteria**:
  - [ ] OG image at `public/images/og-image.png`
  - [ ] 1200x630 dimensions
  - [ ] layout.tsx updated with og:image metadata

  **QA Scenarios**:

  ```
  Scenario: OG image generated
    Tool: Bash
    Preconditions: mmx CLI ready
    Steps:
      1. Generate: mmx image generate --prompt "..." --aspect-ratio 1200:630 --out-dir ./public/images --out-prefix og-image --quiet
      2. Verify: file public/images/og-image.png
      3. Check dimensions: file public/images/og-image.png
    Expected Result: Image exists with correct aspect ratio
    Evidence: public/images/og-image.png
  ```

  **Commit**: YES
  - Message: `feat(landing): add OG social sharing image`
  - Files: `public/images/og-image.png`, `src/app/layout.tsx`

---

- [ ] 4. Integrate hero illustration into hero section

  **What to do**:
  - Add the hero image below the CTA or as a background element
  - Style to match glassmorphism aesthetic (slight transparency, rounded corners, subtle shadow)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (after Task 1)
  - **Blocks**: None
  - **Blocked By**: Task 1

---

- [ ] 5. Integrate step illustrations into How It Works section

  **What to do**:
  - Add illustrations above each step number in the 3-step cards
  - Size: approximately 80x80px icons within the cards

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (after Task 2)
  - **Blocks**: None
  - **Blocked By**: Task 2

---

## Final Verification Wave

- [ ] F1. **Visual Consistency Check** — `visual-engineering`
  Verify all 4 generated images have consistent blue/indigo color scheme and illustration style.
  Output: `Consistent [Y/N] | File sizes [list] | VERDICT`

- [ ] F2. **Page Load Performance** — `unspecified-high`
  Run Lighthouse audit, verify hero image doesn't significantly impact load time.
  Output: `Load time delta [ms] | Lighthouse score [N/100] | VERDICT`

- [ ] F3. **Responsive Design Check** — `playwright`
  Test landing page at 375px, 768px, 1440px viewport widths.
  Output: `375px [OK/ISSUE] | 768px [OK/ISSUE] | 1440px [OK/ISSUE] | VERDICT`

## Commit Strategy

- Task 1 + 4: `feat(landing): add hero illustration`
- Task 2 + 5: `feat(landing): add step illustrations`
- Task 3: `feat(landing): add OG social sharing image`
- Final: `perf(landing): verify image optimization`

## Success Criteria

```bash
# Images exist
ls public/images/hero*.png    # Hero image
ls public/images/step-*.png   # 3 step illustrations
ls public/images/og*.png      # OG image

# Page loads without errors
curl -s http://localhost:3000 | grep -c "hero\|step\|og"  # References found

# No broken images in browser
# (Playwright screenshot shows all images loading)
```