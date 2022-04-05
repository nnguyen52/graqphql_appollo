import React from 'react';
import { Box } from '@mui/material';

const Comment = ({ children, comment, rootPaddingLeft }) => {
  return (
    <>
      <Box
        sx={{
          paddingLeft: `${3 * rootPaddingLeft}em`,
        }}
      >
        {comment.content}
        {children}
      </Box>
    </>
  );
};

export default Comment;
