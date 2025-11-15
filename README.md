# StudyMatch - Find Your Study Partners

A web app that helps students find compatible study partners based on their major, subjects, interests, and schedule. Match with peers, form study groups, and collaborate seamlessly.

## Features

- **Smart Matching Algorithm** - Get matched with students based on:
  - Major (30% weight)
  - Year of study (25%)
  - Subjects (25%)
  - Interests (20%)
  - Timezone (5%)
  
- **Google OAuth Login** - Quick and easy authentication
- **Profile Management** - Create and edit your profile with your subjects and interests
- **Live Match Cards** - Browse potential study partners with match percentages
- **Connection Management** - Accept or reject connection requests
- **Responsive Design** - Beautiful pastel UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Pastel color scheme
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project
- Google OAuth credentials

### Setup

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/study-group-matcher.git
cd study-group-matcher
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**
Create a `.env.local` file with your Supabase credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
\`\`\`

4. **Create database tables**
Run the SQL migration in your Supabase SQL editor:
\`\`\`sql
-- Copy contents from scripts/001_create_tables.sql
\`\`\`

5. **Enable Google OAuth**
- Go to Supabase → Authentication → Providers
- Enable Google provider and add your credentials
- Add `http://localhost:3000/auth/callback` as a redirect URL

6. **Run the app**
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000`

## Usage

1. Sign up with Google
2. Create your profile with your major, year, subjects, and interests
3. Browse matches - swipe through potential study partners
4. Accept connections to start studying together
5. Manage your connections in the "Connections" page

## Live Demo

[View Live App](https://study-group-matcher.vercel.app)

## Project Structure

\`\`\`
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── matches/           # Match browsing
│   ├── connections/       # Connection management
│   └── profile/           # Profile pages
├── components/
│   ├── profile-form.tsx   # Profile creation form
│   ├── profile-card.tsx   # Match card component
│   └── connection-card.tsx # Connection card
├── lib/
│   ├── supabase/          # Supabase utilities
│   └── matching.ts        # Matching algorithm
└── scripts/
    └── 001_create_tables.sql # Database schema
\`\`\`

## Algorithm Details

The matching algorithm calculates a similarity score (0-100%) based on:
- **Major match**: Exact match or related field
- **Year match**: Proximity in year of study
- **Subject overlap**: Common study subjects
- **Interest overlap**: Shared interests
- **Timezone compatibility**: Similar time zones for study sessions

## Future Features

- Real-time chat with Socket.io
- Calendar integration (Google Calendar, Outlook)
- Group study sessions
- Study progress tracking
- Notifications

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for students who want to study together
