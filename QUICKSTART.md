# Quick Start Guide

Get Focus Multus running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Wait for it to initialize (~2 minutes)

2. **Run Database Setup**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database/schema.sql`
   - Click "Run"
   - Then copy and paste the contents of `database/seed.sql`
   - Click "Run" again

3. **Get Your API Keys**
   - Go to Project Settings → API
   - Copy the "Project URL" and "anon public" key

## Step 3: Configure Environment

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 5: Test It Out

1. **Select a User**: Click the user dropdown in the top-right and select "Alex Rivera"
2. **Book a Room**: 
   - Click and drag on the calendar to select a time slot
   - Choose a room type (Focus or Conference)
   - Click "Complete Booking!"
3. **View Your Session**: Click "Sessions" in the navigation to see your booking
4. **Try Another User**: Switch to "Jordan Kim" and book another room
5. **See Real-time Updates**: Watch as bookings appear live!

## Admin Features

Visit [http://localhost:3000/admin](http://localhost:3000/admin) to:
- Reset all user credits to 10 (simulates weekly reset)
- View all users and their credit balances

## Test Users

Three users are pre-loaded:
- **Alex Rivera** - alex@example.com
- **Jordan Kim** - jordan@example.com
- **Sam Taylor** - sam@example.com

All start with 10 credits.

## Test Rooms

**Focus Rooms** (1-2 people, 1 credit per 30 min):
- Pike's Peak (2 capacity)
- Bear Creek (2 capacity)
- Red Rocks (1 capacity)

**Conference Rooms** (3+ people, 2 credits per 30 min):
- Lookout Mountain (6 capacity)
- Gothic Theatre (8 capacity)
- Platte River (10 capacity)
- Hampden Hall (12 capacity)

## Troubleshooting

**Can't connect to Supabase?**
- Check your `.env.local` file has the correct URL and key
- Make sure the environment variables start with `NEXT_PUBLIC_`
- Restart the dev server after changing `.env.local`

**No rooms showing up?**
- Make sure you ran both `schema.sql` and `seed.sql` in Supabase
- Check the Supabase Table Editor to verify data exists

**Bookings not appearing?**
- Open browser console to check for errors
- Verify Supabase Realtime is enabled for the `bookings` table
- Check RLS policies are set to allow all access (for development)

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the codebase structure
- Customize room names, colors, or credit costs
- Deploy to Vercel when ready!

## Need Help?

Open an issue on GitHub or check the README for more details.

Happy booking! 🚀

