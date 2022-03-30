import React from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Query_me } from '../graphql-client/queries/user';
import { Mutation_logout } from '../graphql-client/mutations/logout';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import NextLink from 'next/link';

const Auth = () => {
  const router = useRouter();
  const { data, loading } = useQuery(Query_me);
  const [logout] = useMutation(Mutation_logout);
  if (router.route == '/login' && !loading) return <div> </div>;
  if (data?.me?.data)
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'warp',
          justifyContent: 'space-around',
          gap: '1em',
        }}
      >
        <NextLink href='/account'>
          <Button
            sx={{
              height: 'fit-content',
            }}
          >
            Account
          </Button>
        </NextLink>
        <Button
          sx={{
            height: 'fit-content ',
          }}
          onClick={async () =>
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
            })
          }
        >
          Logout
        </Button>
      </Box>
    );
  if (!loading && !data?.me?.data)
    return <Button onClick={() => router.replace('/login')}>Login</Button>;
  return <></>;
};

export default Auth;
