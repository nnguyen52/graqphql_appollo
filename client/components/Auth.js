import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Query_me } from '../graphql-client/queries/user';
import { Mutation_logout } from '../graphql-client/mutations/logout';
import { useRouter } from 'next/router';
import { Box, Button, Avatar } from '@mui/material';
import NextLink from 'next/link';
import { LoadingButton } from '@mui/lab';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const AuthResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.loggedinAuthContainer': {
      background: 'grey',
      padding: '.2em',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: '.5em',
    },
    '.loggedinAuthContainer .logout': {
      width: '20%',
    },
    '.notloggedinAuthContainer': {
      display: 'flex',
      justifyContent: 'space-between',
      background: 'grey',
      padding: '.2em',
      paddingTop: '.5em',
    },
    '.notloggedinAuthContainer > *': {
      width: '50%',
    },
  },
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));
const Auth = () => {
  const router = useRouter();
  const { data, loading: loadingMe } = useQuery(Query_me);
  const [logout] = useMutation(Mutation_logout);
  if (router.route == '/login' && !loadingMe) return <div></div>;
  if (data?.me?.data)
    return (
      <AuthResponsive>
        <Box
          className='loggedinAuthContainer'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'warp',
            justifyContent: 'space-around',
            gap: '1em',
          }}
        >
          {router.route !== '/' && (
            <NextLink href='/'>
              <LoadingButton
                variant='contain'
                sx={{
                  height: 'fit-content',
                  color: 'white',
                  background: 'black',
                  '&:hover': {
                    color: 'white',
                    background: '#424242',
                  },
                }}
              >
                <HomeIcon />
              </LoadingButton>
            </NextLink>
          )}
          {router.route !== '/account/[id]' && (
            <NextLink href={`/account/${data?.me?.data?.id?.toString()}`}>
              <Avatar
                sx={{ border: '2px solid black', cursor: 'pointer' }}
                src={data?.me?.data?.avatar}
                alt={`${data?.me?.data?.userName} avatar`}
              />
            </NextLink>
          )}
          <Button
            className='logout'
            variant='contained'
            sx={{
              height: 'fit-content ',
              color: 'white',
              background: '#bc074c',
              '&:hover': {
                color: 'white',
                background: 'crimson',
              },
            }}
            onClick={async () => {
              if (confirm('You are logging out. Are you sure? '))
                logout({
                  variables: null,
                  update(cache, { data }) {
                    cache.writeQuery({
                      query: Query_me,
                      data: {
                        me: null,
                      },
                    });
                  },
                });
            }}
          >
            <LogoutIcon />
          </Button>
        </Box>
      </AuthResponsive>
    );

  if (!loadingMe && !data?.me?.data && router.route !== '/register')
    return (
      <AuthResponsive>
        <ThemeProvider theme={theme}>
          <Box className='notloggedinAuthContainer' sx={{ display: 'flex', gap: '.5em' }}>
            <NextLink href={'/register'}>
              <Button
                sx={{
                  border: `2px solid ${theme.palette.upvoteButton.main}`,
                  color: theme.palette.upvoteButton.main,
                  background: 'black',
                  '&:hover': {
                    border: '2px solid #164920',
                    background: '#164920',
                    color: 'white',
                  },
                }}
                variant='contained'
              >
                Register
              </Button>
            </NextLink>
            <NextLink href={'/login'}>
              <Button
                sx={{
                  border: '2px solid black',
                  background: theme.palette.upvoteButton.main,
                  color: 'black',
                  '&:hover': {
                    border: '2px solid #164920',
                    color: 'white',
                    background: '#164920',
                  },
                }}
                variant='outlined'
              >
                Login
              </Button>
            </NextLink>
          </Box>
        </ThemeProvider>
      </AuthResponsive>
    );
  return <div style={{ margin: '1em' }}></div>;
};

export default Auth;
