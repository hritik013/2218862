import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper, Alert } from '@mui/material';
import { Log } from './middleware/logger';

const MAX_URLS = 5;
const SHORTCODE_LENGTH = 6;
const SHORTCODE_REGEX = /^[a-zA-Z0-9]{4,12}$/;
const STORAGE_KEY = 'shortUrlMap';

function generateShortcode(existing) {
  let code;
  do {
    code = Math.random().toString(36).substring(2, 2 + SHORTCODE_LENGTH);
  } while (existing.has(code));
  return code;
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const initialUrlState = { url: '', validity: '', shortcode: '', error: '' };

function ShortenerPage() {
  const [inputs, setInputs] = useState(Array(MAX_URLS).fill().map(() => ({ ...initialUrlState })));
  const [results, setResults] = useState([]);
  const [shortUrlMap, setShortUrlMap] = useState({}); // { shortcode: { ...data } }
  const [globalError, setGlobalError] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setShortUrlMap(parsed);
        Log('ShortenerPage', 'info', 'storage', 'Loaded shortUrlMap from localStorage');
      } catch {
        Log('ShortenerPage', 'error', 'storage', 'Failed to parse shortUrlMap from localStorage');
      }
    }
  }, []);

  // For uniqueness check
  const allShortcodes = new Set(Object.keys(shortUrlMap));

  const handleInputChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    newInputs[idx].error = '';
    setInputs(newInputs);
  };

  const validateInputs = async () => {
    let valid = true;
    const newInputs = inputs.map((input, idx) => {
      let error = '';
      if (!input.url) {
        error = 'URL is required';
        valid = false;
      } else if (!isValidUrl(input.url)) {
        error = 'Invalid URL format';
        valid = false;
      } else if (input.validity && (!/^[0-9]+$/.test(input.validity) || parseInt(input.validity) <= 0)) {
        error = 'Validity must be a positive integer';
        valid = false;
      } else if (input.shortcode) {
        if (!SHORTCODE_REGEX.test(input.shortcode)) {
          error = 'Shortcode must be 4-12 alphanumeric chars';
          valid = false;
        } else if (allShortcodes.has(input.shortcode)) {
          error = 'Shortcode already exists';
          valid = false;
        }
      }
      if (error) {
        Log('ShortenerPage', 'error', 'validation', `Input ${idx + 1}: ${error}`);
      }
      return { ...input, error };
    });
    setInputs(newInputs);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    if (!(await validateInputs())) {
      setGlobalError('Please fix the errors above.');
      Log('ShortenerPage', 'error', 'validation', 'Form submission blocked due to validation errors.');
      return;
    }
    const now = new Date();
    const newResults = [];
    const newShortUrlMap = { ...shortUrlMap };
    const usedShortcodes = new Set(Object.keys(shortUrlMap));
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (!input.url) continue;
      let shortcode = input.shortcode;
      if (!shortcode) {
        shortcode = generateShortcode(usedShortcodes);
      }
      usedShortcodes.add(shortcode);
      const validity = input.validity ? parseInt(input.validity) : 30;
      const expiry = new Date(now.getTime() + validity * 60000);
      const result = {
        originalUrl: input.url,
        shortcode,
        createdAt: now.toISOString(),
        expiry: expiry.toISOString(),
        clicks: [], // { timestamp, referrer, geo }
      };
      newResults.push(result);
      newShortUrlMap[shortcode] = result;
      Log('ShortenerPage', 'info', 'shorten', `Shortened URL: ${input.url} as /${shortcode} valid until ${expiry.toISOString()}`);
    }
    setResults(newResults);
    setShortUrlMap(newShortUrlMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newShortUrlMap));
    Log('ShortenerPage', 'info', 'storage', 'Updated shortUrlMap in localStorage');
    setInputs(Array(MAX_URLS).fill().map(() => ({ ...initialUrlState })));
  };

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        Shorten up to 5 URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {inputs.map((input, idx) => (
            <Grid item xs={12} key={idx}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">URL #{idx + 1}</Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="Long URL"
                      fullWidth
                      value={input.url}
                      onChange={e => handleInputChange(idx, 'url', e.target.value)}
                      error={!!input.error && input.error.includes('URL')}
                      helperText={input.error && input.error.includes('URL') ? input.error : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Validity (min)"
                      fullWidth
                      value={input.validity}
                      onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                      error={!!input.error && input.error.includes('Validity')}
                      helperText={input.error && input.error.includes('Validity') ? input.error : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Custom Shortcode"
                      fullWidth
                      value={input.shortcode}
                      onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                      error={!!input.error && input.error.includes('Shortcode')}
                      helperText={input.error && input.error.includes('Shortcode') ? input.error : ''}
                    />
                  </Grid>
                </Grid>
                {input.error && !input.error.includes('URL') && !input.error.includes('Validity') && !input.error.includes('Shortcode') && (
                  <Alert severity="error" sx={{ mt: 1 }}>{input.error}</Alert>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        {globalError && <Alert severity="error" sx={{ mt: 2 }}>{globalError}</Alert>}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Shorten URLs
        </Button>
      </form>
      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs</Typography>
          <Grid container spacing={2}>
            {results.map((res, idx) => (
              <Grid item xs={12} md={6} key={res.shortcode}>
                <Paper sx={{ p: 2 }}>
                  <Typography>Original: <a href={res.originalUrl} target="_blank" rel="noopener noreferrer">{res.originalUrl}</a></Typography>
                  <Typography>Short URL: <a href={`/${res.shortcode}`}>{window.location.origin}/{res.shortcode}</a></Typography>
                  <Typography>Expires: {new Date(res.expiry).toLocaleString()}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default ShortenerPage; 