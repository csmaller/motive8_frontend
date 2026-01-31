# Design Document

## Overview

The triathlon team website is a modern React 18+ application built with Vite and TypeScript, featuring five core pages with mobile-responsive design. The application uses Tailwind CSS for styling, React Router for navigation, and React Hook Form for form handling. The design emphasizes clean, athletic aesthetics while providing excellent user experience across all devices.

## Architecture

### Technology Stack

**Frontend Framework:**
- React 18+ with hooks and functional components
- TypeScript for type safety and better developer experience
- Vite as build tool and development server

**Styling and UI:**
- Tailwind CSS for utility-first styling approach
- Mobile-first responsive design principles
- Athletic/sports theme with clean aesthetics

**Routing and State:**
- React Router v6 for client-side routing and navigation
- React Context for minimal global state (theme, navigation state)
- Local component state using useState and useReducer hooks

**Form Handling:**
- React Hook Form for form validation and submission
- Built-in validation with custom error messages
- TypeScript integration for type-safe form handling

### Application Structure

```
src/
├── components/
│   ├── common/           # Shared components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Footer.tsx    # Site footer
│   │   └── Layout.tsx    # Page layout wrapper
│   └── ui/               # Reusable UI components
│       ├── Button.tsx    # Styled button component
│       ├── Input.tsx     # Form input component
│       └── Card.tsx      # Content card component
├── pages/                # Page components
│   ├── Home/            # Landing page
│   ├── Coaches/         # Coaches information
│   ├── Contact/         # Contact form and info
│   ├── Events/          # Events listings
│   └── VelocityClasses/ # Class registration
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── styles/              # Global styles
```

## Components and Interfaces

### Core Components

**Layout Component:**
- Provides consistent page structure with header and footer
- Manages responsive breakpoints and container sizing
- Handles global navigation state and mobile menu toggle

**Navigation Header:**
- Responsive navigation with mobile hamburger menu
- Active page highlighting using React Router location
- Smooth transitions and hover effects using Tailwind

**Page Components:**
- Each page implemented as functional component with TypeScript
- Consistent props interface for page metadata and content
- Responsive layouts using Tailwind's grid and flexbox utilities

### Form Components

**Contact Form Interface:**
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}
```

**Registration Form Interface:**
```typescript
interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  classPreference: string;
}
```

## Data Models

### Page Content Model

```typescript
interface PageContent {
  title: string;
  description: string;
  image?: string;
  content: React.ReactNode;
}
```

### Coach Profile Model

```typescript
interface Coach {
  id: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  image?: string;
  certifications: string[];
}
```

### Event Model

```typescript
interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  type: 'race' | 'training' | 'social';
  registrationRequired: boolean;
}
```

### Velocity Class Model

```typescript
interface VelocityClass {
  id: string;
  name: string;
  description: string;
  schedule: string;
  duration: string;
  maxParticipants: number;
  currentEnrollment: number;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}
```

## Routing Architecture

### Route Configuration

```typescript
interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  description: string;
}

const routes: RouteConfig[] = [
  { path: '/', component: Home, title: 'Home', description: 'Team overview' },
  { path: '/coaches', component: Coaches, title: 'Coaches', description: 'Meet our staff' },
  { path: '/contact', component: Contact, title: 'Contact', description: 'Get in touch' },
  { path: '/events', component: Events, title: 'Events', description: 'Upcoming activities' },
  { path: '/velocity-classes', component: VelocityClasses, title: 'Velocity Classes', description: 'Cycling training' }
];
```

### Navigation State Management

```typescript
interface NavigationState {
  isMenuOpen: boolean;
  currentPath: string;
}

