import React from 'react';
const Comment = ({ children, comment }) => {
  return (
    <div>
      {comment.content}
      {children}
    </div>
  );
};

export default Comment;
