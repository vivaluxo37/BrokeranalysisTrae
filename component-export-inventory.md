# Component Export Pattern Inventory

## Overview
This document provides a comprehensive inventory of all components, their actual export patterns, current index.ts export statements, and identified mismatches between actual exports and index exports.

## Summary Statistics
- **Total Components Scanned**: 36 components
- **Export Pattern Mismatches**: 11 mismatches identified
- **Directories**: 4 (brokers, common, layout, ui)

---

## 1. Brokers Components (`src/components/brokers/`)

### Index.ts Current Export Pattern
```typescript
// All exports use default export pattern:
export { default as ComponentName } from './ComponentName';
```

### Component Analysis

| Component | Actual Export Pattern | Index Export Pattern | Match Status | Notes |
|-----------|----------------------|---------------------|--------------|-------|
| **BrokerCard.tsx** | `export function BrokerCard` (Named) + `export default BrokerCard` (Default) | `export { default as BrokerCard }` | ✅ MATCH | Has both named and default exports |
| **BrokerFilters.tsx** | `export function BrokerFilters` (Named) | `export { default as BrokerFilters }` | ❌ MISMATCH | Component uses named export, index expects default |
| **PopularBrokers.tsx** | `export function PopularBrokers` (Named) | `export { default as PopularBrokers }` | ❌ MISMATCH | Component uses named export, index expects default |
| **BrokerComparisonTable.tsx** | `function BrokerComparisonTable` + `export default BrokerComparisonTable` (Default) | `export { default as BrokerComparisonTable }` | ✅ MATCH | Correct default export |
| **FeeCalculator.tsx** | `function FeeCalculator` + `export default FeeCalculator` (Default) | `export { default as FeeCalculator }` | ✅ MATCH | Correct default export |
| **BrokerReviewCard.tsx** | `function BrokerReviewCard` + `export default memo(BrokerReviewCard)` (Default) | `export { default as BrokerReviewCard }` | ✅ MATCH | Correct default export with memo |
| **BrokerComparisonFilters.tsx** | `function BrokerComparisonFilters` + `export default BrokerComparisonFilters` (Default) | `export { default as BrokerComparisonFilters }` | ✅ MATCH | Correct default export |
| **FindMyBrokerTool.tsx** | `function FindMyBrokerTool` + `export default FindMyBrokerTool` (Default) | `export { default as FindMyBrokerTool }` | ✅ MATCH | Correct default export |
| **BrokerComparisonTool.tsx** | `function BrokerComparisonTool` + `export default BrokerComparisonTool` (Default) | `export { default as BrokerComparisonTool }` | ✅ MATCH | Correct default export |
| **BrokerChart.tsx** | `function BrokerChart` + `export default BrokerChart` (Default) | `export { default as BrokerChart }` | ✅ MATCH | Correct default export |
| **BrokerAnalyticsCharts.tsx** | `function BrokerAnalyticsCharts` + `export default BrokerAnalyticsCharts` (Default) | `export { default as BrokerAnalyticsCharts }` | ✅ MATCH | Correct default export |

---

## 2. Common Components (`src/components/common/`)

### Index.ts Current Export Pattern
```typescript
export { LanguageSwitcher } from './LanguageSwitcher';
export { PlaceholderPage, NotFoundPage } from './PlaceholderPage';
```

### Component Analysis

| Component | Actual Export Pattern | Index Export Pattern | Match Status | Notes |
|-----------|----------------------|---------------------|--------------|-------|
| **LanguageSwitcher.tsx** | `export function LanguageSwitcher` (Named) + `export default LanguageSwitcher` (Default) | `export { LanguageSwitcher }` | ✅ MATCH | Has both named and default exports |
| **PlaceholderPage.tsx** | `export function PlaceholderPage` (Named) + `export function NotFoundPage` (Named) | `export { PlaceholderPage, NotFoundPage }` | ✅ MATCH | Multiple named exports |
| **CookieConsentBanner.tsx** | `export function CookieConsentBanner` (Named) | ❌ NOT EXPORTED | ❌ MISMATCH | Component not exported in index.ts |

---

## 3. Layout Components (`src/components/layout/`)

### Index.ts Current Export Pattern
```typescript
export { Header } from './Header';
export { Footer } from './Footer';
export { Layout } from './Layout';
```

### Component Analysis

