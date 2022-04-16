import { useQuery } from '@apollo/client';
import { Alert, Box } from '@mui/material';
import React, { Fragment } from 'react';
import { Query_getPosts } from '../graphql-client/queries/posts';
import Post from './Post';
import { LoadingButton } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ShowPosts = () => {
  const {
    loading: loadingPosts,
    data,
    error,
    fetchMore,
  } = useQuery(Query_getPosts, {
    variables: {
      limit: 3,
    },
    notifyOnNetworkStatusChange: true,
  });
  console.log(data);
  if (error) return <Alert severity='error'>Server error... {error}</Alert>;

  return (
    <Box
      sx={{
        paddingBottom: '1em',
      }}
    >
      {data?.getPosts?.data?.posts?.map((each, index) => {
        return (
          <Fragment key={index}>
            <Post data={each} />
          </Fragment>
        );
      })}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {data?.getPosts?.data?.pageInfo?.hasNextPage && (
          <LoadingButton
            sx={{
              marginBottom: '1em',
              borderRadius: '12px',
              background: 'black',
              color: 'white',
              '&:hover': {
                background: '#353535',
              },
            }}
            loading={loadingPosts}
            onClick={async (e) =>
              await fetchMore({
                variables: { cursor: data?.getPosts?.data?.pageInfo?.endCursor, limit: 5 },
              })
            }
          >
            <ExpandMoreIcon
              sx={{
                fontSize: 35,
                width: 80,
                color: 'white',
              }}
            />
          </LoadingButton>
        )}
      </Box>
    </Box>
  );
};

export default ShowPosts;
