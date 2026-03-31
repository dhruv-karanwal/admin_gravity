# Design System Specification: The Kinetic Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Editorial"**
This design system moves away from the sterile, "template-box" feel of traditional fitness SaaS. It treats data-rich fitness management with the prestige of a high-end sports editorial. By merging high-density information with intentional asymmetry and tonal layering, we create an environment that feels authoritative, professional, and fast. 

We break the "standard dashboard" grid by utilizing overlapping surfaces and shifting elevations, ensuring the UI feels like a curated experience rather than a database entry form.

## 2. Colors & Surface Philosophy
The palette leverages high-impact reds and deep obsidians to evoke energy and strength, balanced by a sophisticated "Off-White" and "Ice-Blue" foundation to maintain clarity during long-duration data tasks.

### Core Palette
- **Primary Kinetic:** `#af000b` (Primary) / `#d81b1b` (Primary Container) — Use for critical actions and brand resonance.
- **Deep Gravity:** `#8b0000` (Secondary/Sidebar) — Provides the "anchor" for the left-hand navigation.
- **Surface Foundation:** `#fbf9f8` (Surface) / `#f5f3f3` (Surface Container Low) — The canvas for all data.

### The "No-Line" Rule
To achieve a premium feel, **1px solid borders are prohibited for sectioning.** Conventional borders create visual noise and "trap" data. Instead, define boundaries through:
- **Tonal Shifts:** Place a `surface-container-lowest` (#ffffff) card against a `surface-container-low` (#f5f3f3) background.
- **Negative Space:** Use the spacing scale (e.g., `8` or `10`) to create "breathing" channels between logical groups.

### The "Glass & Gradient" Rule
Floating elements (Modals, Hover states, or Tooltips) must utilize **Glassmorphism**. Apply `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur. 
*Signature Polish:* Main Action Buttons or Hero Data Points should use a subtle linear gradient from `primary` (#af000b) to `primary-container` (#d81b1b) at a 135° angle to add depth.

## 3. Typography: The Power Scale
We utilize a pairing of **Plus Jakarta Sans** for high-impact headlines (providing a modern, geometric edge) and **Inter** for high-density data legibility.

- **Display & Headlines (Plus Jakarta Sans):** Use `headline-lg` (2rem) for dashboard overviews. The SemiBold weight conveys the "Gravity" of the brand.
- **Titles & Body (Inter):** Use `title-sm` (1rem) for card headers and `body-md` (0.875rem) for the primary data rows.
- **Labels (Inter Medium):** Use `label-md` (0.75rem) in `on-surface-variant` (#5d3f3c) for table headers and metadata.

**Editorial Hierarchy:** Always lead with a strong `headline-sm` to anchor a page, then drop immediately to `body-md` for data. This high-contrast jump creates a sophisticated, professional rhythm.

## 4. Elevation & Depth
In this design system, "Gravity" is expressed through weight and layering, not artificial lines.

### The Layering Principle (Tonal Stacking)
- **Base Layer:** `surface` (#fbf9f8) - The main app background.
- **Section Layer:** `surface-container-low` (#f5f3f3) - For grouping large modules like a sidebar or a secondary feed.
- **Component Layer:** `surface-container-lowest` (#ffffff) - For the actual data cards.

### Ambient Shadows
Avoid "Drop Shadows." When an element must float (e.g., a dragged workout module), use an **Ambient Glow**:
- **Color:** `on-surface` (#1b1c1c) at 6% opacity.
- **Specs:** `0px 12px 32px`. This mimics natural light and keeps the interface feeling "light" despite the high density.

### The "Ghost Border" Fallback
If contrast is required for accessibility (e.g., Input fields), use the **Ghost Border**: `outline-variant` (#e7bdb7) at 30% opacity. 

## 5. Components & Data Density

### Sidebars (The Anchor)
The sidebar uses `secondary` (#b52619) or the Deep Red (#8B0000). To avoid a "flat" look, the active state should not be a box, but a **Negative Notch**: the active item background matches the `surface` color, "cutting" into the sidebar to reveal the content area.

### Data Cards & Tables
- **Card Styling:** No borders. `0.5rem` (lg) corner radius. Use `surface-container-lowest` on a `surface-container-low` background.
- **The "No-Divider" Table:** Lists and tables must use **Zebra Striping** (alternating `surface-container-lowest` and `surface-container-low`) instead of horizontal lines. This increases horizontal scanning speed for fitness metrics.
- **Padding:** Maintain high density by using `3` (0.6rem) vertical and `5` (1.1rem) horizontal padding for table cells.

### Buttons & Interaction
- **Primary:** Gradient fill (`primary` to `primary-container`). `0.375rem` (md) radius. White text.
- **Secondary:** Transparent with a "Ghost Border."
- **Tertiary:** Text-only with an underline that appears only on hover, using `primary` (#af000b).

### Specialized Fitness Components
- **The Metric Pulse:** A small trend line (Sparkline) using `tertiary` (#0d631b) for growth or `error` (#ba1a1a) for decline, nested directly within a `title-lg` metric for immediate context.
- **Status Chips:** For "Active Membership" or "Class Full." Use `tertiary-fixed` (#a3f69c) background with `on-tertiary-fixed` (#002204) text. No borders; pill-shaped (`9999px`).

## 6. Do’s and Don’ts

### Do:
- **Use Asymmetric Layouts:** Allow a 2/3 width data table to sit next to a 1/3 width vertical "Quick Action" stack to create editorial interest.
- **Nesting Surfaces:** Place a "Success Green" metric chip inside a white card, which sits on a light grey section.
- **Data Clarity:** Use `body-sm` for secondary labels to keep the primary `headline-sm` numbers as the focal point.

### Don’t:
- **Don't use 100% Black:** Use `on-surface` (#1b1c1c) for text to maintain a premium, softer look.
- **Don't use Divider Lines:** If you feel the need for a line, increase the spacing (`spacing-4`) or shift the background color by one tier instead.
- **Don't Over-Shadow:** Only the top-most layer (modals/popovers) should have a shadow. Everything else stays flat and tonally separated.