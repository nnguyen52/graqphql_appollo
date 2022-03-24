import React, { useState, useEffect } from 'react';
import Comment from './Comment';

const DisplayComments = ({ comment, post, replies, comments, commentId }) => {
  let rootPaddingLeft = 10;
  const [repliesForThisComment, setRepliesForThisComment] = useState([]);

  useEffect(() => {
    if (!comment || !post || !replies || commentId) return;
    setRepliesForThisComment(
      replies.filter((each) => each.reply._id.toString() == comment._id.toString())
    );
  }, [comment, replies, post, commentId]);

  return (
    <>
      <Comment comment={comment} post={post} commentId={comment._id}>
        {/* children is its reply */}
        <div style={{ paddingLeft: `${rootPaddingLeft}px` }}>
          {repliesForThisComment.map(
            (item, index) =>
              item.reply && (
                <div>
                  <Comment key={index} post={post} comment={item} commentId={comment._id} />
                </div>
              )
          )}
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
