import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { Button } from '@mui/material';
const DisplayComments = ({ comment, post }) => {
  let rootPaddingLeft = 10;
  const [repliesForThisComment, setRepliesForThisComment] = useState([]);
  const [showReplies, setShowReplies] = useState([]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    if (!comment || !post) return;
    setRepliesForThisComment(comment.replies ? comment.replies : []);
  }, [comment, post]);

  useEffect(() => {
    if (!repliesForThisComment) return;
    setShowReplies(repliesForThisComment.slice(0, next));
  }, [repliesForThisComment, showReplies, next]);

  return (
    <>
      <Comment comment={comment} post={post}>
        {/* children is its reply */}
        <div style={{ paddingLeft: `${rootPaddingLeft}px` }}>
          {showReplies.length > 0 &&
            showReplies.map((each, index) => {
              return <DisplayComments key={index} comment={each} post={post} />;
            })}
          {repliesForThisComment.length - next > 0 ? (
            <Button onClick={() => setNext(next + 10)}>See more replies...</Button>
          ) : (
            repliesForThisComment.length > 1 && (
              <Button onClick={() => setNext(1)}>Hide replies.</Button>
            )
          )}
        </div>
      </Comment>
    </>
  );
};

export default DisplayComments;
