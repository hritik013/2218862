import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Link as MuiLink, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { Log } from './middleware/logger';

const STORAGE_KEY = 'shortUrlMap';

function StatsPage() {
  const [shortUrlMap, setShortUrlMap] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setShortUrlMap(JSON.parse(stored));
        Log('StatsPage', 'info', 'storage', 'Loaded shortUrlMap from localStorage');
      } else {
        setShortUrlMap({});
        Log('StatsPage', 'info', 'storage', 'No shortUrlMap found in localStorage');
      }
    } catch (err) {
      setError('Failed to load statistics.');
      Log('StatsPage', 'error', 'storage', 'Failed to parse shortUrlMap from localStorage');
    }
  }, []);

  const shortcodes = Object.keys(shortUrlMap);

  return (
    <Box mt={4}>
      <Typography variant="h5" gutterBottom>
        URL Shortener Statistics
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {shortcodes.length === 0 && !error && (
        <Typography>No shortened URLs found.</Typography>
      )}
      <Grid container spacing={3}>
        {shortcodes.map((code) => {
          const data = shortUrlMap[code];
          return (
            <Grid item xs={12} md={6} key={code}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">Short URL: <MuiLink href={`/${code}`}>{window.location.origin}/{code}</MuiLink></Typography>
                <Typography>Original URL: <MuiLink href={data.originalUrl} target="_blank" rel="noopener noreferrer">{data.originalUrl}</MuiLink></Typography>
                <Typography>Created: {new Date(data.createdAt).toLocaleString()}</Typography>
                <Typography>Expires: {new Date(data.expiry).toLocaleString()}</Typography>
                <Typography>Total Clicks: {data.clicks ? data.clicks.length : 0}</Typography>
                {data.clicks && data.clicks.length > 0 && (
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Referrer</TableCell>
                          <TableCell>Geo Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.clicks.map((click, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{click.referrer || 'Direct'}</TableCell>
                            <TableCell>{click.geo || 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default StatsPage; 