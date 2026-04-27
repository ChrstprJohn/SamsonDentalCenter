# Component Design: Navigation & Layout Patterns

Documentation for core page structural patterns, border standards, and pagination strategies across PrimeraDental.

## 1. Page Scaffolding (Edge-to-Edge)
To maximize readability and "touch-targets" on mobile, the architecture prioritizes edge-to-edge containers.

### Mobile Page Layout
- **Containers**: Use `p-0` on mobile to let content touch the screen edges.
- **Separation**: Use high-visibility `border-b border-gray-200` to divide sections instead of margins/gaps.
- **Rounding**: Containers should be `rounded-none` on mobile to create a seamless vertical list feel.

### Desktop Page Layout
- **Padding**: Use `sm:p-4 lg:p-6` for page-level gutters.
- **Corners**: Use `sm:rounded-xl` for all primary containers and card grids.
- **Shadows**: Apply `shadow-sm` consistently to match the high-fidelity administrative look.

## 2. Border & Visibility Standards
Visible borders are essential for maintaining hierarchy in a data-rich environment.

- **Standard Border**: `border-gray-200` / `dark:border-gray-800`.
- **Usage**: Apply to all card containers, search inputs, and page-level dividers.
- **Consistency**: All modules (Services, Doctors, Settings) MUST use the same `gray-200` weight to ensure a unified design system.

## 3. Smart Pagination (Load More)
For card grids and data lists, "Infinite Scroll" or "Load More" buttons are preferred over traditional pagination to maintain the "Dashboard" feel.

### Load More Pattern
- **Batch Size**: Default display and incremental loads should be **6 items** to maintain visual balance and reduce scroll fatigue.
- **Reasoning**: This pattern (Fitts's Law) provides a larger, more predictable touch target than small pagination numbers, improving mobile speed and desktop flow.

## 4. Contextual Action Placement
To balance administrative density on desktop with ergonomic accessibility on mobile, primary actions (Edit, Modify, Settings) follow a dual-placement strategy.

### Desktop Placement (Standard Header)
- **Position**: Top-right corner of the section container or card.
- **Style**: Compact `variant='outline'` or `variant='ghost'`.
- **Reasoning**: Maintains the "Linear" / "GitHub" aesthetic where headers act as control bars for the content below.

### Mobile Placement (Bottom Thumb-Reach)
- **Position**: Anchored to the **bottom** of the section content.
- **Style**: Full-width (`w-full`) buttons with `h-10` to `h-12` heights.
- **Reasoning**: Optimizes for single-handed "Thumb-Reach" ergonomics. Placing primary destructive or high-engagement actions at the top-right of long detail pages is a friction point on mobile.

## 5. Mobile Floating Triggers (Extended FAB)
For primary creation actions (e.g., "Add Service", "New Appointment") on mobile, use an **Extended Floating Action Button (FAB)**.

- **Position**: Fixed `bottom-6 right-6`.
- **Sizing**: Compact `h-11` with `px-5` horizontal padding.
- **Corner Radius**: `rounded-xl` (Consistent with the module's container standard).
- **Typography**: `text-[10px] font-black uppercase tracking-widest` for high-fidelity clarity.
- **Layering**: Set to `z-30` to ensure it correctly hides behind the mobile sidebar (`z-50`) when opened.
- **Feedback**: Apply `active:scale-95` and shadow transitions for tactile response.

## 6. Adaptive Grid Layouts (Dynamic Column Toggling)
For primary registries (Doctors, Services), the grid density must respond directly to the Sidebar's visibility state to prevent horizontal stretching or overcrowding.

- **State: Sidebar Expanded/Hovered**:
  - Layout: `lg:grid-cols-2`.
  - Reasoning: Maximizes clarity and detail for complex entity cards when available horizontal space is reduced.
- **State: Sidebar Collapsed**:
  - Layout: `lg:grid-cols-3`.
  - Reasoning: Optimizes information density when horizontal space is maximized.
- **Implementation**: Sync grid configuration with `useSidebar` context to ensure instantaneous layout transitions.

---
*Note: This layout strategy ensures total design parity across all management modules.*
