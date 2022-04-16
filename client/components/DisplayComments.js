import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import { Button, Avatar, Box } from '@mui/material';
import CommentMenu from './CommentMenu';
import { dateFormat } from '../src/utils/dateFormat';

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
  let rootPaddingLeft = 1;
  const [repliesForThisComment, setRepliesForThisComment] = useState([]);
  const [showReplies, setShowReplies] = useState([]);
  const [next, setNext] = useState(2);

  useEffect(() => {
    console.log('run3');

    if (!comment || !post) return;
    setRepliesForThisComment(comment.replies ? comment.replies : []);
  }, [comment, post]);

  useEffect(() => {
    console.log('run3');

    if (!repliesForThisComment) return;
    setShowReplies(repliesForThisComment.slice(0, next));
  }, [repliesForThisComment, next]);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          paddingLeft: `${rootPaddingLeft}em`,
          marginTop: '1em',
          gap: '.5em',
          alignItems: 'center',
        }}
      >
        <Avatar
          alt={comment?.user?.userName}
          src={comment?.user?.avatar.toUpperCase()}
          sx={{
            border: '1px solid grey',
          }}
        />
        <h4>{comment?.user?.userName}</h4>({dateFormat(comment?.createdAt.toString())})
      </Box>
      <Comment rootPaddingLeft={rootPaddingLeft} comment={comment} post={post}>
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
                <div key={index} style={{ paddingLeft: `${rootPaddingLeft}em` }}>
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
