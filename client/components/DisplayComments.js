import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { Button } from '@mui/material';
import CommentMenu from './CommentMenu';
import { useApolloClient } from '@apollo/client';
import { Query_getPosts } from '../graphql-client/queries/posts';

const DisplayComments = ({
  comment,
  post,
  loadingDataGetPosts,
  dataGetPosts,
  loadingMe,
  dataMe,
  loadingVoteComment,
  voteComment,
}) => {
  const client = useApolloClient();
  const posts = client.readQuery({ query: Query_getPosts });
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
  }, [repliesForThisComment, next]);
  return (
    <>
      <Comment comment={comment} post={post}>
        {/* children is its reply */}
        <CommentMenu
          post={post}
          comment={comment}
          loadingDataGetPosts={loadingDataGetPosts}
          dataGetPosts={dataGetPosts}
          loadingMe={loadingMe}
          dataMe={dataMe}
          loadingVoteComment={loadingVoteComment}
          voteComment={voteComment}
        />
        <div>
          {showReplies.length > 0 &&
            showReplies.map((each, index) => {
              return (
                <div style={{ paddingLeft: `${rootPaddingLeft}px` }}>
                  <DisplayComments
                    loadingDataGetPosts={loadingDataGetPosts}
                    dataGetPosts={dataGetPosts}
                    loadingMe={loadingMe}
                    dataMe={dataMe}
                    loadingVoteComment={loadingVoteComment}
                    voteComment={voteComment}
                    key={index}
                    comment={each}
                    post={post}
                  />
                </div>
              );
            })}
          {repliesForThisComment.length - next > 0 ? (
            <Button onClick={() => setNext(next + 5)}>See more replies...</Button>
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
