import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Query_me } from '../graphql-client/queries/user';
import { Mutation_logout } from '../graphql-client/mutations/logout';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import NextLink from 'next/link';
const Auth = () => {
  const router = useRouter();
  const { data } = useQuery(Query_me);
  const [logout] = useMutation(Mutation_logout);
  if (router.route == '/login') return <div> </div>;
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
        <NextLink href='/account'>Account </NextLink>
        <span
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
        </span>
      </Box>
    );
  return <div onClick={() => router.replace('/login')}>Login</div>;
};

export default Auth;
