import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Query_me } from '../graphql-client/queries/user';
import { Mutation_logout } from '../graphql-client/mutations/logout';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import NextLink from 'next/link';
import { LoadingButton } from '@mui/lab';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HomeIcon from '@mui/icons-material/Home';

const Auth = () => {
  const router = useRouter();
  const { data, loading: loadingMe } = useQuery(Query_me);
  const [logout] = useMutation(Mutation_logout);
  if (router.route == '/login' && !loadingMe) return <div></div>;
  if (data?.me?.data)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'warp',
          justifyContent: 'space-around',
          gap: '.5em',
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
              loading={loadingMe}
            >
              <ManageAccountsIcon />
            </LoadingButton>
          </NextLink>
        )}
        <Button
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
    );
  if (!loadingMe && !data?.me?.data && router.route !== '/register')
    return (
      <Box sx={{ display: 'flex', gap: '.5em' }}>
        <NextLink href={'/register'}>
          <Button
            sx={{
              border: '2px solid orange',
              color: 'orange',
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
              background: 'orange',
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
    );
  return <div style={{ margin: '1em' }}></div>;
};

export default Auth;
