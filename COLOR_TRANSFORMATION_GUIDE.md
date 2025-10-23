# Color Transformation Guide

## Dark Theme → Light Theme + Charcoal Accents

### Color Mapping:
- **rose-500/pink-500/fuchsia-500** → **gray-700/gray-800** (charcoal)
- **rose-400/pink-400/fuchsia-400** → **gray-600/gray-700** (charcoal)
- **rose-300/pink-300/fuchsia-300** → **gray-500/gray-600** (charcoal)
- **rose-200/pink-200/fuchsia-200** → **gray-400/gray-500** (charcoal)
- **rose-100/pink-100/fuchsia-100** → **gray-200/gray-300** (charcoal)
- **rose-50/pink-50/fuchsia-50** → **gray-100/gray-50** (charcoal)
- **rose-900/pink-900/fuchsia-900** → **gray-900/gray-800** (charcoal)

### Background Changes:
- **bg-neutral-900/bg-gray-900** → **bg-white**
- **bg-gray-800/40** → **bg-gray-50**
- **text-neutral-200/text-gray-200** → **text-gray-900**
- **border-gray-700** → **border-gray-300**

### Gradient Changes:
- **from-rose-500 via-pink-500 to-fuchsia-500** → **from-gray-700 via-gray-800 to-gray-900**
- **from-rose-500/20 via-pink-500/20 to-fuchsia-500/20** → **from-gray-100 via-gray-50 to-gray-100**

### Shadow Changes:
- **shadow-rose-500/30** → **shadow-gray-700/30**
- **shadow-rose-500/50** → **shadow-gray-700/50**

## Implementation Strategy:
1. Update global styles (index.css) ✓
2. Update core layout components (StepLayout, ServiceModeSelection, BrideServiceSelection) ✓
3. Update remaining service selection components
4. Update addon/breakdown components
5. Update payment and summary components
6. Replace headings with logo
7. Optimize mobile layout
8. Convert blocky options to list-style

## Files to Update (Priority Order):
- src/index.css ✓
- src/components/StepLayout.jsx ✓
- src/components/ServiceModeSelection.jsx ✓
- src/components/BrideServiceSelection.jsx ✓
- src/components/RegionSelection.jsx
- src/components/ServiceTypeSelection.jsx
- src/components/BrideAddons.jsx
- src/components/BridalParty.jsx
- src/components/NonBridalServiceSelection.jsx
- src/components/NonBridalBreakdown.jsx
- src/components/SemiBridalServiceSelection.jsx
- src/components/SemiBridalAddons.jsx
- src/components/SemiBridalParty.jsx
- src/components/ClientDetails.jsx
- src/components/EventDetailsStep.jsx
- src/components/PaymentStep.jsx
- src/components/BookingHeader.jsx
- And all other components...
