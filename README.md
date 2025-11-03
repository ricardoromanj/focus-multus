# Focus Multus - Conference Room Booking System

A modern, credit-based conference and focus room booking application built for an office in Englewood, Colorado.

## Features

- 🗓️ **Interactive Weekly Calendar** - Drag-to-select time slots with 15-minute granularity
- 💳 **Credit System** - Fair allocation with 10 credits per week per user
- ⚡ **Real-time Updates** - Live calendar updates via Supabase Realtime
- 🎨 **Modern UI** - Dark theme with aqua accents and smooth animations
- 📱 **Responsive Design** - Works on desktop and mobile
- ♿ **Accessible** - Semantic HTML and ARIA labels

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (Postgres + Realtime)
- **Styling**: Tailwind CSS v4
- **Date/Time**: date-fns
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focus-multus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new Supabase project at [supabase.com](https://supabase.com)
   
   b. Run the SQL from `database/schema.sql` in the Supabase SQL editor
   
   c. Run the seed data from `database/seed.sql`

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
focus-multus/
├── app/
│   ├── api/              # API routes
│   │   ├── bookings/     # Booking CRUD
│   │   ├── rooms/        # Room queries
│   │   ├── users/        # User management
│   │   └── reset-credits/# Credit reset endpoint
│   ├── book/             # Booking calendar page
│   ├── sessions/         # User sessions page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home (redirects to /book)
├── components/           # React components
│   ├── AppProvider.tsx   # Global state provider
│   ├── Header.tsx        # App header with navigation
│   ├── UserSelector.tsx  # User dropdown (auth stub)
│   ├── CreditBalance.tsx # Credit display
│   ├── BookingCalendar.tsx
│   ├── FilterBar.tsx     # Week navigation & filters
│   ├── TimeGrid.tsx      # Drag-to-select calendar grid
│   ├── BookingDialog.tsx # Booking creation modal
│   └── SessionsList.tsx  # User's bookings list
├── lib/                  # Utilities
│   ├── supabase.ts       # Supabase client
│   ├── datetime.ts       # Date/time helpers
│   └── credits.ts        # Credit calculations
├── types/
│   └── index.ts          # TypeScript types
└── database/
    ├── schema.sql        # Database schema
    └── seed.sql          # Seed data
```

## Business Logic

### Credit System

- **Weekly Budget**: 10 credits per user
- **Reset Schedule**: Every Monday at 12:00 AM MT
- **Credit Costs**:
  - Focus rooms (1-2 capacity): 1 credit per 30 minutes
  - Conference rooms (3+ capacity): 2 credits per 30 minutes

### Booking Rules

- Time slots in 15-minute increments
- Duration options: 30, 60, 90, 120 minutes
- Cannot book in the past
- Cannot book with insufficient credits
- Database prevents double-booking same room

## API Endpoints

- `GET /api/users` - List all users
- `GET /api/users/[id]` - Get user by ID
- `GET /api/rooms?type={focus|conference}` - List rooms (with optional filter)
- `GET /api/bookings?userId={id}&status={status}` - List bookings
- `POST /api/bookings` - Create booking
- `DELETE /api/bookings/[id]` - Cancel booking
- `POST /api/reset-credits` - Reset all users to 10 credits

## Database Schema

See `database/schema.sql` for the complete schema. Key tables:

- `users` - User accounts and credit balances
- `rooms` - Focus and conference rooms
- `bookings` - Room reservations
- `credit_transactions` - Audit log for credit changes

## Development

### Testing Users

Three test users are seeded:
- Alex Rivera (alex@example.com)
- Jordan Kim (jordan@example.com)
- Sam Taylor (sam@example.com)

Switch between users using the dropdown in the header.

### Reset Credits

To reset all users to 10 credits (simulating weekly reset):

```bash
curl -X POST http://localhost:3000/api/reset-credits
```

### Real-time Updates

The app subscribes to Supabase Realtime for live updates:
- Booking calendar updates when any user books/cancels
- Session list updates when current user's bookings change

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

## Future Enhancements

- Real authentication (replace user selector)
- Admin dashboard for room management
- Email notifications for bookings
- Recurring bookings
- Mission/penalty system for credit gamification
- Analytics and usage reports

## License

MIT

## Support

For issues or questions, please open a GitHub issue.
