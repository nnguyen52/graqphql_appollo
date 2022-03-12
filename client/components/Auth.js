import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Query_me } from '../graphql-client/queries/user';
import { Mutation_logout } from '../graphql-client/mutations/logout';
import { useRouter } from 'next/router';
const Auth = () => {
  const router = useRouter();
  const { data } = useQuery(Query_me);
  const [logout] = useMutation(Mutation_logout);
  if (router.route == '/login') return <div> </div>;
  if (data?.me?.data)
    return (
      <>
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
      </>
    );
  return <div onClick={() => router.push('/login')}>Login</div>;
};

export default Auth;
