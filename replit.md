# Night Rituals Forum - Dark Web Forum Application

## Overview

Night Rituals Forum is a fictional dark-themed interactive forum application with an occult aesthetic combining dark web, Halloween, and supernatural elements. The application functions as a clandestine community platform where users can share horror stories, dark poetry, nightmares, occult content, and urban legends. The platform includes forum discussions, real-time chat, microblogging, user profiles, and a fictional dark market for purchasing cursed items.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom dark theme variables and Shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state and local React state for UI
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **UI Components**: Radix UI primitives through Shadcn/ui for accessible, customizable components

### Backend Architecture
- **Framework**: Express.js with TypeScript for the API server
- **Build System**: Vite for development and Esbuild for production builds
- **Development**: Hot module replacement and runtime error overlay for enhanced DX

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Local Storage**: Browser localStorage for user preferences, chat history, and offline functionality
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

The application uses a hybrid storage approach where critical data is persisted to PostgreSQL while user interface state and temporary data is managed locally for performance.

### Authentication and Authorization
- **User Management**: Local storage-based user profiles with nickname and avatar support
- **Session Handling**: Server-side session management for authenticated requests
- **Profile System**: Simple user profiles stored locally with optional avatar uploads

### Schema Design
The database schema includes:
- **Users**: User profiles with nickname and avatar
- **Posts**: Forum posts with categories (dreams, nightmares, occult, urban-legends, dark-poetry)
- **Comments**: Threaded responses to posts with voting system
- **MicroFeeds**: Short-form content similar to tweets
- **Chat Messages**: Real-time messaging functionality
- **Votes**: User voting system for posts and comments
- **Cart Items**: Dark market shopping cart functionality

### Audio and Interactive Features
- **Web Audio API**: Custom audio manager for atmospheric sound effects
- **Sound Effects**: Procedurally generated sinister audio for purchases and interactions
- **Visual Effects**: CSS-based glitch animations and dark theme transitions

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database driver for Neon
- **drizzle-orm** and **drizzle-kit**: Type-safe ORM and database toolkit
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form** with **@hookform/resolvers**: Form handling and validation
- **zod** and **drizzle-zod**: Runtime type validation and schema validation

### UI and Styling Libraries
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework with custom dark theme
- **class-variance-authority**: Type-safe CSS class variant management
- **clsx**: Conditional CSS class composition utility

### Development and Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React support for Vite
- **esbuild**: Fast JavaScript bundler for production builds
- **typescript**: Static type checking
- **wouter**: Lightweight routing library for React

### Specialized Libraries
- **date-fns**: Date manipulation and formatting
- **embla-carousel-react**: Touch-friendly carousel component
- **cmdk**: Command palette component for enhanced UX
- **connect-pg-simple**: PostgreSQL session store for Express

### Development Environment
- **@replit/vite-plugin-runtime-error-modal**: Enhanced error reporting for Replit
- **@replit/vite-plugin-cartographer**: Development tooling integration