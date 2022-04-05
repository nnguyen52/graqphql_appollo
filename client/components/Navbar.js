import { Box, ThemeProvider, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import theme, { headingFont } from '../src/theme';
import Auth from './Auth';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import NextLink from 'next/link';
import Search from './Search';
import { useTheme, styled } from '@mui/material/styles';

const NavbarResponsive = styled('div')(({ theme, ...props }) => ({
  [theme.breakpoints.down('md')]: {
    '.navContainer': {
      position: 'relative',
    },
    '.navContainer .navLogo': {
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: 10000,
      padding: '10px',
      fontSize: '2em',
    },
    '.centerNavLogo': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    '.navContainer .navSearch': {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999,
      width: '100%',
      marginTop: '6px',
    },
    '.navContainer .navSearch input[type="text"]': {
      paddingRight: '33%',
    },
    '.navContainer .navAuth': {
      zIndex: 9999,
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));
const Header = () => {
  const theme = useTheme();
  const router = useRouter();
  return (
    <>
      <NavbarResponsive>
        <Box
          className={`navContainer`}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'warp',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <ThemeProvider theme={headingFont}>
            {router.pathname == '/' ? (
              <Typography
                className='navLogo'
                variant='h3'
                gutterBottom
                style={{ cursor: 'pointer', border: theme.logo }}
              >
                Reddis
              </Typography>
            ) : (
              <NextLink href={'/'}>
                <Typography
                  className={`navLogo ${
                    theme?.breakpoints.down('md') &&
                    (router.pathname.toString() == '/register' ||
                      router.pathname.toString() == '/login')
                      ? 'centerNavLogo'
                      : null
                  }`}
                  variant='h3'
                  gutterBottom
                  style={{ cursor: 'pointer' }}
                >
                  Reddis
                </Typography>
              </NextLink>
            )}
          </ThemeProvider>
          {router.pathname == '/account/password' ||
          router.pathname == '/login' ||
          router.pathname == '/register' ? (
            <div></div>
          ) : (
            <Box className='navSearch'>
              <Search />
            </Box>
          )}
          <Box className='navAuth'>
            <Auth />
          </Box>
        </Box>
      </NavbarResponsive>
    </>
  );
};

export default Header;
