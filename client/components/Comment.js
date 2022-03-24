import React from 'react';

const Comment = ({ children, comment, post, commentId }) => {
  return (
    <div>
      {comment.content}
      {children}
    </div>
  );
};

export default Comment;
