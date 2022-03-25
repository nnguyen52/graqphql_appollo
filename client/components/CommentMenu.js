import React from 'react';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
const CommentMenu = ({
  comment,
  loadingDataGetPosts,
  dataGetPosts,
  loadingMe,
  dataMe,
  loadingVoteComment,
  voteComment,
}) => {
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
        //   console.log('after vote comment:', response);
        // },
      });
    } catch (e) {
      console.log('vote error:', e);
    }
  };
  return (
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
      >
        Reply{' '}
      </LoadingButton>
    </Box>
  );
};

export default CommentMenu;
