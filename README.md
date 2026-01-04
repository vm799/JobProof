# BoardingPass

White-label client onboarding platform that helps agencies and consultants deliver premium onboarding experiences.

## Features

- Visual flow builder for custom onboarding workflows
- White-label branding (logo, colors, custom domain)
- Client portal with progress tracking
- Automated email reminders
- File uploads and document collection
- Team collaboration
- Real-time analytics and insights
- Pre-built templates for common workflows
- Celebration moments and progress badges

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (Database + Auth + Storage)
- Resend (Email delivery)
- Recharts (Analytics visualizations)
- shadcn/ui (Component library)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Resend account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/boardingpass.git
cd boardingpass
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your Supabase and Resend credentials to `.env.local`

4. Run database migrations

Execute all SQL files in `/scripts` folder in your Supabase SQL editor in order (001 through 009)

5. Start development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/app                 # Next.js app router pages
  /api              # API routes
  /auth             # Authentication pages
  /(marketing)      # Public marketing pages
  /dashboard        # Main dashboard
  /flows            # Flow builder
  /clients          # Client management
  /analytics        # Analytics dashboard
  /settings         # Settings and configuration
/components         # React components
/lib                # Utility functions and integrations
/scripts            # Database migration scripts
/public             # Static assets
```

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/boardingpass)

## Features Overview

### For Agencies/Consultants

- Create unlimited onboarding flows
- Invite unlimited clients (plan dependent)
- Team collaboration with role-based access
- White-label everything with your brand
- Export all data anytime
- AppSumo license support

### For Clients

- Simple token-based access (no login required)
- Mobile-responsive portal
- Progress tracking with visual indicators
- File uploads with drag-and-drop
- Celebration moments on completion
- Email reminders for incomplete steps

### Built-in Templates

1. Agency Client Kickoff
2. SaaS User Onboarding
3. HR Employee Onboarding
4. Consultant Discovery
5. Real Estate Client Intake
6. Legal Client Setup
7. Marketing Campaign Setup
8. Design Project Intake
9. IT System Setup
10. Finance Client Onboarding

## Security

- Row Level Security (RLS) enabled on all tables
- Rate limiting on all public APIs
- File upload validation and sanitization
- CSRF protection
- Secure password hashing with bcrypt
- HTTP-only cookies for sessions
- Security headers configured

## License

Proprietary - All rights reserved

## Support

For support, email support@getboardingpass.app or visit our help center at https://getboardingpass.app/help
