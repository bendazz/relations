# Relations Learning App

An interactive web application designed to help students learn about mathematical relations in set theory. Features comprehensive visualizations, interactive exercises, and practice problems covering relation representations, composition operations, and Boolean matrix products.

## Features

### Core Learning Modules
- **Relations Representations**: Multiple views of relations (Cartesian plots, set notation, matrices, directed graphs)
- **Boolean Products**: Interactive matrix operations with step-by-step visualization
- **Composition Animation**: Smooth, multi-phase animations showing relation composition
- **Matrix Composition**: Interactive Boolean products with highlighting and path visualization
- **Practice Problems**: 14 comprehensive homework problems with expandable solutions

### Technical Features
- **Modern React + TypeScript**: Built with Vite for fast development and builds
- **Interactive Visualizations**: SVG-based plots and graphs with educational clarity
- **Responsive Design**: Clean, modern UI with Tailwind CSS
- **Smooth Animations**: Educational animations for complex mathematical concepts

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages:

### Automatic Deployment (Recommended)
1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as the source
4. The included workflow will automatically build and deploy on every push to main

### Manual Deployment
1. Install the gh-pages package (already included):
   ```bash
   npm install
   ```

2. Build and deploy:
   ```bash
   npm run deploy
   ```

### Configuration Notes
- The app is configured with `base: '/relations/'` in `vite.config.ts` for GitHub Pages
- Update the base path if your repository has a different name
- The GitHub Actions workflow (`.github/workflows/deploy.yml`) handles automatic deployment

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with navigation
├── pages/              # Individual page components
│   ├── HomePage.tsx         # Landing page with LaTeX-style graph
│   ├── RelationsPage.tsx    # Relation representations
│   ├── BooleanProductsPage.tsx    # Interactive Boolean matrix operations
│   ├── CompositionPage.tsx        # Animated relation composition
│   ├── MatrixCompositionPage.tsx  # Matrix composition with highlighting
│   └── HomeworkPage.tsx          # Practice problems with solutions
├── App.tsx             # Main application with routing
├── main.tsx           # Application entry point
└── index.css          # Global styles with Tailwind
```

## Adding New Learning Topics

To add a new learning topic:

1. Create a new page component in `src/pages/`
2. Add the route to `src/App.tsx`
3. Update the navigation items in `src/components/Layout.tsx`

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety and better development experience
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful icon library

## Contributing

This project is designed to be easily extensible. Each mathematical concept can be implemented as a separate page with its own interactive components and examples.