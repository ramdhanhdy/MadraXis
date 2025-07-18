# Financial Management System Implementation Plan

## Phase 1: Database Foundation (Day 1)

- [ ] **1.1 Execute Database Migration**
  - Run migration SQL from `migration-plan.md` to create financial tables
  - Verify table creation with validation queries
  - Test RLS policies with management role access
  - Insert default expense categories for existing schools
  - _Requirements: FR-6 (secure integration)_
  - _Deliverable: Shell + sheet scaffold, sheet opens < 500ms on Moto G_

- [ ] **1.2 Backend Services Foundation**
  - Create `src/services/finance.ts` with CRUD operations
  - Implement `get_budget_health()` and `get_finance_dashboard_summary()` functions
  - Add optimistic update support with React Query integration
  - Test offline queueing with AsyncStorage fallback
  - _Requirements: FR-1, FR-2 (data operations with optimistic updates)_

## Phase 2: Core Finance Hub UI (Day 2)

- [ ] **2.1 Finance Hub Main Screen**
  - Create `app/(management)/finance/index.tsx` with single-screen structure
  - Implement search bar + filter chips (Today/Yesterday/This Week/Category)
  - Add recent expenses list (latest 3) with swipe-left duplicate action
  - Create floating action button (FAB) positioned 16dp above bottom nav
  - _Requirements: FR-3, FR-4 (budget health display, search/filter)_

- [ ] **2.2 Radial Progress Ring Component**
  - Create `components/ProgressRing.tsx` with animated radial progress
  - Implement color rules: Green > 20%, Amber 5-20%, Red ≤ 5% (with pulse)
  - Add micro-copy display: "$60 left • 9 days to Aug"
  - Test animation performance at 60fps with 20 dummy expenses
  - _Requirements: FR-3 (budget health visualization)_
  - _Deliverable: Insert path + ring animation, 20 dummy expenses at 60fps_

## Phase 3: Bottom Sheet Modals (Day 3)

- [ ] **3.1 Log Expense Bottom Sheet**
  - Create bottom-sheet modal with "Log Expense" as default tab
  - Implement zero-scroll form fitting 5.5" screen with keyboard open
  - Add smart category selection (ML on description after 3 characters)
  - Implement clipboard auto-detect for amount field
  - Add swipeable date chips (Today/Yesterday/Calendar)
  - Include collapsible camera section with auto-compress ≤ 500KB
  - _Requirements: FR-1 (expense logging in < 30s)_

- [ ] **3.2 Budget Adjust Bottom Sheet**
  - Create second tab "Adjust Budget" in same modal
  - Implement category list with current limit and spent-to-date
  - Add slider controls (-10%/+10%) with numeric input fallback
  - Enable immediate persistence with live progress ring updates
  - Add archive/un-archive toggle per category
  - _Requirements: FR-2 (quick budget adjustments)_

- [ ] **3.3 Optimistic Updates & Offline Support**
  - Implement optimistic UI updates within 200ms of submission
  - Add offline write queueing to AsyncStorage
  - Create sync banner showing "X expenses pending sync"
  - Test airplane-mode functionality with auto-sync on reconnect
  - _Requirements: FR-1 (optimistic submission)_
  - _Deliverable: Offline + quick-adjust, airplane-mode test passes_

## Phase 4: Polish & Integration (Day 4)

- [ ] **4.1 Empty & Loading States**
  - Create empty state illustration + "Log your first expense to light up the dashboard"
  - Implement skeleton loading that mirrors exact layout (800ms shimmer)
  - Add loading states for live search/filter results
  - Test layout shift prevention
  - _Requirements: FR-5 (guided empty/loading states)_

- [ ] **4.2 Gesture & Accessibility**
  - Implement swipe-left on expense rows for "Duplicate" chip
  - Ensure all touch targets ≥ 48×48dp
  - Test Dynamic Type scaling up to 200%
  - Verify FAB thumb reach positioning
  - _Requirements: FR-3 (gesture interactions)_

- [ ] **4.3 Management Dashboard Integration**
  - Update `app/(management)/dashboard.tsx` with finance summary cards
  - Add navigation to Finance Hub with deep-link support
  - Implement route: `/management/finance`
  - Add deep-link: `madx://schools/:id/finance?open=addExpense`
  - _Requirements: FR-6 (consistent integration)_

- [ ] **4.4 Error Handling & Validation**
  - Implement global ErrorBoundary with "Something went wrong – please try again"
  - Add inline validation for amount > 0 with immediate feedback
  - Test all error scenarios and edge cases
  - Verify design system token usage (buttons, cards, typography)
  - _Requirements: FR-6 (secure, consistent integration)_
  - _Deliverable: 5-user hallway test, SUS ≥ 85, task ≤ 45s_

## Dependencies & Assets

- [ ] **Install Required Packages**
  - `moti` for ring & sheet transitions
  - `react-native-reanimated` for smooth animations
  - `@react-native-async-storage/async-storage` for offline support
  - `react-query` for optimistic updates and caching

- [ ] **Design Assets**
  - Icons: `wallet-plus`, `trending-up`, `camera-outline`
  - Empty state illustration (wallet)
  - Ensure all assets follow design system guidelines

## Testing & Validation

- [ ] **Performance Testing**
  - Sheet opens < 500ms on Moto G (Day 1 milestone)
  - 60fps animation with 20 dummy expenses (Day 2 milestone)
  - Optimistic updates within 200ms (Day 3 milestone)
  - Task completion ≤ 45s (Day 4 milestone)

- [ ] **User Acceptance Testing**
  - 5-user hallway testing with SUS ≥ 85 target
  - Test expense logging in < 30s between classes
  - Verify one-handed operation on mobile devices
  - Validate offline/online sync scenarios

## Documentation

- [ ] **Implementation Documentation**
  - Update migration-guide.md with step-by-step integration
  - Add usage docs in the spec folder
  - Document component API and props
  - Create troubleshooting guide for common issues
  - _Requirements: FR-6 (developer guidance)_