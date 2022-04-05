import React, { useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { LoadingButton } from '@mui/lab';
import Comments from './Comments';
import { Mutation_voteComment } from '../graphql-client/mutations/voteComment';
import InputComment from './InputComment';
import { Box, Button, Card } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Mutation_deletePost } from '../graphql-client/mutations/deletePost';
import NextLink from 'next/link';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import { Query_checkPostVotedFromUser } from '../graphql-client/queries/checkPostVotedFromUser';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
const Post = ({ data, detail }) => {
  const dataGetPosts = useQuery(Query_getPosts);
  const { data: dataMe } = useQuery(Query_me);
  const [vote, { loading }] = useMutation(Mutation_vote);
  const [voteComment, { loading: loadingVoteComment }] = useMutation(Mutation_voteComment);
  const [deletePost, { loading: loadingDeletePost }] = useMutation(Mutation_deletePost);
  const {
    data: dataUserVoted,
    loading: loadingUserVoted,
    refetch,
  } = useQuery(Query_checkPostVotedFromUser, {
    variables: {
      postId: data?._id.toString(),
    },
  });
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
                  ...dataGetPosts.data.getPosts,
                  data: {
                    ...dataGetPosts.data.getPosts.data,
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
                  ...dataGetPosts.data.getPosts,
                  data: {
                    ...dataGetPosts.data.getPosts.data,
                    posts: dataGetPosts.data.getPosts.data.posts.filter(
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
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            width: '65%',
            margin: '1em',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '15%',
              height: '100%',
            }}
          >
            {dataMe?.me?.data && dataMe?.me?.data?.id.toString() !== data?.userId.toString() ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'end',
                  paddingRight: '1em',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                  <b
                    style={{
                      color:
                        data?.points >= 0
                          ? theme.palette.upvoteButton.main
                          : theme.palette.downvoteButton.main,
                    }}
                  >
                    {data?.points}
                  </b>
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
              </Box>
            ) : (
              <Box></Box>
            )}
          </Box>
          {/* main - 80% */}
          <Box
            sx={{
              marginLeft: '15%',
              width: '85%',
              display: 'flex',
            }}
          >
            {/* content - 80% */}
            <Box
              component='div'
              sx={{
                width: '100%',
                border: '1px solid black',
                borderRadius: '5px',
              }}
            >
              <NextLink href={`/post/${data?._id}/detail`}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '150px',
                    '&:hover': !detail
                      ? {
                          background: '#f4f4f4',
                          cursor: 'pointer',
                        }
                      : null,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: data.comments.length > 0 ? null : 1,
                      padding: '1em',
                    }}
                  >
                    <h3>{data?.title}</h3>
                    <p>{data?.content}</p>
                  </Box>
                  {detail && (
                    <InputComment dataGetPosts={dataGetPosts.data} post={data} dataMe={dataMe} />
                  )}
                  {detail ? (
                    <Comments
                      post={data}
                      dataGetPosts={dataGetPosts.data}
                      dataMe={dataMe}
                      loadingVoteComment={loadingVoteComment}
                      voteComment={voteComment}
                    />
                  ) : null}
                </Card>
              </NextLink>
            </Box>
            {/* menu - 20% */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1em',
                gap: '.3em',
              }}
            >
              {dataMe?.me?.data && dataMe?.me?.data?.id.toString() == data?.userId.toString() && (
                <Button
                  variant='contained'
                  sx={{
                    padding: '5px',
                    minWidth: '4em',
                    width: 'fit-content',
                    color: 'white',
                    background: '#bc074c',
                    '&:hover': {
                      color: 'white',
                      background: 'crimson',
                    },
                  }}
                >
                  <DeleteIcon
                    sx={{
                      color: 'white',
                      cursor: 'pointer',
                      margin: 0,
                    }}
                    onClick={!loadingDeletePost ? handleDeletePost : null}
                  />
                </Button>
              )}
              {dataMe?.me?.data && dataMe?.me?.data?.id.toString() == data?.userId.toString() && (
                <NextLink href={`/account/editPost/${data._id}`}>
                  <Button
                    variant='contained'
                    sx={{
                      padding: '5px',
                      minWidth: '4em',
                      width: 'fit-content',
                      color: 'white',
                      background: 'green',
                      '&:hover': {
                        color: 'white',
                        background: '#24d645',
                      },
                    }}
                  >
                    <EditIcon
                      sx={{
                        color: 'white',
                        cursor: 'pointer',
                      }}
                    />
                  </Button>
                </NextLink>
              )}
              <Box sx={{ position: 'relative', display: 'flex' }}>
                <NextLink href={`/post/${data._id.toString()}/detail`}>
                  <Button
                    sx={{
                      minWidth: '4em',
                      width: 'fit-content',
                      background: 'black',
                      color: theme.palette.upvoteButton.main,
                      '&:hover': {
                        background: '#353535',
                      },
                    }}
                  >
                    <ChatBubbleOutlineIcon />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 0,
                        borderRadius: '50%',
                        height: 'fit-content',
                        padding: '0 5px 0 5px',
                        position: 'absolute',
                        right: '-15%',
                        bottom: '-30%',
                        background: 'crimson',
                        color: 'white',
                      }}
                    >
                      <b
                        style={{
                          padding: 0,
                        }}
                      >
                        {data.comments.length}
                      </b>
                    </Box>
                  </Button>
                </NextLink>
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Post;
