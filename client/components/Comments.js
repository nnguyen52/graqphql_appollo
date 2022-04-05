import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import DisplayComments from './DisplayComments';

// display 2 latest comments
const Comments = ({
  post,
  loadingDataGetPosts,
  dataGetPosts,
  loadingMe,
  dataMe,
  loadingVoteComment,
  voteComment,
}) => {
  // root comments is comments that have no reply (and latest based on createdAt)
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [formattedComments, setFormattedComments] = useState([]);
  const [next, setNext] = useState(2);
  const [showComments, setShowComments] = useState([]);

  useEffect(() => {
    console.log('run2');
    if (!post) return;
    setComments(post.comments.filter((each) => each.postId == post._id && !each.reply));
    setReplies(post.comments.filter((each) => each.postId == post._id && each.reply));
  }, [post]);

  useEffect(() => {
    console.log('run2');
    if (!replies || !comments) return;
    let formattedCmts = [];
    for (let i = 0; i < comments.length; i++) formattedCmts.push(comments[i]);
    for (let i = 0; i < formattedCmts.length; i++)
      formattedCmts[i] = recursiveBuildComment(formattedCmts[i]);
    setFormattedComments((prev) => formattedCmts);
  }, [comments, replies, post]);

  // control slice more comments
  useEffect(() => {
    console.log('run2');

    if (!formattedComments) return;
    setShowComments(formattedComments.slice(0, next));
  }, [post.comments, formattedComments, next]);

  const recursiveBuildComment = (comment) => {
    const repliesForThisCmt = replies.filter((each) => each.reply._id == comment._id);
    if (!repliesForThisCmt) return comment;
    return {
      ...comment,
      replies: repliesForThisCmt.map((each) => recursiveBuildComment(each)),
    };
  };
  return (
    <Box
      style={{
        paddingBottom: comments.legnth > 0 || replies.length > 0 ? '.5em' : 0,
      }}
    >
      {showComments.map((each, index) => {
        return (
          <DisplayComments
            comment={each}
            key={index}
            post={post}
            comments={comments}
            loadingDataGetPosts={loadingDataGetPosts}
            dataGetPosts={dataGetPosts}
            loadingMe={loadingMe}
            dataMe={dataMe}
            loadingVoteComment={loadingVoteComment}
            voteComment={voteComment}
          />
        );
      })}
      {comments.length - next > 0 ? (
        <Button onClick={() => setNext((prev) => prev + 10)}> See more comments</Button>
      ) : (
        comments.length > 2 && (
          <Button onClick={() => setNext((prev) => prev - 10)}>Hide comment</Button>
        )
      )}
    </Box>
  );
};

export default Comments;
