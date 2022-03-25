import React, { useState } from 'react';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InputComment from './InputComment';
const CommentMenu = ({
  comment,
  loadingDataGetPosts,
  dataGetPosts,
  loadingMe,
  dataMe,
  loadingVoteComment,
  voteComment,
}) => {
  const [replyMode, setReplyMode] = useState(false);
  const [commentTarget, setCommentTarget] = useState(null);
  const handleVote = async (comment, value) => {
    try {
      if (!loadingMe && (!dataMe?.me?.data || !dataMe.me)) {
        return alert('Please login to vote comment!');
      }
      await voteComment({
        variables: {
          commentId: comment._id.toString(),
          voteValue: value,
        },
        // update(cache, response) {
        // },
      });
    } catch (e) {
      console.log('vote error:', e);
    }
  };
  const handleReply = (comment) => {
    if (!loadingMe && (!dataMe?.me?.data || !dataMe.me)) {
      return alert('Please login to vote comment!');
    }
    setReplyMode(true);
    setCommentTarget(comment);
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
          Reply
        </LoadingButton>
      </Box>
      {replyMode && (
        <InputComment
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
