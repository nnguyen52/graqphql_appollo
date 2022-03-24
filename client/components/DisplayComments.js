import React, { useState, useEffect } from 'react';
import Comment from './Comment';

const DisplayComments = ({ comment, post }) => {
  let rootPaddingLeft = 10;
  const [repliesForThisComment, setRepliesForThisComment] = useState([]);
  useEffect(() => {
    if (!comment || !post) return;
    setRepliesForThisComment(comment.replies ? comment.replies : []);
  }, [comment, post]);

  return (
    <>
      <Comment comment={comment} post={post}>
        {/* children is its reply */}
        <div style={{ paddingLeft: `${rootPaddingLeft}px` }}>
          {repliesForThisComment.length > 0 &&
            repliesForThisComment.map((each, index) => {
              return <DisplayComments key={index} comment={each} post={post} />;
            })}
          {/* {replyCm.length - next > 0 ? (
            <div onClick={() => setNext(next + 10)}>See more replies...</div>
          ) : (
            showRep.length > 1 && <div onClick={() => setNext(1)}>Hide replies.</div>
          )} */}
        </div>
      </Comment>
    </>
  );
};

export default DisplayComments;
