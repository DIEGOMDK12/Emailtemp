# TempMail - Temporary Email Web Application

## Overview

TempMail is a fully functional temporary email service web application that allows users to generate disposable email addresses, receive emails in real-time via WebSocket, and manage their temporary inbox. The application provides privacy protection through automatically expiring email addresses (10-minute lifetime) and features a clean, responsive interface optimized for both desktop and mobile use.

## Recent Changes (December 2024)
- Implemented complete backend with API routes for email management
- Added WebSocket support for real-time email notifications
- Connected frontend to backend APIs (removed mock data)
- Fixed timestamp generation to be server-side
- All CRUD operations working: generate address, receive emails, delete emails

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Build Tool**: Vite with HMR support

**Key Frontend Patterns**:
- Components organized by feature (EmailAddress, EmailList, EmailViewer, EmptyState)
- UI components in separate `/components/ui` directory (shadcn pattern)
- Custom hooks for mobile detection and toast notifications
- Real-time updates via WebSocket connection to subscribe to email address changes

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **Real-time Communication**: WebSocket server (ws library) for live email notifications
- **API Design**: RESTful endpoints under `/api` prefix

**Key Backend Patterns**:
- Routes registered in `server/routes.ts` with WebSocket handling
- Storage abstraction via `IStorage` interface in `server/storage.ts`
- In-memory storage implementation (`MemStorage`) for temporary addresses and emails
- Automatic cleanup of expired addresses via interval timer

### Data Layer
- **Schema Validation**: Zod for runtime type validation
- **Database ORM**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **Data Models**:
  - `TempAddress`: Temporary email address with creation and expiration timestamps
  - `Email`: Individual email messages with sender, subject, body (text/HTML), and read status

### Build System
- **Development**: Vite dev server with Express middleware integration
- **Production**: 
  - Client built with Vite to `dist/public`
  - Server bundled with esbuild to `dist/index.cjs`
  - Selective dependency bundling for optimized cold starts

## External Dependencies

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations in `./migrations` directory
- **connect-pg-simple**: Session storage (available but not currently active)

### UI/Component Libraries
- **Radix UI**: Full suite of accessible, unstyled primitives (dialog, dropdown, toast, etc.)
- **shadcn/ui**: Pre-configured component variants using Radix + Tailwind
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component support

### Real-time
- **ws**: WebSocket server for push notifications when new emails arrive
- Clients subscribe to specific email addresses and receive `newEmail` events

### Utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation
- **class-variance-authority**: Component variant management
- **clsx/tailwind-merge**: Conditional class name handling

### Development Tools
- **Vite plugins**: React refresh, runtime error overlay, Replit-specific plugins
- **TypeScript**: Strict mode with path aliases (@/, @shared/, @assets/)