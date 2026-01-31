# Project Structure

## Root Directory Layout
```
/
├── src/                    # Source code
├── public/                 # Static assets served directly
├── assets/                 # Design assets and images
├── dist/                   # Production build output
├── .kiro/                  # Kiro configuration and specs
└── package.json            # Dependencies and scripts
```

## Source Code Organization
```
src/
├── components/             # Reusable UI components
│   ├── common/            # Shared components (Header, Footer, etc.)
│   └── ui/                # Basic UI elements (Button, Input, etc.)
├── pages/                 # Page components
│   ├── Home/              # Main landing page
│   ├── Coaches/           # Coaches page
│   ├── Contact/           # Contact page
│   ├── Events/            # Events page
│   └── VelocityClasses/   # Velocity cycling classes
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── types/                 # TypeScript type definitions
├── styles/                # Global styles and CSS modules
├── assets/                # Images, icons, fonts
├── App.tsx                # Main app component
└── main.tsx               # Application entry point
```

## Component Organization
- Each page should have its own folder with an `index.tsx` file
- Complex components should have their own folder with sub-components
- Keep components small and focused on single responsibility
- Use TypeScript interfaces for all props

## Asset Management
- Images should be optimized for web (WebP format preferred)
- Use the existing `/assets/img/` folder for page-specific images
- Store icons and logos in `/src/assets/icons/`
- Implement lazy loading for images

## Naming Conventions
- **Components**: PascalCase (e.g., `VelocityClasses.tsx`)
- **Files/Folders**: PascalCase for components, camelCase for utilities
- **CSS Classes**: kebab-case (e.g., `velocity-class-card`)
- **Constants**: UPPER_SNAKE_CASE