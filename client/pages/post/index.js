import React, { useEffect, useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { LoadingButton } from '@mui/lab';
import Comments from './Comments';
import { Mutation_voteComment } from '../graphql-client/mutations/voteComment';
import InputComment from './InputComment';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Mutation_deletePost } from '../graphql-client/mutations/deletePost';
import NextLink from 'next/link';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import { Query_checkPostVotedFromUser } from '../graphql-client/queries/checkPostVotedFromUser';
import { useRouter } from 'next/router';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../src/theme';

const Post = ({ data }) => {
  const client = useApolloClient();
  const dataGetPosts = client.readQuery({ query: Query_getPosts });
  const dataMe = client.readQuery({ query: Query_me });
  const [vote, { loading }] = useMutation(Mutation_vote);
  const [voteComment, { loading: loadingVoteComment }] = useMutation(Mutation_voteComment);
  const [deletePost, { loading: loadingDeletePost }] = useMutation(Mutation_deletePost);
  const [commentMode, setCommentMode] = useState(false);
  const {
    data: dataUserVoted,
    loading: loadingUserVoted,
    refetch,
  } = useQuery(Query_checkPostVotedFromUser, {
    variables: {
      postId: data._id.toString(),
    },
  });
  const router = useRouter();
  const { query } = router;
  const handleVote = async (value) => {
    try {
      if (!dataMe?.me?.data || !dataMe.me) {
        return alert('Please login to vote posts!');
      }
      await vote({
        variables: { postId: data._id, voteValue: value },
        update(cache, response) {
          if (!response.data.vote.network.success)
            return alert(response.data.vote.network.errors[0].message);
          if (response.data.vote.network.success) {
            cache.writeQuery({
              query: Query_getPosts,
              data: {
                getPosts: {
                  ...dataGetPosts.getPosts,
                  data: {
                    ...dataGetPosts.getPosts.data,
                    posts: [],
                  },
                },
              },
            });
            refetch();
          }
        },
      }).catch((e) => console.log(e));
    } catch (e) {
      console.log('out erorr', e);
    }
  };
  const handleDeletePost = async () => {
    if (confirm('You are about to delete post. Are you sure?'))
      await deletePost({
        variables: {
          id: data._id.toString(),
        },
        update(cache, response) {
          if (!response.data.deletePost.network.success)
            return alert(response.data.deletePost.network.errors[0].message);
          if (response.data.deletePost.network.success) {
            cache.writeQuery({
              query: Query_getPosts,
              data: {
                getPosts: {
                  ...dataGetPosts.getPosts,
                  data: {
                    ...dataGetPosts.getPosts.data,
                    posts: dataGetPosts.getPosts.data.posts.filter(
                      (each) => each._id != data._id.toString()
                    ),
                  },
                },
              },
            });
          }
        },
      });
  };
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', position: 'relative' }}>
        {dataMe?.me?.data && dataMe?.me?.data?.id.toString() !== data.userId.toString() ? (
          <Box
            sx={{
              position: 'absolute',
              top: '1.5em',
              left: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowCircleUpRoundedIcon
              sx={{
                cursor: 'pointer',
                fontSize: '2.5em',
                borderRadius: '50%',
                background:
                  !loadingUserVoted &&
                  dataUserVoted?.checkPostVotedFromUser?.data &&
                  dataUserVoted?.checkPostVotedFromUser?.data.voteValue == 1
                    ? theme.palette.upvoteButton.main
                    : null,
                '&:hover': {
                  color:
                    !loadingUserVoted &&
                    dataUserVoted?.checkPostVotedFromUser?.data &&
                    dataUserVoted?.checkPostVotedFromUser?.data.voteValue == 1
                      ? null
                      : theme.palette.upvoteButton.main,
                },
              }}
              onClick={() => handleVote(1)}
            />
            <b>{data.points}</b>
            <ArrowCircleDownRoundedIcon
              sx={{
                cursor: 'pointer',
                fontSize: '2.5em',
                borderRadius: '50%',
                background:
                  !loadingUserVoted &&
                  dataUserVoted?.checkPostVotedFromUser?.data &&
                  dataUserVoted?.checkPostVotedFromUser?.data.voteValue == -1
                    ? theme.palette.downvoteButton.main
                    : null,
                '&:hover': {
                  color:
                    !loadingUserVoted &&
                    dataUserVoted?.checkPostVotedFromUser?.data &&
                    dataUserVoted?.checkPostVotedFromUser?.data.voteValue == -1
                      ? null
                      : theme.palette.downvoteButton.main,
                },
              }}
              onClick={() => handleVote(-1)}
            />
          </Box>
        ) : (
          <Box></Box>
        )}
        <NextLink href={`/post/${data._id}/detail`}>
          <Box
            sx={{
              minWidth: '50%',
              minHeight: '150px',
              padding: '1em',
              margin: '1em 0 1em 3em',
              '&:hover': {
                background: '#f4f4f4',
                cursor: 'pointer',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1em',
              }}
            >
              <h3>{data.title}</h3>{' '}
              {dataMe?.me?.data && dataMe?.me?.data?.id.toString() == data.userId.toString() && (
                <DeleteIcon
                  sx={{
                    color: 'red',
                    cursor: 'pointer',
                  }}
                  onClick={!loadingDeletePost ? handleDeletePost : null}
                />
              )}
              {dataMe?.me?.data && dataMe?.me?.data?.id.toString() == data.userId.toString() && (
                <NextLink href={`/account/editPost/${data._id}`}>
                  <EditIcon
                    sx={{
                      color: 'green',
                      cursor: 'pointer',
                    }}
                  />
                </NextLink>
              )}
            </Box>
            <Box>
              {commentMode ? (
                <Button
                  sx={{
                    color: 'white',
                    background: 'black',
                    maxHeight: '1.5em',
                    fontSize: '.8em',
                    padding: 1,
                    '&.MuiButtonBase-root:hover': {
                      bgcolor: theme.palette.upvoteButton.main,
                    },
                  }}
                  onClick={() => setCommentMode(!commentMode)}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  sx={{
                    color: 'white',
                    background: 'black',
                    maxHeight: '1.5em',
                    fontSize: '.8em',
                    padding: 1,
                    '&.MuiButtonBase-root:hover': {
                      bgcolor: theme.palette.upvoteButton.main,
                    },
                  }}
                  onClick={() => setCommentMode(!commentMode)}
                >
                  Comment
                </Button>
              )}
            </Box>
            {commentMode && (
              <InputComment
                setCommentMode={setCommentMode}
                dataGetPosts={dataGetPosts}
                post={data}
                dataMe={dataMe}
              />
            )}
            {!query.detail && `${data.comments.length} comments`}
            {query.detail ? (
              <Comments
                post={data}
                dataGetPosts={dataGetPosts}
                dataMe={dataMe}
                loadingVoteComment={loadingVoteComment}
                voteComment={voteComment}
              />
            ) : null}
          </Box>
        </NextLink>
      </Box>
    </ThemeProvider>
  );
};

export default Post;
