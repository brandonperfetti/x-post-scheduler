# X Post Scheduler

## Prerequisites

This project assumes you have working knowledge of:

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Trigger.dev](https://trigger.dev/)
- [Twitter Developer API](https://developer.twitter.com/)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then create a `.env.local` file with the following contents:

```bash
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_CLIENT_SECRET=your_twitter_client_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
TRIGGER_API_KEY=your_trigger_api_key
TRIGGER_API_URL=https://api.trigger.dev
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY=your_trigger_public_api_key

```

Then run the development server:

```bash
npm run dev
```

Then in another terminal do:

```bash
npx @trigger.dev/cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `src/pages/index.js`. The page
auto-updates as you edit the file.
