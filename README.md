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

## Usage

1. Sign up with Google
2. Create your profile with your major, year, subjects, and interests
3. Browse matches - swipe through potential study partners
4. Accept connections to start studying together
5. Manage your connections in the "Connections" page

## Live Demo

[View Live App](https://study-group-matcher.vercel.app)

## Future Features

- Real-time chat with Socket.io
- Calendar integration (Google Calendar, Outlook)
- Group study sessions
- Study progress tracking
- Notifications

