import { Box, ThemeProvider, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { headingFont } from '../src/theme';
import Auth from './Auth';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { useApolloClient } from '@apollo/client';
import NextLink from 'next/link';
import Search from './Search';

const Header = () => {
  const router = useRouter();
  const client = useApolloClient();
  const dataMe = client.readQuery({ query: Query_me });

  return (
    <>
      <ThemeProvider theme={headingFont}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'warp',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {router.pathname == '/' ? (
            <Typography variant='h3' gutterBottom style={{ cursor: 'pointer' }}>
              Reddis
            </Typography>
          ) : (
            <NextLink href={'/'}>
              <Typography variant='h3' gutterBottom style={{ cursor: 'pointer' }}>
                Reddis
              </Typography>
            </NextLink>
          )}
          {router.pathname == '/account/password' ||
          router.pathname == '/login' ||
          router.pathname == '/register' ? null : (
            <Search />
          )}
          <Auth />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Header;