const NavigationContext = createContext<{
  state: NavigationState;
  toggleMenu: () => void;
  closeMenu: () => void;
}>({} as any);
```

## Responsive Design Strategy

### Breakpoint System (Tailwind CSS)

- **Mobile**: `sm` (640px+) - Single column layouts, stacked navigation
- **Tablet**: `md` (768px+) - Two-column layouts, horizontal navigation
- **Desktop**: `lg` (1024px+) - Multi-column layouts, full navigation
- **Large Desktop**: `xl` (1280px+) - Maximum width containers

### Mobile-First Approach

1. **Base styles**: Mobile-optimized by default
2. **Progressive enhancement**: Add complexity at larger breakpoints
3. **Touch-friendly**: Minimum 44px touch targets
4. **Performance**: Optimized images and lazy loading

## Styling Architecture

### Tailwind CSS Configuration

```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        athletic: {
          orange: '#f97316',
          blue: '#0ea5e9',
          green: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

### Component Styling Patterns

- **Utility-first**: Primary styling through Tailwind utilities
- **Component variants**: Consistent button, card, and form styles
- **Responsive utilities**: Mobile-first responsive classes
- **Custom components**: Reusable styled components for complex elements

## Form Handling Architecture

### React Hook Form Integration

```typescript
// Form validation schema
const contactFormSchema = {
  name: { required: 'Name is required', minLength: { value: 2, message: 'Name too short' } },
  email: { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } },
  message: { required: 'Message is required', minLength: { value: 10, message: 'Message too short' } }
};

// Form submission handler
const handleSubmit = async (data: ContactFormData) => {
  try {
    // Process form submission
    console.log('Form submitted:', data);
    // Show success message
  } catch (error) {
    // Handle submission error
  }
};
```

### Form State Management

- **Validation**: Real-time validation with React Hook Form
- **Error handling**: Clear, specific error messages
- **Loading states**: Visual feedback during form submission
- **Success feedback**: Confirmation messages after successful submission

## Image and Asset Management

### Asset Organization

```
assets/img/
├── main.png        # Home page hero image
├── coaches.png     # Coaches page header
├── contact.png     # Contact page visual
├── classes.png     # General classes imagery
└── velocity.png    # Velocity classes specific
```

### Image Optimization Strategy

- **Responsive images**: Multiple sizes for different breakpoints
- **Lazy loading**: Images load as they enter viewport
- **WebP format**: Modern format with fallbacks for older browsers
- **Alt text**: Descriptive alternative text for accessibility

## Performance Considerations

### Vite Optimization Features

- **Hot Module Replacement**: Fast development experience
- **Tree shaking**: Remove unused code from bundles
- **Code splitting**: Automatic route-based code splitting
- **Asset optimization**: Automatic image and CSS optimization

### Loading Strategy

- **Critical CSS**: Inline critical styles for faster initial render
- **Lazy loading**: Components and images load on demand
- **Preloading**: Prefetch likely next pages
- **Caching**: Appropriate cache headers for static assets

## Error Handling Strategy

### Form Error Handling

```typescript
interface FormError {
  field: string;
  message: string;
  type: 'required' | 'pattern' | 'minLength' | 'custom';
}

const ErrorMessage: React.FC<{ error?: FormError }> = ({ error }) => {
  if (!error) return null;
  return <span className="text-red-500 text-sm">{error.message}</span>;
};
```

### Global Error Boundaries

- **Page-level**: Catch and display page-specific errors
- **Form-level**: Handle form submission and validation errors
- **Network-level**: Handle API communication errors
- **Fallback UI**: Graceful degradation for error states
## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Navigation Consistency and Functionality
*For any* page in the website, the navigation component should be present, contain all five required pages (Home, Coaches, Contact, Events, Velocity Classes), highlight the current active page, and provide smooth client-side routing without page refreshes when navigation links are clicked.
**Validates: Requirements 1.1, 1.2, 1.3, 1.5**

### Property 2: Responsive Layout Adaptation
*For any* page and any viewport size (mobile, tablet, desktop), the layout should adapt appropriately to the screen size, maintain full functionality, and provide touch-friendly interactions on mobile devices.
**Validates: Requirements 1.4, 3.5, 5.4, 7.2, 7.3, 7.4, 7.5**

### Property 3: Content Display Completeness
*For any* content collection (coaches, events, velocity classes), when data is provided, all items should be displayed with their required information fields (name, description, relevant details) in an organized format.
**Validates: Requirements 3.1, 3.2, 5.1, 5.2, 6.1**

### Property 4: Form Validation Behavior
*For any* form (contact or registration), when invalid data is submitted, the form should prevent submission, display specific error messages for each invalid field, and preserve user input during validation.
**Validates: Requirements 4.4, 6.4, 9.2, 9.4, 9.5**

### Property 5: Form Submission Success Flow
*For any* form (contact or registration), when valid data is submitted, the form should process the submission, call the appropriate handler, and provide clear confirmation feedback to the user.
**Validates: Requirements 4.3, 4.6, 6.3, 6.6, 9.3**

### Property 6: Asset Integration Correctness
*For any* page, the designated image assets should be correctly referenced and loaded from the assets/img/ folder (main.png for Home, coaches.png for Coaches, contact.png for Contact, velocity.png and classes.png for Velocity Classes).
**Validates: Requirements 2.3, 3.3, 4.5, 6.5, 8.3**

### Property 7: Visual Consistency Across Pages
*For any* page, consistent styling patterns, color schemes, typography, and component designs should be applied using Tailwind CSS classes to maintain visual coherence throughout the website.
**Validates: Requirements 8.2, 8.4**

### Property 8: Event Chronological Organization
*For any* collection of events with different dates, the events should be displayed in chronological order (earliest to latest) to provide clear temporal organization.
**Validates: Requirements 5.3**

### Property 9: Loading State Feedback
*For any* form submission, appropriate loading indicators should be displayed during the submission process to provide user feedback about the current state.
**Validates: Requirements 10.4**

## Error Handling

### Form Error Management

The application implements comprehensive error handling for all user interactions:

**Validation Errors:**
- Real-time field validation using React Hook Form
- Clear, specific error messages for each validation rule
- Visual indicators (red borders, error icons) for invalid fields
- Preservation of user input during validation cycles

**Submission Errors:**
- Network error handling for form submissions
- Timeout handling for slow connections
- Retry mechanisms for failed submissions
- Clear error messages for different failure scenarios

**Global Error Boundaries:**
- Page-level error boundaries to catch component errors
- Fallback UI components for graceful error display
- Error logging for debugging and monitoring
- Recovery mechanisms where possible

### Navigation Error Handling

**Route Protection:**
- 404 error pages for invalid routes
- Graceful fallbacks for missing page content
- Redirect handling for deprecated or moved pages

**State Management Errors:**
- Context provider error boundaries
- Default state fallbacks for corrupted data
- Local storage error handling

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples and edge cases for individual components
- Integration testing for form submissions and navigation
- Mock data testing for content display components
- Error condition testing for form validation
- Accessibility testing for keyboard navigation and screen readers

**Property-Based Tests:**
- Universal properties verified across randomized inputs
- Minimum 100 iterations per property test for thorough coverage
- Each property test references its corresponding design document property
- Comprehensive input generation for forms, navigation, and responsive behavior

### Property-Based Testing Configuration

**Testing Library:** React Testing Library with @fast-check/jest for property-based testing
**Test Configuration:**
- Minimum 100 iterations per property test
- Custom generators for form data, viewport sizes, and content collections
- Each test tagged with format: **Feature: triathlon-team-website, Property {number}: {property_text}**

**Property Test Implementation:**
- Property 1: Generate random navigation states and verify consistency
- Property 2: Generate random viewport sizes and verify responsive behavior
- Property 3: Generate random content collections and verify complete display
- Property 4: Generate invalid form data and verify validation behavior
- Property 5: Generate valid form data and verify submission flow
- Property 6: Verify all pages reference correct image assets
- Property 7: Verify consistent styling across all page components
- Property 8: Generate random event collections and verify chronological sorting
- Property 9: Verify loading states during form submission processes

### Unit Testing Focus Areas

**Component Testing:**
- Individual page component rendering with mock data
- Form component behavior with various input scenarios
- Navigation component state management and routing
- Responsive component behavior at specific breakpoints

**Integration Testing:**
- End-to-end form submission workflows
- Navigation flow between all pages
- Image loading and asset management
- Error boundary behavior and recovery

**Accessibility Testing:**
- Keyboard navigation functionality
- Screen reader compatibility
- ARIA label and role verification
- Color contrast and visual accessibility

### Testing Tools and Setup

**Primary Testing Stack:**
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@fast-check/jest**: Property-based testing framework
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Additional DOM matchers

**Mock and Fixture Management:**
- Mock data generators for coaches, events, and classes
- Viewport size fixtures for responsive testing
- Form data fixtures for validation testing
- Image asset mocks for testing asset integration

This comprehensive testing approach ensures both specific functionality and general correctness properties are validated, providing confidence in the application's reliability and user experience.