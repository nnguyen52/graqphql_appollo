import { useQuery } from '@apollo/client';
import { Alert, Box } from '@mui/material';
import React, { Fragment } from 'react';
import Post from './Post';
import { LoadingButton } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';
import { Query_getHideposts } from '../graphql-client/queries/getHidePosts';
import { Query_getPostsUserVoted } from '../graphql-client/queries/getPostsUserVoted';
import { Query_getCommentsFromUser } from '../graphql-client/queries/getCommentsFromUser';
import { Query_getPostsFromUser } from '../graphql-client/queries/getPostsFromUser';
import Lottie from 'react-lottie';
import * as loading_animationData from '../assets/loading.json';
import * as emptyData_animationData from '../assets/empty_data.json';

const ShowPosts = () => {
  // get Posts
  const {
    loading: loadingPosts,
    data: dataGetPosts,
    error,
    fetchMore,
    refetch: refetchGetPosts,
  } = useQuery(Query_getPosts, {
    variables: {
      limit: 10,
    },
    notifyOnNetworkStatusChange: true,
  });
  // me
  const { data: dataMe, loading: loadingMe, refetch: refetchMe } = useQuery(Query_me);
  // save+unsave posts
  const {
    data: dataSaveposts,
    loading: loadingDataSaveposts,
    refetch: refetchSavePosts,
  } = useQuery(Query_getSaveposts, {
    variables: { cursor: '' },
  });
  // hide post
  const { refetch: refetchHidePosts } = useQuery(Query_getHideposts, { variables: { cursor: '' } });
  // posts this user voted
  // upvote
  const { refetch: refetchGetPostsUserUpVoted } = useQuery(Query_getPostsUserVoted, {
    variables: {
      type: 'upvote',
    },
  });
  // downvote
  const { refetch: refetchGetPostsUserDownVoted } = useQuery(Query_getPostsUserVoted);

  // comments from this user
  const { refetch: refetchGetCommentsFromUser } = useQuery(Query_getCommentsFromUser, {
    variables: { userId: dataMe?.me?.data?._id?.toString() },
  });
  // actions in show posts must refetch data in authedSettings
  const { refetch: refetchGetPostsFromUser } = useQuery(Query_getPostsFromUser, {
    variables: { userId: dataMe?.me?.data?._id?.toString() },
  });

  // Lottie
  const loading_defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading_animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  const empty_data_defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: emptyData_animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  if (error) return <Alert severity='error'>Server error... {error}</Alert>;

  if (!dataGetPosts)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90vh',
        }}
      >
        <Lottie options={loading_defaultOptions} height={'50vh'} width={'40vh'} />
      </Box>
    );
  if (!loadingPosts && !dataGetPosts?.getPosts?.data?.posts)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '90vh',
        }}
      >
        <Lottie options={empty_data_defaultOptions} height={'50vh'} width={'40vh'} />
        <h4>No news yet...</h4>
      </Box>
    );
  return (
    <Box
      sx={{
        paddingBottom: '1em',
      }}
    >
      {dataGetPosts?.getPosts?.data?.posts?.map((each, index) => {
        return (
          <Fragment key={index}>
            <Post
              data={each}
              dataGetPosts={dataGetPosts}
              refetchGetPosts={refetchGetPosts}
              loadingPosts={loadingPosts}
              dataMe={dataMe}
              loadingMe={loadingMe}
              refetchMe={refetchMe}
              dataSaveposts={dataSaveposts}
              loadingDataSaveposts={loadingDataSaveposts}
              refetchSavePosts={refetchSavePosts}
              refetchHidePosts={refetchHidePosts}
              refetchGetPostsUserUpVoted={refetchGetPostsUserUpVoted}
              refetchGetPostsUserDownVoted={refetchGetPostsUserDownVoted}
              refetchGetCommentsFromUser={refetchGetCommentsFromUser}
              // for authedSettings
              refetchGetPostsFromUser={refetchGetPostsFromUser}
            />
          </Fragment>
        );
      })}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {dataGetPosts?.getPosts?.data?.pageInfo?.hasNextPage && (
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
