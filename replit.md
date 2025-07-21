# Catholic Faith Defender App - Replit Guide

## Overview

A comprehensive mobile-first Catholic application providing offline access to essential religious resources through four main sections: Q&A, Prayers, Documents, and Bible. The app features a clean, reverent UI with Catholic aesthetics and full offline functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with Catholic-themed color variables
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Responsive layout with bottom navigation optimized for mobile

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM (DatabaseStorage implementation)
- **Database Provider**: Replit PostgreSQL (configured with environment variables)
- **API Design**: RESTful endpoints for CRUD operations
- **Data Storage**: Migrated from MemStorage to DatabaseStorage for persistent data
- **Build System**: ESBuild for production bundling

### Progressive Web App Features
- **Service Worker**: Custom caching strategy for offline functionality
- **Web App Manifest**: PWA configuration for mobile installation
- **Offline Storage**: IndexedDB for client-side data persistence

## Key Components

### Data Models
The application manages four primary content types:
- **Q&A Questions**: Catholic apologetics with questions, answers, and detailed explanations
- **Prayers**: Traditional Catholic prayers with optional Latin translations
- **Documents**: Church documents (encyclicals, catechism) with metadata
- **Bible Verses**: Scripture references with testament categorization
- **Bookmarks**: User-saved content across all sections

### Content Sections
1. **Q&A Section**: Defensive apologetics with expandable detailed answers
2. **Prayers Section**: Categorized prayer collection with visual icons
3. **Documents Section**: Church teaching documents with article counts
4. **Bible Section**: Scripture access organized by books and testaments

### Navigation System
- **Bottom Navigation**: Four-tab mobile-optimized navigation
- **Search Functionality**: Cross-section search with offline fallback
- **Bookmark System**: Content favoriting with local/server sync

## Data Flow

### Online Mode
1. Client requests data from Express API endpoints
2. Server queries PostgreSQL database via Drizzle ORM
3. Data returned as JSON responses
4. TanStack Query caches responses locally
5. Background sync to IndexedDB for offline access

### Offline Mode
1. Service worker intercepts network requests
2. Failed requests fall back to IndexedDB cache
3. Local bookmark storage in localStorage
4. Search operations performed client-side on cached data
5. Toast notifications inform users of offline status

### Data Synchronization
- Initial app load triggers full data cache population
- Online/offline status detection with user notifications
- Bookmark sync between localStorage and server
- Progressive enhancement from offline to online functionality

## External Dependencies

### Database & ORM
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **drizzle-kit**: Database migrations and schema management

### UI & Styling
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library with Catholic-appropriate symbols

### State & Data Management
- **@tanstack/react-query**: Server state management with caching
- **react-hook-form**: Form validation and management
- **wouter**: Lightweight routing solution

### Development & Build
- **vite**: Development server and build tool
- **typescript**: Type safety and development experience
- **@replit/vite-plugin-runtime-error-modal**: Replit-specific development aids

## Deployment Strategy

### Development Environment
- Vite development server with hot module replacement
- TypeScript compilation for type checking
- Replit-specific plugins for cloud development
- Express server running in development mode

### Production Build
- Vite builds React frontend to `dist/public`
- ESBuild bundles Express server to `dist/index.js`
- Single deployment artifact with embedded static files
- Environment variable configuration for database connection

### Database Management
- Drizzle migrations stored in `./migrations` directory
- Schema definitions in `shared/schema.ts` for type sharing
- PostgreSQL dialect with connection URL configuration
- Production database provisioning via Neon Database

### PWA Deployment
- Service worker registration for offline capabilities
- Web app manifest for mobile installation
- Cache-first strategy for static assets
- Network-first with cache fallback for API requests

The application prioritizes offline functionality and mobile experience while maintaining a reverent, traditional Catholic aesthetic throughout the user interface.