import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { LoadingButton } from '@mui/lab';
import Comments from './Comments';
import { Mutation_voteComment } from '../graphql-client/mutations/voteComment';
import InputComment from './InputComment';
import { Box, Button } from '@mui/material';

const Post = ({ data }) => {
  const { data: dataGetPosts, loading: loadingDataGetPosts } = useQuery(Query_getPosts);
  const [vote, { loading }] = useMutation(Mutation_vote);
  const [voteComment, { loading: loadingVoteComment }] = useMutation(Mutation_voteComment);
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);
  const [commentMode, setCommentMode] = useState(false);

  const handleVote = async (value) => {
    try {
      if (!loadingMe && (!dataMe?.me?.data || !dataMe.me)) {
        return alert('Please login to vote posts!');
      }
      await vote({
        variables: { postId: data._id, voteValue: value },
        update(cache, response) {
          if (!response.data.vote.network.success)
            return alert(response.data.vote.network.errors[0].message);
          if (response.data.vote.network.success) {
            cache.writeQuery({
              query: Query_getPosts,
              data: {
                getPosts: {
                  ...dataGetPosts.getPosts,
                  data: {
                    ...dataGetPosts.getPosts.data,
                    posts: [],
                  },
                },
              },
            });
          }
        },
      }).catch((e) => console.log('catch here: ', e));
    } catch (e) {
      console.log('out erorr', e);
    }
  };
  return (
    <div style={{ border: '1px solid black' }}>
      <h3>{data.title}</h3>
      <Box>
        <LoadingButton
          loading={loadingMe || loading || loadingDataGetPosts}
          onClick={() => handleVote(1)}
        >
          upvote
        </LoadingButton>
        <b>{data.points}</b>
        <LoadingButton
          loading={loadingMe || loading || loadingDataGetPosts}
          onClick={() => handleVote(-1)}
        >
          downvote
        </LoadingButton>
        {commentMode ? (
          <Button
            sx={{
              color: 'white',
              background: 'black',
              maxHeight: '1.5em',
              fontSize: '.8em',
              padding: 1,
              '&.MuiButtonBase-root:hover': {
                bgcolor: 'orange',
              },
            }}
            onClick={() => setCommentMode(!commentMode)}
          >
            Cancel
          </Button>
        ) : (
          <Button
            sx={{
              color: 'white',
              background: 'black',
              maxHeight: '1.5em',
              fontSize: '.8em',
              padding: 1,
              '&.MuiButtonBase-root:hover': {
                bgcolor: 'orange',
              },
            }}
            onClick={() => setCommentMode(!commentMode)}
          >
            Comment
          </Button>
        )}
      </Box>
      {commentMode && (
        <InputComment
          setCommentMode={setCommentMode}
          dataGetPosts={dataGetPosts}
          loadingDataGetPosts={loadingDataGetPosts}
          post={data}
          loadingMe={loadingMe}
          dataMe={dataMe}
        />
      )}
      <Comments
        post={data}
        loadingDataGetPosts={loadingDataGetPosts}
        dataGetPosts={dataGetPosts}
        loadingMe={loadingMe}
        dataMe={dataMe}
        loadingVoteComment={loadingVoteComment}
        voteComment={voteComment}
      />
    </div>
  );
};

export default Post;
