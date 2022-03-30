import React, { useState } from 'react';
import { Box, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InputComment from './InputComment';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMutation } from '@apollo/client';
import { Mutation_deleteComment } from '../graphql-client/mutations/deleteComment';
import { Query_getPosts } from '../graphql-client/queries/posts';

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
  const [exceptionErr, setExceptionErr] = useState(null);

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
    if (confirm('You are about to delete comment, are you sure?'))
      await deleteComment({
        variables: {
          commentId: comment._id.toString(),
        },
        update(cache, { data }) {
          if (!data?.deleteComment?.network?.success)
            return setExceptionErr(data.deleteComment.network.errors[0].message);
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
            background: 'black',
            maxHeight: '1.5em',
            fontSize: '.8em',
            padding: 0,
            '&.MuiButtonBase-root:hover': {
              bgcolor: 'orange',
            },
          }}
          onClick={() => handleReply(comment)}
        >
          {replyMode ? 'Cancel' : 'Reply'}
        </LoadingButton>
        {!exceptionErr &&
          dataMe?.me?.data &&
          comment.user.id.toString() == dataMe?.me?.data.id.toString() && (
            <DeleteIcon
              sx={{ color: 'red', cursor: 'pointer' }}
              onClick={loadingDeleteComment ? null : handleDeleteComment}
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
      {exceptionErr && <Alert severity='error'>{exceptionErr}</Alert>}
    </>
  );
};

export default CommentMenu;
