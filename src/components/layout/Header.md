# Header Component

A comprehensive, responsive header component for the BrokerAnalysis application built with React, TypeScript, and Radix UI components.

## Features

### ✅ React Component Architecture

- Built with React hooks and TypeScript
- Uses Radix UI primitives for accessibility
- Fully responsive design with mobile-first approach

### ✅ Navigation Features

- **Logo**: Interactive logo with trending up icon
- **Desktop Navigation**: Horizontal navigation with hover states
- **Dropdown Menus**: Multi-level navigation using Radix UI
- **Mobile Navigation**: Side sheet menu for mobile devices
- **Active Route Indication**: Visual feedback for current page

### ✅ Search Functionality

- **Desktop Search**: Prominent search bar in header
- **Mobile Search**: Integrated search in mobile menu
- **Search Form**: Form submission handling
- **Search Icon**: Visual search indicator

### ✅ User Experience Features

- **Dark/Light Mode Toggle**: System theme switching
- **Language Selector**: Multi-language support (EN, ES, FR)
- **User Menu**: Sign in, create account, help & support
- **Responsive Design**: Adapts to all screen sizes

### ✅ Internationalization (i18n)

- React i18next integration
- Support for English, Spanish, French
- Dynamic language switching
- Accessible labels and text

### ✅ Accessibility

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Component Structure

```tsx
<Header>
  <Logo />
  <SearchBar />
  <DesktopNavigation>
    <NavigationItems />
    <DropdownMenus />
  </DesktopNavigation>
  <DesktopActions>
    <LanguageSelector />
    <ThemeToggle />
    <UserMenu />
    <CTAButton />
  </DesktopActions>
  <MobileMenu>
    <Sheet>
      <SearchBar />
      <NavigationItems />
      <ThemeToggle />
      <CTAButton />
    </Sheet>
  </MobileMenu>
</Header>
```

## Technologies Used

- **React 18**: Component framework
- **TypeScript**: Type safety
- **Radix UI**: Accessible primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Styling
- **React i18next**: Internationalization
- **React Router**: Navigation

## Dark Theme Support

The component includes comprehensive dark theme support with:

- CSS custom properties for theme colors
- Automatic theme detection and switching
- Smooth transitions between themes
- Consistent styling across all states

## Mobile Responsiveness

- **Breakpoints**: md (768px), lg (1024px)
- **Mobile Menu**: Side sheet with full navigation
- **Touch Targets**: Optimized for mobile interaction
- **Viewport Adaptation**: Responsive typography and spacing

## Usage

```tsx
import { Header } from '@/components/layout/Header'

function App() {
  return (
    <div>
      <Header />
      {/* Rest of your app */}
    </div>
  )
}
```

## Dependencies

```json
{
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "lucide-react": "^0.536.0",
  "react-i18next": "^15.6.1",
  "react-router-dom": "^6.26.2"
}
```