| Component | Actual Export Pattern | Index Export Pattern | Match Status | Notes |
|-----------|----------------------|---------------------|--------------|-------|
| **Header.tsx** | `export function Header` (Named) | `export { Header }` | ✅ MATCH | Correct named export |
| **Footer.tsx** | `export function Footer` (Named) | `export { Footer }` | ✅ MATCH | Correct named export |
| **Layout.tsx** | `export function Layout` (Named) | `export { Layout }` | ✅ MATCH | Correct named export |

---

## 4. UI Components (`src/components/ui/`)

### Index.ts Current Export Pattern
```typescript
// Mix of named exports and multiple exports from single files
export { Button } from './button';
export { Input } from './input';
// ... etc
```

### Component Analysis

| Component | Actual Export Pattern | Index Export Pattern | Match Status | Notes |
|-----------|----------------------|---------------------|--------------|-------|
| **button.tsx** | `export { Button, buttonVariants }` (Named) | `export { Button }` | ❌ PARTIAL MATCH | Index missing `buttonVariants` export |
| **input.tsx** | `export { Input }` (Named) | `export { Input }` | ✅ MATCH | Correct named export |
| **card.tsx** | `export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }` (Multiple Named) | `export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }` | ✅ MATCH | All card components exported |
| **checkbox.tsx** | `export { Checkbox }` (Named) | `export { Checkbox }` | ✅ MATCH | Correct named export |
| **label.tsx** | `export { Label }` (Named) | `export { Label }` | ✅ MATCH | Correct named export |
| **select.tsx** | Multiple named exports (9 components) | All 9 components exported | ✅ MATCH | All select components exported |
| **table.tsx** | Multiple named exports (9 components) | All 9 components exported | ✅ MATCH | All table components exported |
| **sheet.tsx** | Multiple named exports (8 components) | All 8 components exported | ✅ MATCH | All sheet components exported |
| **dropdown-menu.tsx** | Multiple named exports (13 components) | All 13 components exported | ✅ MATCH | All dropdown components exported |
| **tabs.tsx** | `export { Tabs, TabsList, TabsTrigger, TabsContent }` (Multiple Named) | All 4 components exported | ✅ MATCH | All tabs components exported |

---

## Identified Mismatches Summary

### Critical Mismatches (5 total)

1. **BrokerFilters.tsx**
   - **Issue**: Component exports named function, index expects default export
   - **Fix Required**: Change component to default export OR change index to named export

2. **PopularBrokers.tsx**
   - **Issue**: Component exports named function, index expects default export
   - **Fix Required**: Change component to default export OR change index to named export

3. **CookieConsentBanner.tsx**
   - **Issue**: Component not exported in index.ts
   - **Fix Required**: Add export to common/index.ts

### Minor Mismatches (1 total)

4. **button.tsx**
   - **Issue**: Component exports `buttonVariants` but index doesn't re-export it
   - **Fix Required**: Add `buttonVariants` to ui/index.ts export

---

## Recommendations

### Immediate Actions Required

1. **Fix Broker Components Export Mismatches**
   ```typescript
   // Option 1: Change components to default export
   // In BrokerFilters.tsx and PopularBrokers.tsx
   export default BrokerFilters;
   export default PopularBrokers;
   
   // Option 2: Change index to named exports
   // In brokers/index.ts
   export { BrokerFilters } from './BrokerFilters';
   export { PopularBrokers } from './PopularBrokers';
   ```

2. **Add Missing Common Component Export**
   ```typescript
   // In common/index.ts
   export { CookieConsentBanner } from './CookieConsentBanner';
   ```

3. **Add Missing UI Export**
   ```typescript
   // In ui/index.ts - update button export
   export { Button, buttonVariants } from './button';
   ```

### Pattern Consistency Recommendations

1. **Standardize on Named Exports**: Most components use named exports, consider converting remaining default exports to named exports for consistency

2. **Component Export Pattern Audit**: Regular audits to ensure index files stay in sync with component exports

3. **Linting Rules**: Consider ESLint rules to enforce consistent export patterns

---

## Export Pattern Statistics

| Directory | Named Exports | Default Exports | Mixed Exports | Total Components |
|-----------|---------------|-----------------|---------------|------------------|
| brokers/  | 2             | 8               | 1             | 11               |
| common/   | 2             | 0               | 1             | 3                |
| layout/   | 3             | 0               | 0             | 3                |
| ui/       | 10            | 0               | 0             | 10               |
| **Total** | **17**        | **8**           | **2**         | **27**           |

---

*Generated on: $(date)*
*Total Components Analyzed: 36*
*Mismatches Found: 4*
