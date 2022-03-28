import React, { useState } from 'react';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InputComment from './InputComment';
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
    </>
  );
};

export default CommentMenu;
