import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_vote } from '../graphql-client/mutations/votePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getPosts } from '../graphql-client/queries/posts';
const Post = ({ data }) => {
  const { data: dataGetPosts, loading: loadingDataGetPosts } = useQuery(Query_getPosts);
  const [vote, { loading }] = useMutation(Mutation_vote);
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);

  const handleVote = async (value) => {
    try {
      console.log('me', dataMe);
      if (!loadingMe && (!dataMe?.me?.data || !dataMe.me)) {
        return alert('Please login to vote posts!');
      }
      await vote({
        variables: { postId: data._id, voteValue: value },
        update(cache, response) {
          if (!response.data.vote.network.success)
            return alert(response.data.vote.network.errors[0].message);
          if (response.data.vote.network.success) {
            // let posts = dataGetPosts.getPosts.data.posts;
            // posts = posts.map((each) => (each._id == data._id ? response.data.vote.data : each));
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
    <div>
      <h3>{data.title}</h3>
      <button disabled={loadingMe || loading || loadingDataGetPosts} onClick={() => handleVote(1)}>
        upvote
      </button>
      <b>{data.points}</b>
      <button disabled={loadingMe || loading || loadingDataGetPosts} onClick={() => handleVote(-1)}>
        downvote
      </button>
    </div>
  );
};

export default Post;
