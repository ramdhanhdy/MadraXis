# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Environment Setup

### Prerequisites
- Node.js (LTS version)
- Expo CLI
- Supabase account with credentials
- Bun

### Installation & Environment
```bash
bun install
```

Create `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL="your-supabase-url"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Development Commands

### Core Commands
```bash
bun run start          # Start Expo dev server
bun run android        # Run on Android emulator/device
bun run ios           # Run on iOS simulator/device
bun run web           # Run web version
bun run test          # Run Jest tests in watch mode
bun run lint          # Run ESLint
```

### Testing Commands
```bash
npx run test -- --testNamePattern="Button"    # Run specific test
npx run test -- --watchAll=false               # Run tests once
npx run test -- --coverage                     # Generate coverage report
```

## Architecture Overview

### Tech Stack
- **Frontend**: React Native 0.79.5 + Expo SDK 53
- **Navigation**: Expo Router v5 with file-based routing
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **State**: React Context API (AuthContext, ThemeContext)
- **Testing**: Jest + React Native Testing Library + Storybook
- **Design System**: Atomic Design with role-based themes

### Database Schema

#### Core Tables
- **profiles**: Unified user table (id, full_name, role, school_id)
  - RLS: Enabled and forced for security
  - Constraints: role enum ['management', 'teacher', 'student', 'parent']
- **schools**: School management (id, name, npsn, address, phone, email)
  - Constraints: unique name and npsn

#### Role-Specific Detail Tables
- **student_details**: user_id, nis, date_of_birth, gender, boarding status
- **teacher_details**: user_id, employee_id, hire_date, specialty
- **parent_details**: user_id, phone_number, address, occupation
- **management_details**: user_id, position, hire_date

#### Class Management
- **classes**: id, name, level, description, school_id
- **class_schedules**: id, class_id, day_of_week, start_time, end_time, subject, location
- **class_students**: class_id, student_id (junction table)
- **class_teachers**: class_id, user_id (junction table)

#### Performance Tracking
- **student_performance**: id, user_id, period_start, period_end, academic_score, quran_score, attendance_pct
- **teacher_performance**: id, user_id, period_start, period_end, class_observation, punctuality_score

#### Incident Management
- **incidents**: id, incident_type, description, location, incident_date, status, is_anonymous, reporter_id, student_id, school_id

#### Financial Management
- **expense_categories**: id, name, school_id
- **expenses**: id, category_id, amount, date, description, notes, attachment_url, school_id, created_by
- **budgets**: id, category_id, month, limit_amount, school_id

#### Key Relationships
- All detail tables reference `profiles.id` via foreign key
- All school-scoped tables reference `schools.id` via foreign key
- Class management tables create many-to-many relationships between users and classes
- Financial data fully scoped by school_id for multi-tenancy
- Incident tracking supports both identified and anonymous reporting

#### RLS Policies
- Users can only see their own profile and details
- Teachers can see students in their school
- Cross-school data isolation enforced at database level
- All financial and incident data scoped by school membership

### Project Structure
```
app/                    # Expo Router routes (layouts only)
  (auth)/              # Authentication routes
  (management)/        # Management dashboard
  (parent)/            # Parent dashboard
  (teacher)/           # Teacher dashboard
  (student)/           # Student dashboard

src/                    # Source code
  components/          # Atomic design system
    atoms/             # Basic UI elements
    molecules/         # Combined atoms
    organisms/         # Complex components
    templates/         # Page layouts
  context/             # React Context providers
  services/            # API calls & business logic
  styles/              # Design tokens & theme system
  types/               # TypeScript definitions
  utils/               # Helper functions
```

### Authentication Flow
- **Invite-only system**: Users pre-created by admins
- **Role-based routing**: Automatic navigation to appropriate dashboard
- **Supabase Auth**: Email/password with role metadata
- **Profiles table**: Unified user management across all roles

### Design System
- **Atomic Design**: atoms → molecules → organisms → templates
- **Role-based themes**: Different color schemes per user role
- **Design tokens**: Comprehensive system in `src/styles/`
- **Responsive**: Breakpoint system for different screen sizes

### Key Patterns
- **Expo Router**: File-based routing with groups for role isolation
- **Context API**: Global state management for auth and theme
- **Supabase RLS**: Row-level security for data access
- **Component Composition**: Reusable templates across role dashboards
- **Unified Schema**: All user types use `profiles` table with role-specific detail tables

### Testing Strategy
- **Unit Tests**: Component-level testing with Jest
- **Integration Tests**: Service layer testing
- **Storybook**: Visual testing for design system components
- **Mocking**: Comprehensive mocks for React Native modules
- **Database Tests**: RLS policy testing in `supabase/tests/`

### Migration Guidelines
- Use timestamp-based naming: `YYYYMMDDHHMMSS_description.sql`
- Always test RLS policies with test functions
- Maintain backward compatibility where possible
- Update TypeScript types in `src/types/` to match schema changes

### Database Tools
- **Use Supabase MCP server instead of Supabase CLI for database operations**

## Quick Reference

### Adding New Components
1. Place in appropriate atomic level (atoms/molecules/organisms)
2. Include stories and tests
3. Export from level index file
4. Use design tokens from theme system

### Design System Location
- **design system location**: 'src/styless/'

### Environment Variables
- Prefix with `EXPO_PUBLIC_` for client access
- Access via `Constants.expoConfig?.extra`

### Navigation
- Use Expo Router's `useRouter()` and `useLocalSearchParams()`
- Role-based routing handled in `AuthContext.tsx`
- Protected routes via auth middleware

## Important Notes

- **MadraXis is a mobile app only project that uses Expo and Supabase**
- **Avoid using web tech stack like Next.js - previous implementation of a feature was wrongly using Next.js as routing**
