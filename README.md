# Free Google Maps Scraper Dashboard

An open-source dashboard for scraping Google Maps data using Apify. This project provides a user-friendly interface to run scrapes, view history, and download results (CSV/JSON).

## Features

-   **Scrape Google Maps**: Extract business details like names, addresses, ratings, reviews, and categories.
-   **Run History**: View your past scraping jobs, sorted by latest.
-   **Dynamic Previews**: View a sample of your data with columns automatically mapped to the dataset schema.
-   **Export Data**: Direct download links for CSV and JSON formats.
-   **Configurable Limits**: Set the maximum number of results to scrape per run.

## Getting Started

### Prerequisites

-   Node.js & npm/bun installed.
-   An [Apify Account](https://apify.com/).

### Installation

1.  **Clone the repository**

    ```bash
    git clone <YOUR_REPO_URL>
    cd free-google-maps-scraper
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    bun install
    ```

3.  **Configure Environment**

    Create a `.env` file in the root directory (copy from `.env.example`):

    ```bash
    cp .env.example .env
    ```

    Open `.env` and add your Apify API Token:

    ```env
    VITE_APIFY_TOKEN=your_apify_api_token_here
    VITE_APIFY_ACTOR_ID=automateitplease~free-basic-google-maps-scraper
    ```

    > **Note:** By default, this project is configured to use the `automateitplease~free-basic-google-maps-scraper` actor, which is free to use. You can change this ID if you wish to use a different compatible Google Maps scraper actor.

4.  **Start the development server**

    ```bash
    npm run dev
    # or
    bun dev
    ```

## Usage

1.  Open the dashboard in your browser.
2.  Enter your search queries (e.g., "Coffee shops in Seattle").
3.  Set the **Max Results** limit.
4.  Click **Start Scrape**.
5.  Once running, you can monitor the status in the "History & Datasets" section.
6.  When complete, click **Preview** to see the data or use the **Export** buttons to download.

## Technologies

-   [Vite](https://vitejs.dev/)
-   [React](https://reactjs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [shadcn/ui](https://ui.shadcn.com/)
-   [Apify API](https://docs.apify.com/api/v2)

## License

This project is open source and available under the MIT License.
