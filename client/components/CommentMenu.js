import React, { useState, useEffect } from 'react';
import { Box, Alert, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InputComment from './InputComment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation } from '@apollo/client';
import { Mutation_deleteComment } from '../graphql-client/mutations/deleteComment';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Mutation_editComment } from '../graphql-client/mutations/editComment';
import { Formik, Form } from 'formik';
import InputField from './InputField';

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

  useEffect(() => {
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
      });
    } catch (e) {
      console.log('vote error:', e);
    }
  };
  const handleReply = () => {
    if (!loadingMe && (!dataMe?.me?.data || !dataMe.me)) {
      return alert('Please login to vote comment!');
    }
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
          if (!data?.deleteComment?.network?.success)
            return setMessageResult({
              severity: 'error',
              message: data.deleteComment.network.errors[0].message,
            });
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'warp',
          alignItems: 'center',
        }}
      >
        <ArrowUpwardIcon onClick={() => handleVote(comment, 1)} />
        {comment.points}
        <ArrowDownwardIcon onClick={() => handleVote(comment, -1)} />
        <LoadingButton
          loading={loadingDataGetPosts || loadingMe || loadingVoteComment}
          sx={{
            color: 'white',
            background: !replyMode ? 'black' : 'crimson',
            maxHeight: '1.5em',
            fontSize: '.8em',
            padding: 0,
            '&.MuiButtonBase-root:hover': {
              bgcolor: !replyMode ? 'orange' : 'crimson',
            },
          }}
          onClick={() => handleReply(comment)}
        >
          {replyMode ? 'Cancel' : 'Reply'}
        </LoadingButton>
        {!messageResult?.message &&
          dataMe?.me?.data &&
          comment.user.id.toString() == dataMe?.me?.data.id.toString() && (
            <DeleteIcon
              sx={{ color: 'red', cursor: 'pointer' }}
              onClick={loadingDeleteComment ? null : handleDeleteComment}
            />
          )}
        {!messageResult?.message &&
          dataMe?.me?.data &&
          comment.user.id.toString() == dataMe?.me?.data.id.toString() && (
            <EditIcon
              sx={{ color: 'green', cursor: 'pointer' }}
              onClick={() => setIsEditing(!isEditing)}
            />
          )}
      </Box>
      {replyMode && (
        <InputComment
          mode='reply'
          comment={comment}
          loadingMe={loadingMe}
          dataMe={dataMe}
          setReplyMode={setReplyMode}
          loadingDataGetPosts={loadingDataGetPosts}
          dataGetPosts={dataGetPosts}
        />
      )}
      {isEditing && (
        <>
          <Formik initialValues={initialValues} onSubmit={handleEditComment}>
            {({ isSubmitting }) => (
              <Form>
                <Box sx={{ display: 'flex', gap: '.2em' }}>
                  <InputField
                    style={{
                      height: '100%',
                    }}
                    type='text'
                    textarea
                    defaultValue={initialValues.content}
                    name='content'
                  />
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
        </>
      )}
      {messageResult?.message && (
        <Alert severity={messageResult.severity}>{messageResult.message}</Alert>
      )}
    </>
  );
};

export default CommentMenu;
