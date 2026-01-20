# 🚀 FREE Google Maps Scraper Dashboard - 5-Minute Setup Guide

Deploy your own commercial-grade Google Maps scraper in under 5 minutes. No coding required, completely free to start, and runs on your own infrastructure or local machine.

## 📋 What You'll Get

-   ✅ **Unlimited Scraping** - Extract thousands of leads directly from Google Maps
-   ✅ **Complete Business Data** - Emails, phone numbers, websites, ratings, and reviews
-   ✅ **Real-time Dashboard** - Monitor your scraping jobs live
-   ✅ **History Management** - Keep track of all your past runs and datasets
-   ✅ **One-Click Exports** - Download clean CSV/JSON files instantly for Excel or Google Sheets
-   ✅ **Smart Limits** - Control exactly how many results you scrape to manage credits
-   ✅ **Completely Free** - Uses the free-tier compatible `free-basic-google-maps-scraper` actor

---

## ⚡ Quick Start Guide

You can have this running on your local machine in just a few simple steps.

### 1. Prerequisites

-   **Node.js** (v18+)
-   An **[Apify Account](https://apify.com/)** (The free tier is sufficient!)

### 2. Installation

Clone this repository and install the dependencies:

```bash
git clone <YOUR_REPO_URL>
cd free-google-maps-scraper
npm install
# or if you use bun
bun install
```

### 3. Configuration

We've made setup extremely easy. Just copy the example environment file:

```bash
cp .env.example .env
```

Now open `.env` and paste your Apify API Token:

```env
# Get this from https://console.apify.com/account/integrations
VITE_APIFY_TOKEN=your_apify_api_token_here

# This is pre-configured for the best free scraper available
VITE_APIFY_ACTOR_ID=automateitplease~free-basic-google-maps-scraper
```

### 4. Run It!

Start your dashboard:

```bash
npm run dev
```

That's it! Visit `http://localhost:5173` (or the URL shown in your terminal) and start scraping.

---

## 🛠️ How It Works

This dashboard connects directly to the powerful [Apify](https://apify.com/) platform using their API. 

1.  **You Enter a Query**: "Gyms in London", "Plumbers in NYC", etc.
2.  **We Dispatch the Job**: The dashboard triggers the `automateitplease~free-basic-google-maps-scraper` actor on Apify.
3.  **You Watch & Download**: See the results stream in and download them when ready.

Because it uses your own API key, **you have full control**. You can switch to other actors, manage your own proxies (if needed), and keep all your data private.

## 🤝 Contributing

We love open source! If you want to add features like visualizing data on a map, email integration, or more export formats, feel free to fork and submit a PR.

## 📄 License

MIT License - Free to use for personal and commercial projects.
