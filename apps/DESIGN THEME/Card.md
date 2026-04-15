# Component Design: Stat Card

Documentation for the consistent, responsive statistics cards used across the PrimeraDental portals (My Appointments, Notifications, etc.)

## 1. Visual Structure
The card uses a **Horizontal Layout** to emphasize connectivity between the icon and the metric.

```tsx
<div className="card-container">
    <div className="icon-wrapper">
        <Icon size={20} className="dynamic-color" />
    </div>
    <div className="content-stack">
        <span className="value">123</span>
        <span className="title">UPCOMING</span>
    </div>
</div>
```

## 2. Styling Standards

### Card Container
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Border**: `border border-gray-200` / `dark:border-gray-700`
- **Shape**: `rounded-2xl`
- **Shadow**: `shadow-sm` transitioning to `hover:shadow-md`

### Icon Container
- **Background**: Consistent `bg-gray-100` / `dark:bg-gray-700/50`
- **Padding**: `p-2.5`
- **Shape**: `rounded-xl`
- **Icon Color**: Dynamic colors applied directly to the icon (e.g., `text-brand-500`, `text-green-600`, `text-amber-500`).
- **Icon Size**: `size={20}`

### Typography (Fluid & Responsive)
- **Value (Top)**: 
  - Mobile: `text-xl`
  - Desktop: `sm:text-2xl`
  - Weight: `font-bold`
  - Constraints: `truncate`
- **Title (Bottom)**:
  - Mobile: `text-[10px]`
  - Desktop: `sm:text-[11px]`
  - Weight: `font-medium`
  - Case: `uppercase`
  - Spacing: `tracking-wider mt-1`
  - Constraints: `truncate`

## 3. Responsive Behavior

### Mobile Viewports
To prevent text squishing and maintain a premium "dashboard" feel on mobile:
1. **Container**: Use a horizontal scroll wrapper (`flex overflow-x-auto no-scrollbar gap-4 pb-2`).
2. **Card Width**: Fixed width of `155px` on mobile (`flex-shrink-0 w-[155px]`).
3. **Truncation**: Always use `truncate` on text elements within a `min-w-0` flex-column to prevent layout breaks.

### Desktop Viewports
1. **Layout**: Uses `sm:w-auto sm:flex-1` to expand and fill the available grid space.
2. **Alignment**: Items remain centered (`items-center`) with a gap of `gap-3`.

---
*Note: This design ensures that regardless of the metric, the card remains consistent in height and proportions across all portals.*
