import { Box, ThemeProvider, Typography } from '@mui/material';
import React from 'react';
import { headingFont } from '../src/theme';
import Auth from './Auth';

const Header = () => {
  return (
    <>
      <ThemeProvider theme={headingFont}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'warp',
            justifyContent: 'space-around',
          }}
        >
          <Typography variant='h3' gutterBottom>
            GraphQL
          </Typography>
          <Auth />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Header;
