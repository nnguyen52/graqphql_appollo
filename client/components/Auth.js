import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Query_me } from '../graphql-client/queries/user';
import { Mutation_logout } from '../graphql-client/mutations/logout';
import { useRouter } from 'next/router';
import { Box, Button } from '@mui/material';
import NextLink from 'next/link';
import { LoadingButton } from '@mui/lab';

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
          gap: '1em',
        }}
      >
        <NextLink href={`/account/${data?.me?.data?.id?.toString()}`}>
          <LoadingButton
            sx={{
              height: 'fit-content',
            }}
            loading={loadingMe}
          >
            Account
          </LoadingButton>
        </NextLink>
        <Button
          sx={{
            height: 'fit-content ',
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
          Logout
        </Button>
      </Box>
    );
  if (!loadingMe && !data?.me?.data)
    return <Button onClick={() => router.replace('/login')}>Login</Button>;
  return <></>;
};

export default Auth;
