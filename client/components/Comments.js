import * as objTraverse from 'obj-traverse/lib/obj-traverse';
import React, { useState, useEffect } from 'react';
import DisplayComments from './DisplayComments';
// display 2 latest comments
const Comments = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [formattedComments, setFormattedComments] = useState([]);
  let testFormmated = [];
  useEffect(() => {
    if (!post) return;
    setComments(post.comments.filter((each) => each.postId == post._id && !each.reply));
    setReplies(post.comments.filter((each) => each.postId == post._id && each.reply));
  }, [post]);

  const recursiveBuildComment = (comment) => {
    const repliesForThisCmt = replies.filter((each) => each.reply._id == comment._id);
    if (!repliesForThisCmt) return comment;
    return {
      ...comment,
      replies: repliesForThisCmt.map((each) => recursiveBuildComment(each)),
    };
  };
  useEffect(() => {
    if (!replies || !comments) return;
    for (let i = 0; i < comments.length; i++) testFormmated.push(comments[i]);
    for (let i = 0; i < testFormmated.length; i++)
      testFormmated[i] = recursiveBuildComment(testFormmated[i]);
    setFormattedComments(testFormmated);
  }, [comments, replies, post]);
  return (
    <div>
      {formattedComments.map((each, index) => {
        return <DisplayComments comment={each} key={index} post={post} comments={comments} />;
      })}
      {/* {comments.length - next > 0 ? (
        <Button onClick={() => setNext((prev) => prev + 10)}> See more comments</Button>
      ) : (
        comments.length > 2 && <Button>Hide comment</Button>
      )} */}
    </div>
  );
};

export default Comments;
