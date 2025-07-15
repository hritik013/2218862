# React URL Shortener Web App

## Overview
This is a user-friendly URL Shortener application built with React and Material UI. It allows users to shorten URLs, manage custom shortcodes, set expiry times, and view detailed analytics for each short link—all managed on the client side. All logging is handled via a custom middleware and sent to a remote logging API with authentication.

## Features
- **Shorten up to 5 URLs at once**
- **Custom shortcodes** (alphanumeric, unique, 4-12 chars)
- **Set validity period** (in minutes, default 30)
- **Client-side validation** for URLs, shortcodes, and validity
- **Short URL redirection** handled via client-side routing
- **Statistics page** with:
  - Short URL, original URL, creation/expiry times
  - Total click count
  - Click details: timestamp, referrer, geo-location
- **All actions and errors logged** via a custom logger (no console.log)
- **Material UI** for a modern, clean interface
- **Data persistence** using localStorage

## Setup & Running
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the app:**
   ```bash
   npm run dev
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

## Usage
- **Shorten URLs:**
  - Enter up to 5 long URLs.
  - Optionally set validity (minutes) and/or a custom shortcode.
  - Click "Shorten URLs" to generate short links.
- **Redirection:**
  - Click a short URL to be redirected to the original URL. Each click is logged with timestamp, referrer, and geo-location.
- **View Analytics:**
  - Go to the Statistics page to see all shortened URLs and detailed click analytics.
- **Error Handling:**
  - Invalid inputs, expired links, and duplicate shortcodes are handled with user-friendly messages.

## Logging Middleware
- All logs are sent to a remote API with a Bearer token (see `src/middleware/logger.js`).
- No use of `console.log` or browser logging anywhere in the app.
## DEMO
## 1.INPUT THE URLs:
<img width="1566" height="1043" alt="image" src="https://github.com/user-attachments/assets/397721cd-0659-4dfd-b0bc-6d7dcb44200f" />

## 2.SHORTENED URLs: 
<img width="1345" height="348" alt="image" src="https://github.com/user-attachments/assets/ca190501-b42f-4feb-8185-74b1847781e4" />

## 3.STATS:
<img width="1558" height="707" alt="image" src="https://github.com/user-attachments/assets/49dba504-42b9-413b-8730-1a9222e0cb97" />

## 4.Result
<img width="1832" height="1045" alt="image" src="https://github.com/user-attachments/assets/b4115513-b5e9-4675-a3a2-d49e3fd9d722" />

## Tech Stack
- **React** (Vite)
- **Material UI**
- **React Router**
- **Custom Logging Middleware**

## Notes
- The app is designed to run only on `http://localhost:3000`.
- All data is stored in localStorage for persistence across sessions.
- For geo-location, a public IP API is used on each redirect.

## Clearing Data
To reset all shortened URLs and analytics, clear the `shortUrlMap` key from your browser's localStorage.

## License
This project is for evaluation/demo purposes only.
