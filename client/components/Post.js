import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
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
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Slider from 'react-slick';
import Image from 'next/image';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const PostResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.postContainer': {
      padding: 0,
      width: '100%',
    },
    '.postContainerFullHeight': {
      height: '85vh',
    },
    '.postContainer .postMenu': {
      position: 'absolute',
      top: 0,
      right: 0,
      margin: 0,
      padding: '.5em',
    },
    '.postContainer .postVoting': {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    '.postContainer .postVoting > *': {
      fontSize: '85%',
      width: 'fit-content',
    },
    '.postContainer .postMainContainer': {
      width: '100%',
      margin: '0 .5em 0 .5em',
    },
    '.postContainer .postMainContainerDetail': {
      margin: 0,
      marginLeft: '2.5em',
    },
    '.postContainer .commentsContainer': {
      minHeight: '50vh',
      overflow: 'auto',
    },
    '.hideComments': {
      display: 'none',
    },
    '.postContainerBordered': {
      border: '1px solid grey',
      borderRadius: '3px',
    },
    '.postContainerMargin': {
      marginTop: '.5em',
      marginBottom: '.5em',
    },
    '.postMenu': {
      left: 0,
      top: 0,
      padding: 0,
      margin: 0,
    },
    '.postMenu > button': {
      fontSize: '10px',
    },
    '.postMenu > .commentsIcon': {
      display: 'none',
    },
    '.postContainer': {
      width: '100%',
      paddingLeft: '1em',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.postContainerFullHeight': {
      // height: '85vh',
    },
    '.postContainer': {
      marginTop: '.5em',
      marginBottom: '.5em',
    },
    '.postMainContainer': {
      marginLeft: '15%',
    },
    '.postMainContainerContent': {
      border: '1px solid grey',
      borderRadius: '3px',
    },
    '.hideComments': {
      display: 'none',
    },
    '.postContainer .commentsContainer': {
      minHeight: '50vh',
      overflow: 'auto',
    },
    '.postContainerMargin': {
      marginTop: '.5em',
      marginBottom: '.5em',
    },
  },
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));

const Post = ({ data, detail }) => {
  const dataGetPosts = useQuery(Query_getPosts);
  const { data: dataMe, refetch: refetchMe } = useQuery(Query_me);
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
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const handleVote = async (value) => {
    try {
      if (!dataMe?.me?.data || !dataMe.me) {
        return alert('Please l  ogin to vote posts!');
      }
      await vote({
        variables: { postId: data._id, voteValue: value },
        update(cache, response) {
          if (!response.data.vote.network.success) {
            refetchMe();
            return alert(response.data.vote.network.errors[0].message);
          }
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
      console.log('out errors', e);
    }
  };
  const handleDeletePost = async () => {
    if (confirm('You are about to delete post. Are you sure?'))
      await deletePost({
        variables: {
          id: data._id.toString(),
        },
        update(cache, response) {
          if (!response.data.deletePost.network.success) {
            refetchMe();
            return alert(response.data.deletePost.network.errors[0].message);
          }
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
      <PostResponsive>
        <ThemeProvider theme={theme}>
          <Box
            className={`postContainer ${detail ? 'postContainerFullHeight' : null} ${
              !detail ? 'postContainerMargin' : null
            }`}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'row',
              width: '65%',
            }}
          >
            <Box
              className='postVoting'
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
                <></>
              )}
            </Box>
            {/* main - 80% */}
            <Box
              className={`postMainContainer ${
                dataMe?.me?.data ? 'postMainContainerDetail' : null
              } ${!detail ? 'postContainerBordered' : null}`}
              sx={{
                width: '85%',
                display: 'flex',
              }}
            >
              {/* content - 80% */}
              <Box
                className='postMainContainerContent'
                sx={{
                  width: '100%',
                  borderRadius: '5px',
                }}
              >
                <NextLink href={`/post/${data?._id}/detail`}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '150px',
                      height: '100%',
                      '&:hover': !detail
                        ? {
                            background: '#f4f4f4',
                            cursor: 'pointer',
                          }
                        : null,
                    }}
                  >
                    {/* title + content */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        overflow: 'auto',
                      }}
                    >
                      <Box
                        className='textContent'
                        sx={{
                          position: 'relative',
                          padding: '1em',
                          flex: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <h3>{data?.title}</h3>
                          {/* cover */}
                          {!detail && data?.imageCover && (
                            <Box
                              sx={{
                                position: 'relative',
                                height: '300px',
                                width: '100%',
                              }}
                            >
                              <Image
                                layout='fill'
                                objectFit='contain'
                                src={`https://res.cloudinary.com/cloudinarystore/image/upload/v1649313101/${data.imageCover}.jpg`}
                              />
                            </Box>
                          )}
                          {/* detail content */}
                          {detail && <div dangerouslySetInnerHTML={{ __html: data.content }} />}
                        </Box>
                      </Box>
                      {!detail && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '.2em',
                            padding: '.5em',
                          }}
                        >
                          <b>
                            {data.points} {data.points > 1 ? 'Upvotes' : 'Upvote'}
                          </b>
                          <ChatBubbleOutlineIcon />
                          <b>
                            {data.comments.length}{' '}
                            {data.comments.length > 1 ? `Comments` : `Comment`}
                          </b>
                        </Box>
                      )}
                    </Box>
                    {/* input */}
                    {detail && (
                      <Box>
                        <InputComment
                          dataGetPosts={dataGetPosts.data}
                          post={data}
                          dataMe={dataMe}
                        />
                      </Box>
                    )}
                    {/* comments */}
                    {detail ? (
                      <Box
                        className={`commentsContainer ${
                          !detail || data?.comments.length <= 0 ? 'hideComments' : null
                        }`}
                        sx={{
                          flex: 2,
                        }}
                      >
                        <Comments
                          post={data}
                          dataGetPosts={dataGetPosts.data}
                          dataMe={dataMe}
                          loadingVoteComment={loadingVoteComment}
                          voteComment={voteComment}
                        />
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                </NextLink>
              </Box>
              {/* menu - 20% */}
              <Box
                className='postMenu'
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
                <Box className='commentsIcon' sx={{ position: 'relative', display: 'flex' }}>
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
      </PostResponsive>
    </>
  );
};

export default Post;
