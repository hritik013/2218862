import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Log } from './middleware/logger';

const STORAGE_KEY = 'shortUrlMap';

async function fetchGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return 'Unknown';
    const data = await res.json();
    return data.city && data.country_name ? `${data.city}, ${data.country_name}` : data.country_name || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, error, expired, success
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function handleRedirect() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setStatus('error');
        setMessage('No shortened URLs found.');
        Log('RedirectHandler', 'error', 'redirect', `No shortUrlMap in localStorage for /${shortcode}`);
        return;
      }
      const map = JSON.parse(stored);
      const entry = map[shortcode];
      if (!entry) {
        setStatus('error');
        setMessage('Short URL not found.');
        Log('RedirectHandler', 'error', 'redirect', `Shortcode /${shortcode} not found.`);
        return;
      }
      const now = new Date();
      if (new Date(entry.expiry) < now) {
        setStatus('expired');
        setMessage('This short URL has expired.');
        Log('RedirectHandler', 'error', 'redirect', `Shortcode /${shortcode} expired at ${entry.expiry}`);
        return;
      }
      // Log the click
      const timestamp = new Date().toISOString();
      const referrer = document.referrer || 'Direct';
      const geo = await fetchGeo();
      const click = { timestamp, referrer, geo };
      entry.clicks = entry.clicks || [];
      entry.clicks.push(click);
      map[shortcode] = entry;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      Log('RedirectHandler', 'info', 'redirect', `Click logged for /${shortcode}: ${JSON.stringify(click)}`);
      setStatus('success');
      setTimeout(() => {
        window.location.href = entry.originalUrl;
      }, 1200);
    }
    handleRedirect();
    // eslint-disable-next-line
  }, [shortcode]);

  if (status === 'loading') {
    return (
      <Box mt={6} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Redirecting...</Typography>
      </Box>
    );
  }
  if (status === 'success') {
    return (
      <Box mt={6} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Redirecting to your destination...</Typography>
      </Box>
    );
  }
  return (
    <Box mt={6} textAlign="center">
      <Alert severity="error">{message}</Alert>
      <Typography mt={2}>
        <a href="/">Go back to URL Shortener</a>
      </Typography>
    </Box>
  );
}

export default RedirectHandler; 