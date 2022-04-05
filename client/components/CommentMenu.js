import React, { useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import InputComment from './InputComment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useQuery, useMutation } from '@apollo/client';
import { Mutation_deleteComment } from '../graphql-client/mutations/deleteComment';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Mutation_editComment } from '../graphql-client/mutations/editComment';
import { Formik, Form } from 'formik';
import InputField from './InputField';
import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded';
import ArrowCircleDownRoundedIcon from '@mui/icons-material/ArrowCircleDownRounded';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
import { Query_checkCommentVotedFromUser } from '../graphql-client/queries/checkCommentVotedFromUser';
import { Query_me } from '../graphql-client/queries/user';
import { styled } from '@mui/material/styles';

const CommentMenuResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.editPostContainer': {
      flexDirection: 'column',
      background: '#f2efea',
      padding: '.1em',
      borderRadius: '5px',
    },
    '.editPostContainer button ': {
      background: 'white',
    },
  },
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));
const CommentMenu = ({
  post,
  comment,
  loadingDataGetPosts,
  dataGetPosts,
  loadingMe,
  dataMe,
  loadingVoteComment,
  voteComment,
}) => {
  const { refetch: refetchMe } = useQuery(Query_me);
  const [replyMode, setReplyMode] = useState(false);
  const [deleteComment, { loading: loadingDeleteComment }] = useMutation(Mutation_deleteComment);
  const [updateComment, { loading: loadingEditComment }] = useMutation(Mutation_editComment);
  const [isEditing, setIsEditing] = useState(false);
  const initialValues = {
    content: comment.content,
  };

  const [messageResult, setMessageResult] = useState({
    severity: 'error',
    message: null,
  });

  const {
    data: datacheckCommentVotedFromUser,
    loading: loadingCheckCommentVotedFromUser,
    refetch,
  } = useQuery(Query_checkCommentVotedFromUser, {
    variables: {
      commentId: comment._id.toString(),
    },
  });
  useEffect(() => {
    console.log('run1');
    if (!messageResult.message) return;
    setTimeout(
      () =>
        setMessageResult({
          severity: 'error',
          message: null,
        }),
      3000
    );
  }, [messageResult]);
  const handleVote = async (comment, value) => {
    try {
      if (!loadingMe && !dataMe?.me?.data) {
        return alert('Please login to vote comment!');
      }
      await voteComment({
        variables: {
          postId: post._id.toString(),
          commentId: comment._id.toString(),
          voteValue: value,
        },
        update(cache, { data }) {
          if (!data?.voteComment?.network?.success) {
            refetchMe();
            refetch();
            return alert(data?.voteComment?.network?.errors[0].message);
          }
          refetch();
        },
      });
    } catch (e) {
      console.log('vote error:', e);
    }
  };
  const handleReply = () => {
    if (!loadingMe && (!dataMe?.me?.data || !dataMe.me)) {
      return alert('Please login to vote comment!');
    }
    if (isEditing) setIsEditing(false);
    setReplyMode(!replyMode);
  };
  const handleDeleteComment = async () => {
    if (loadingDeleteComment) return;
    if (confirm('You are about to delete comment, are you sure?'))
      await deleteComment({
        variables: {
          commentId: comment._id.toString(),
        },
        update(cache, { data }) {
          if (!data?.deleteComment?.network?.success) {
            refetchMe();
            return setMessageResult({
              severity: 'error',
              message: data.deleteComment.network.errors[0].message,
            });
          }
          let modifiedPosts = dataGetPosts.getPosts.data.posts;
          modifiedPosts = modifiedPosts.map((eachPost) => {
            if (eachPost._id.toString() == post._id.toString()) {
              return {
                ...eachPost,
                comments: eachPost.comments.filter(
                  (eachCmt) => eachCmt._id.toString() !== comment._id.toString()
                ),
              };
            } else return eachPost;
          });
          cache.writeQuery({
            query: Query_getPosts,
            data: {
              getPosts: {
                ...dataGetPosts.getPosts,
                data: {
                  ...dataGetPosts.getPosts.data,
                  posts: modifiedPosts,
                },
              },
            },
          });
          setMessageResult({
            severity: 'success',
            message: data.deleteComment.network.message,
          });
          return;
        },
      });
  };
  const handleEditComment = async (values, { setErrors }) => {
    if (values.content == initialValues.content) {
      setIsEditing(false);
      setMessageResult({
        severity: 'error',
        message: null,
      });
      return;
    }
    await updateComment({
      variables: {
        commentId: comment._id.toString(),
        content: values.content,
      },
      update(cache, { data }) {
        if (!data?.updateComment?.network?.success) {
          refetchMe();
          setMessageResult({
            severity: 'error',
            message: data?.updateComment?.network?.errors[0]?.message,
          });
          setIsEditing(false);
          return;
        } else {
          setMessageResult({
            severity: 'success',
            message: data?.updateComment?.network?.message,
          });
          setIsEditing(false);
          return;
        }
      },
    });
  };
  return (
    <>
      <CommentMenuResponsive>
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              display: 'flex',
              marginTop: '.2em',
              flexDirection: 'row',
              flexWrap: 'warp',
              alignItems: 'center',
              gap: '.3em',
            }}
          >
            <ArrowCircleUpRoundedIcon
              sx={{
                borderRadius: '50%',
                cursor: 'pointer',
                background:
                  !loadingCheckCommentVotedFromUser &&
                  datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data &&
                  datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data?.value >= 1
                    ? theme.palette.upvoteButton.main
                    : null,
                '&:hover': {
                  color:
                    !loadingCheckCommentVotedFromUser &&
                    datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data &&
                    datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data?.value >= 1
                      ? null
                      : theme.palette.upvoteButton.main,
                },
              }}
              onClick={() => handleVote(comment, 1)}
            />
            {comment.points}
            <ArrowCircleDownRoundedIcon
              sx={{
                cursor: 'pointer',
                borderRadius: '50%',
                background:
                  !loadingCheckCommentVotedFromUser &&
                  datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data &&
                  datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data?.value <= -1
                    ? theme.palette.downvoteButton.main
                    : null,
                '&:hover': {
                  color:
                    !loadingCheckCommentVotedFromUser &&
                    datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data &&
                    datacheckCommentVotedFromUser?.checkCommentVotedFromUser?.data?.value <= -1
                      ? null
                      : theme.palette.downvoteButton.main,
                },
              }}
              onClick={() => handleVote(comment, -1)}
            />
            <LoadingButton
              loading={loadingDataGetPosts || loadingMe || loadingVoteComment}
              sx={{
                color: 'white',
                background: !replyMode ? 'black' : 'crimson',
                maxHeight: '1.5em',
                fontSize: '.8em',
                padding: 0,
                '&.MuiButtonBase-root:hover': {
                  bgcolor: !replyMode ? theme.palette.upvoteButton.main : 'crimson',
                },
              }}
              onClick={() => handleReply(comment)}
            >
              {replyMode ? (
                'Cancel'
              ) : (
                <Box
                  sx={{
                    fontSize: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}
                >
                  <ChatBubbleIcon
                    sx={{
                      fontSize: '1.2em',
                    }}
                  />
                  Reply
                </Box>
              )}
            </LoadingButton>
            {!messageResult?.message &&
              dataMe?.me?.data &&
              comment.user.id.toString() == dataMe?.me?.data.id.toString() && (
                <DeleteIcon
                  sx={{
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    background: '#bc074c',
                    '&:hover': {
                      color: 'white',
                      background: 'crimson',
                    },
                  }}
                  onClick={loadingDeleteComment ? null : handleDeleteComment}
                />
              )}
            {!messageResult?.message &&
              dataMe?.me?.data &&
              comment.user.id.toString() == dataMe?.me?.data.id.toString() && (
                <EditIcon
                  sx={{
                    color: 'green',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    color: 'white',
                    background: 'green',
                    '&:hover': {
                      color: 'white',
                      background: '#24d645',
                    },
                  }}
                  onClick={() => {
                    if (replyMode) setReplyMode(false);
                    setIsEditing(!isEditing);
                  }}
                />
              )}
          </Box>
          {replyMode && (
            <Box sx={{ paddingTop: '.5em' }}>
              <InputComment
                mode='reply'
                comment={comment}
                loadingMe={loadingMe}
                dataMe={dataMe}
                setReplyMode={setReplyMode}
                loadingDataGetPosts={loadingDataGetPosts}
                dataGetPosts={dataGetPosts}
              />
            </Box>
          )}
          {isEditing && (
            <Box sx={{ paddingTop: '.5em' }}>
              <Formik initialValues={initialValues} onSubmit={handleEditComment}>
                {({ isSubmitting }) => (
                  <Form>
                    <Box
                      className='editPostContainer'
                      sx={{ display: 'flex', gap: '.2em', width: '100%' }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <InputField
                          style={{ width: '100%' }}
                          type='text'
                          textarea
                          defaultValue={initialValues.content}
                          name='content'
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '.2em' }}>
                        <LoadingButton
                          loading={loadingEditComment && isSubmitting}
                          size='small'
                          variant='outlined'
                          color='success'
                          type='submit'
                        >
                          Edit comment
                        </LoadingButton>
                        <Button
                          size='small'
                          color='error'
                          variant='outlined'
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          )}
          {messageResult?.message && (
            <Alert severity={messageResult.severity}>{messageResult.message}</Alert>
          )}
        </ThemeProvider>
      </CommentMenuResponsive>
    </>
  );
};

export default CommentMenu;
