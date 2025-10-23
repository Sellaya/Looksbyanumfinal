# Theme Transformation Implementation Guide

## Quick Start

### Option 1: Automated Find & Replace (Recommended)
1. Open your code editor (VS Code, etc.)
2. Press `Ctrl+H` (Windows/Linux) or `Cmd+H` (Mac) to open Find & Replace
3. Enable "Use Regular Expression" option
4. Follow the replacements in `FIND_REPLACE_REFERENCE.txt` in order
5. Test each major replacement before moving to the next

### Option 2: Manual Component Updates
If you prefer to update components manually, start with these high-impact files:
1. `src/index.css` - Already updated ✓
2. `src/components/StepLayout.jsx` - Already updated ✓
3. `src/components/ServiceModeSelection.jsx` - Already updated ✓
4. `src/components/BrideServiceSelection.jsx` - Already updated ✓
5. `src/components/BookingHeader.jsx` - Update next
6. `src/components/RegionSelection.jsx` - Update next
7. Continue with remaining components...

## Key Changes Made So Far

### 1. Global Styles (src/index.css)
- Changed from dark theme to light theme
- Updated form elements to light backgrounds
- Changed button colors to charcoal

### 2. StepLayout Component
- Background: dark → white
- Text: light gray → dark gray
- Buttons: orange → charcoal

### 3. ServiceModeSelection Component
- All rose/pink/fuchsia → charcoal gradients
- Dark backgrounds → light backgrounds
- Maintained hover effects and animations

### 4. BrideServiceSelection Component
- Same theme transformation as ServiceModeSelection
- Light theme with charcoal accents
- Preserved all functionality

## Remaining Tasks

### Phase 1: Core Components (High Priority)
- [ ] BookingHeader.jsx
- [ ] RegionSelection.jsx
- [ ] ServiceTypeSelection.jsx
- [ ] ClientDetails.jsx
- [ ] EventDetailsStep.jsx

### Phase 2: Service Selection Components
- [ ] BrideAddons.jsx
- [ ] BridalParty.jsx
- [ ] SemiBridalServiceSelection.jsx
- [ ] SemiBridalAddons.jsx
- [ ] SemiBridalParty.jsx
- [ ] NonBridalServiceSelection.jsx
- [ ] NonBridalBreakdown.jsx

### Phase 3: Payment & Summary
- [ ] PaymentStep.jsx
- [ ] PaymentSuccess.jsx
- [ ] QuoteReview.jsx
- [ ] ContractReview.jsx
- [ ] ArtistSelection.jsx
- [ ] PostBookingArtistSelection.jsx

### Phase 4: Utility Components
- [ ] DatePicker.jsx
- [ ] TimeSelection.jsx
- [ ] AddressDetails.jsx
- [ ] ServiceDetails.jsx
- [ ] PackageSelection.jsx
- [ ] And all other components...

## Mobile Optimization (Requirement #3)

### Current Approach:
- Reduce padding on mobile: `p-4 md:p-6 lg:p-8` → `p-2 md:p-4 lg:p-6`
- Reduce gaps: `gap-5` → `gap-3`
- Reduce margins: `mb-14` → `mb-8 md:mb-14`
- Reduce font sizes on mobile where appropriate

### Implementation:
Search for these patterns and adjust:
\`\`\`
Find: py-8 sm:py-12
Replace: py-4 sm:py-8

Find: px-4 py-8
Replace: px-3 py-4

Find: mb-14
Replace: mb-8 md:mb-14

Find: gap-5
Replace: gap-3 md:gap-5
\`\`\`

## Logo Replacement (Requirement #4)

### Current Headings to Replace:
All `<h2>` tags with text like:
- "Choose Your Service"
- "Bridal Service Details"
- "Service Type"
- etc.

### Replacement Pattern:
\`\`\`jsx
// OLD:
<h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-4">
  Choose Your Service
  <span className="text-gray-700 ml-2">*</span>
</h2>

// NEW:
<div className="flex items-center justify-center mb-6">
  <img src="/black.png" alt="Looks By Anum" className="h-12 md:h-16 lg:h-20" />
</div>
\`\`\`

## List-Style Options (Requirement #5)

### Current: Blocky Cards
\`\`\`jsx
<div className="p-6 border rounded-xl bg-white">
  <h3>Option Name</h3>
  <p>Description</p>
  <ul>Features</ul>
</div>
\`\`\`

### New: List-Style (Compact)
\`\`\`jsx
<div className="flex items-center p-3 border-b hover:bg-gray-50">
  <input type="radio" className="mr-3" />
  <div className="flex-1">
    <h4>Option Name</h4>
    <p className="text-sm text-gray-600">Description</p>
  </div>
  <span className="text-sm text-gray-500">Features</span>
</div>
\`\`\`

## Testing Checklist

- [ ] Light theme applied throughout
- [ ] Charcoal colors used for accents
- [ ] Hover effects still work
- [ ] Mobile layout optimized (less scrolling)
- [ ] Logo displays correctly
- [ ] Options are compact (list-style)
- [ ] All buttons functional
- [ ] Form inputs accessible
- [ ] Responsive design maintained
- [ ] No broken colors or styling

## Performance Tips

- Use Find & Replace in batches (5-10 replacements at a time)
- Test in browser after each batch
- Keep git commits small for easy rollback
- Use browser DevTools to verify colors
- Test on mobile device or use DevTools mobile view

## Support

If you encounter issues:
1. Check the color mapping in `COLOR_TRANSFORMATION_GUIDE.md`
2. Verify the find-replace pattern in `FIND_REPLACE_REFERENCE.txt`
3. Use browser DevTools to inspect element colors
4. Compare with already-updated components (ServiceModeSelection, BrideServiceSelection)
