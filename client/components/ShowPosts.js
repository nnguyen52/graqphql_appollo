import { useApolloClient, useQuery } from '@apollo/client';
import { Alert, LinearProgress } from '@mui/material';
import React, { Fragment } from 'react';
import { Query_getPosts } from '../graphql-client/queries/posts';
import Post from './Post';
import { LoadingButton } from '@mui/lab';

const ShowPosts = () => {
  const {
    loading: loadingPosts,
    data,
    error,
    fetchMore,
  } = useQuery(Query_getPosts, {
    variables: {
      limit: 5,
    },
    notifyOnNetworkStatusChange: true,
  });
  if (error) return <Alert severity='error'>Server error... {error}</Alert>;
  if (loadingPosts) return <LinearProgress />;
  return (
    <Fragment>
      {data.getPosts.data.posts.map((each, index) => {
        return (
          <Fragment key={index}>
            <Post data={each} />
          </Fragment>
        );
      })}
      {data.getPosts.data.pageInfo.hasNextPage && (
        <LoadingButton
          loading={loadingPosts}
          onClick={async (e) =>
            await fetchMore({
              variables: { cursor: data.getPosts.data.pageInfo.endCursor, limit: 5 },
            })
          }
        >
          See more...
        </LoadingButton>
      )}
    </Fragment>
  );
};

export default ShowPosts;
