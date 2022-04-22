import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
import Comments from './Comments';
import { Mutation_voteComment } from '../graphql-client/mutations/voteComment';
import InputComment from './InputComment';
import { Avatar, Box, Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Mutation_deletePost } from '../graphql-client/mutations/deletePost';
import NextLink from 'next/link';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import { Query_checkPostVotedFromUser } from '../graphql-client/queries/checkPostVotedFromUser';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ShareIcon from '@mui/icons-material/Share';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ShareButtons from './ShareButtons';
import Image from 'next/image';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';
import { handleSavePost, handleUnsavePost } from '../src/utils/savePost_unsavePost';
import { Mutation_savePost } from '../graphql-client/mutations/savePost';
import { Mutation_unsavePost } from '../graphql-client/mutations/unsavePost';
import { Mutation_hidePost } from '../graphql-client/mutations/hidePost';
import { Query_getHideposts } from '../graphql-client/queries/getHidePosts';
import { dateFormat } from '../src/utils/dateFormat';

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
    '.postContainer .postMainContainer .postMainContainerContent .menu > *': {
      padding: '.8em',
    },
    '.postContainer .postMainContainer .postMainContainerContent .menu > *:hover': {
      background: `rgba(0,0,0,.08)`,
    },
  },
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));

const Post = ({
  data,
  detail,
  dataGetPosts,
  refetchGetPosts,
  loadingPosts,
  dataMe,
  loadingMe,
  refetchMe,
  dataSaveposts,
  loadingDataSaveposts,
  refetchHidePosts,
  refetchSavePosts,
  refetchGetPostsUserUpVoted,
  refetchGetPostsUserDownVoted,
  refetchGetCommentsFromUser,
  refetchGetPostsFromUser,
}) => {
  const [vote, { loading }] = useMutation(Mutation_vote);
  const [voteComment, { loading: loadingVoteComment }] = useMutation(Mutation_voteComment);
  const handleVote = async (value) => {
    try {
      if (!dataMe?.me?.data || !dataMe.me) {
        return alert('Please login to vote posts!');
      }
      await vote({
        variables: { postId: data._id, voteValue: value },
        update(cache, response) {
          if (!response.data.vote.network.success) {
            refetchMe();
            return alert(response.data.vote.network.errors[0].message);
          }
          if (response.data.vote.network.success) {
            refetchGetPosts();
            refetchGetPostsFromUser();
            refetchGetPostsUserUpVoted();
            refetchGetPostsUserDownVoted();
            refetchHidePosts();
            refetchSavePosts();
            refetchCheckPostVotedFromUser();
          }
        },
      }).catch((e) => console.log(e));
    } catch (e) {
      console.log('out errors', e);
    }
  };
  // delete post
  const [deletePost, { loading: loadingDeletePost }] = useMutation(Mutation_deletePost);
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
          // remove from cache
          if (response.data.deletePost.network.success) {
            refetchGetPosts();
            refetchGetPostsFromUser();
            refetchGetCommentsFromUser();
            refetchGetPostsUserUpVoted();
            refetchGetPostsUserDownVoted();
            refetchHidePosts();
            refetchSavePosts();
            // cache.writeQuery({
            //   query: Query_getPosts,
            //   data: {
            //     getPosts: {
            //       ...dataGetPosts.getPosts,
            //       data: {
            //         ...dataGetPosts.getPosts.data,
            //         posts: dataGetPosts.getPosts.data.posts.filter(
            //           (each) => each._id != data._id.toString()
            //         ),
            //       },
            //     },
            //   },
            // });
          }
        },
      });
  };
  const [savePost] = useMutation(Mutation_savePost);
  const [unsavePost] = useMutation(Mutation_unsavePost);
  // voted post
  const {
    data: dataUserVoted,
    loading: loadingUserVoted,
    refetch: refetchCheckPostVotedFromUser,
  } = useQuery(Query_checkPostVotedFromUser, {
    variables: {
      postId: data?._id.toString(),
    },
  });
  // hide post
  const [hidePost, { loading: loadingHidePost }] = useMutation(Mutation_hidePost);
  const [hidePostResult, setHidePostResult] = useState(null);
  // NOTE: hide post affect all other tabs (exclude comment tab)
  // -> must refetch posts+saved+upvoted+downvoted tabs
  const handleHidePost = async () => {
    // refetchGetPosts;
    await hidePost({
      variables: {
        id: data._id.toString(),
      },
      update(cache, { data }) {
        if (!data?.hidePost?.network?.success) {
          refetchMe();
          // toastify later
          return;
        }
        refetchGetPosts();
        refetchHidePosts();
        // no need get savePosts
        refetchGetPostsUserUpVoted();
        refetchGetPostsUserDownVoted();
        refetchGetCommentsFromUser();
        refetchGetPostsFromUser();
      },
    });
  };

  // others
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [openShareBox, setOpenShareBox] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);

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
              {dataMe?.me?.data && dataMe?.me?.data?._id.toString() !== data?.userId.toString() ? (
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
                width: '100%',
                display: 'flex',
              }}
            >
              {/* content - 80% */}
              <Box
                className='postMainContainerContent'
                sx={{
                  width: '100%',
                  borderRadius: '5px',
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
                <Box
                  sx={{ padding: '.5em', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}
                >
                  Posted by
                  <Box
                    sx={{
                      fontWeight: 'bold',
                      '&:hover': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      },
                      padding: '0 .2em 0 .2em',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {data.user.userName}
                  </Box>
                  <Avatar src={data.user.avatar} />
                  &nbsp; - {dateFormat(data.createdAt.toString())}
                </Box>
                <NextLink href={`/post/${data?._id}/detail`}>
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
                              marginTop: '1em',
                              marginBottom: '1em',
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
                        {isExpanding && <div dangerouslySetInnerHTML={{ __html: data.content }} />}
                      </Box>
                    </Box>
                  </Box>
                </NextLink>
                {/* menu  */}
                <Box
                  className='menu'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    '&:hover': {
                      borderTop: '1px solid grey',
                    },
                  }}
                >
                  {/* expanding */}
                  <Box onClick={() => setIsExpanding((prev) => !prev)}>
                    <OpenInFullIcon />
                  </Box>
                  {/* upvotes info only */}
                  <Box>
                    <b>
                      {data.points} {data.points > 1 ? 'Upvotes' : 'Upvote'}
                    </b>
                  </Box>
                  {/* comments info only */}
                  <Box className='centerItemsVertical'>
                    <ChatBubbleOutlineIcon />
                    <b>
                      {data.comments.length} {data.comments.length > 1 ? `Comments` : `Comment`}
                    </b>
                  </Box>
                  {/* share */}
                  <Box
                    className='centerItemsVertical'
                    onClick={() => setOpenShareBox((prev) => !prev)}
                  >
                    <ShareIcon />
                    <b> Share</b>
                  </Box>
                  {/* save-unsave */}
                  <Box
                    onClick={async () =>
                      dataSaveposts?.getSavePosts &&
                      !dataSaveposts?.getSavePosts?.data?.posts
                        .map((each) => each._id)
                        .includes(data._id.toString())
                        ? await handleSavePost({
                            loadingMe,
                            dataMe,
                            refetchMe,
                            savePost,
                            dataSaveposts,
                            each: data,
                          })
                        : await handleUnsavePost({
                            loadingMe,
                            dataMe,
                            refetchMe,
                            unsavePost,
                            dataSaveposts,
                            each: data,
                          })
                    }
                  >
                    {/* <LoadingButton> */}
                    {dataSaveposts?.getSavePosts &&
                      !dataSaveposts?.getSavePosts?.data?.posts
                        .map((each) => each._id)
                        .includes(data._id.toString()) && (
                        <Box className='centerItemsVertical'>
                          <BookmarkAddIcon /> <b> Save</b>
                        </Box>
                      )}
                    {dataSaveposts?.getSavePosts &&
                      dataSaveposts?.getSavePosts?.data?.posts
                        .map((each) => each._id)
                        .includes(data._id.toString()) && (
                        <Box className='centerItemsVertical'>
                          <BookmarkRemoveIcon />
                          <b>Unsave</b>
                        </Box>
                      )}
                    {/* </LoadingButton> */}
                  </Box>
                  {/* hide */}
                  {dataMe?.me?.data && (
                    <Box className='centerItemsVertical' onClick={handleHidePost}>
                      <VisibilityOffIcon />
                      <b> Hide</b>
                    </Box>
                  )}
                  {/* <Edit -Delete */}
                  {dataMe?.me?.data && dataMe?.me?.data?._id.toString() == data?.userId.toString() && (
                    <NextLink href={`/account/editPost/${data._id}`}>
                      <Box sx={{ display: 'flex' }}>
                        <EditIcon /> <b> Edit </b>
                      </Box>
                    </NextLink>
                  )}
                  {dataMe?.me?.data && dataMe?.me?.data?._id.toString() == data?.userId.toString() && (
                    <Box
                      sx={{ display: 'flex' }}
                      onClick={!loadingDeletePost ? handleDeletePost : null}
                    >
                      <DeleteIcon /> <b>Delete</b>
                    </Box>
                  )}
                </Box>
                {openShareBox && (
                  <Box>
                    <ShareButtons />
                  </Box>
                )}
                {detail && (
                  <Box>
                    <InputComment dataGetPosts={dataGetPosts} post={data} dataMe={dataMe} />
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
                      dataGetPosts={dataGetPosts}
                      dataMe={dataMe}
                      loadingVoteComment={loadingVoteComment}
                      voteComment={voteComment}
                    />
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </PostResponsive>
    </>
  );
};

export default Post;
