import React, { useState } from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { LoadingButton } from '@mui/lab';
import Comments from './Comments';
import { Mutation_voteComment } from '../graphql-client/mutations/voteComment';
import InputComment from './InputComment';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Mutation_deletePost } from '../graphql-client/mutations/deletePost';
import NextLink from 'next/link';

const Post = ({ data }) => {
  const client = useApolloClient();
  const dataGetPosts = client.readQuery({ query: Query_getPosts });
  const dataMe = client.readQuery({ query: Query_me });
  const [vote, { loading }] = useMutation(Mutation_vote);
  const [voteComment, { loading: loadingVoteComment }] = useMutation(Mutation_voteComment);
  const [deletePost, { loading: loadingDeletePost }] = useMutation(Mutation_deletePost);
  const [commentMode, setCommentMode] = useState(false);
  const handleVote = async (value) => {
    try {
      if (!dataMe?.me?.data || !dataMe.me) {
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
      }).catch((e) => console.log(e));
    } catch (e) {
      console.log('out erorr', e);
    }
  };
  const handleDeletePost = async () => {
    if (confirm('You are about to delete post. Are you sure?'))
      await deletePost({
        variables: {
          id: data._id.toString(),
        },
        update(cache, response) {
          if (!response.data.deletePost.network.success)
            return alert(response.data.deletePost.network.errors[0].message);
          if (response.data.deletePost.network.success) {
            cache.writeQuery({
              query: Query_getPosts,
              data: {
                getPosts: {
                  ...dataGetPosts.getPosts,
                  data: {
                    ...dataGetPosts.getPosts.data,
                    posts: dataGetPosts.getPosts.data.posts.filter(
                      (each) => each._id != data._id.toString()
                    ),
                  },
                },
              },
            });
          }
        },
      });
  };
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1em',
        }}
      >
        <h3>{data.title}</h3>{' '}
        {dataMe?.me?.data && dataMe?.me?.data?.id.toString() == data.userId.toString() && (
          <DeleteIcon
            sx={{
              color: 'red',
              cursor: 'pointer',
            }}
            onClick={!loadingDeletePost ? handleDeletePost : null}
          />
        )}
        {dataMe?.me?.data && dataMe?.me?.data?.id.toString() == data.userId.toString() && (
          <NextLink href={`/account/editPost/${data._id}`}>
            <EditIcon
              sx={{
                color: 'green',
                cursor: 'pointer',
              }}
            />
          </NextLink>
        )}
      </Box>
      <Box>
        <LoadingButton loading={loading} onClick={() => handleVote(1)}>
          upvote
        </LoadingButton>
        <b>{data.points}</b>
        <LoadingButton loading={loading} onClick={() => handleVote(-1)}>
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
          post={data}
          dataMe={dataMe}
        />
      )}
      <Comments
        post={data}
        dataGetPosts={dataGetPosts}
        dataMe={dataMe}
        loadingVoteComment={loadingVoteComment}
        voteComment={voteComment}
      />
      <hr />
    </div>
  );
};

export default Post;
