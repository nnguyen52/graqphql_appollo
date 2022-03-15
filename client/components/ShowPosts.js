import { useApolloClient, useQuery } from '@apollo/client';
import React, { Fragment } from 'react';
import { Query_getPosts } from '../graphql-client/queries/posts';
import Post from './Post';

const ShowPosts = () => {
  const {
    loading: loadingPosts,
    data,
    error,
    fetchMore,
  } = useQuery(Query_getPosts, {
    variables: {
      limit: 2,
    },
    notifyOnNetworkStatusChange: true,
  });
  //   if (!data.getPosts.data.pageInfo.hasNextPage) localStorage.setItem('endPage', 'true');
  if (data) console.log('current data, ', data);
  if (error) return <h3>Server error...</h3>;
  if (loadingPosts) return <h3> Loading... </h3>;

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
        <button
          onClick={async (e) =>
            await fetchMore({
              variables: { cursor: data.getPosts.data.pageInfo.endCursor, limit: 2 },
            })
          }
        >
          get more
        </button>
      )}
    </Fragment>
  );
};

export default ShowPosts;
