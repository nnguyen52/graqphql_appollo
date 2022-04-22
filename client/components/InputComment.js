import React, { useState } from 'react';
import InputField from './InputField';
import { Form, Formik } from 'formik';
import { Alert } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_createComment } from '../graphql-client/mutations/createComment';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getCommentsFromUser } from '../graphql-client/queries/getCommentsFromUser';
import { Query_getPostsFromUser } from '../graphql-client/queries/getPostsFromUser';
import { Query_getPostsUserVoted } from '../graphql-client/queries/getPostsUserVoted';
import { Query_getHideposts } from '../graphql-client/queries/getHidePosts';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';

const InputComment = ({ post, comment, setReplyMode, loadingDataGetPosts }) => {
  const { data: dataMe, loading: loadingMe, refetch: refetchMe } = useQuery(Query_me);
  const [createComment, { loading: loadingCreateComment }] = useMutation(Mutation_createComment);
  const { refetch: refetchGetCommentsFromUser } = useQuery(Query_getCommentsFromUser, {
    variables: {
      userId: dataMe?.me?.data?._id.toString(),
    },
  });
  const { data: dataGetPosts, refetch: refetchDataGetPosts } = useQuery(Query_getPosts, {
    variables: { cursor: '' },
  });
  const { refetch: refetchDataGetPostsFromUser } = useQuery(Query_getPostsFromUser, {
    variables: {
      userId: dataMe?.me?.data?._id.toString(),
    },
  });
  const [exceptionErr, setexceptionErr] = useState(null);
  const initialValues = {
    commentContent: '',
  };
  const { refetch: refetchPostsUserUpvoted } = useQuery(Query_getPostsUserVoted, {
    variables: { type: 'upvote' },
  });
  const { refetch: refetchPostsUserDownvoted } = useQuery(Query_getPostsUserVoted);
  const { refetch: refetchGetHidePosts } = useQuery(Query_getHideposts, {
    variables: { cursor: '' },
  });
  const { refetch: refetchGetSavePosts } = useQuery(Query_getSaveposts, {
    variables: { cursor: '' },
  });

  const handleSubmit = async (values, { setErrors }) => {
    if (loadingCreateComment || values.commentContent == '' || loadingDataGetPosts) return;
    await createComment({
      variables: setReplyMode
        ? {
            content: values.commentContent.toString(),
            tag: comment.tag._id.toString(),
            postId: comment.postId.toString(),
            postUserId: comment.tag._id.toString(),
            reply: comment._id.toString(),
          }
        : {
            content: values.commentContent.toString(),
            tag: dataMe.me.data._id.toString(),
            postId: post._id.toString(),
            postUserId: post.userId.toString(),
          },
      update(cache, { data }) {
        if (!data.createComment.network.success) {
          // handle errors
          refetchMe();
          setReplyMode(false);
          setexceptionErr(data.createComment.network.errors[0].message);
        } else {
          if (setReplyMode) setReplyMode(false);

          // const newComment = data.createComment.data;
          // let updatedPosts = dataGetPosts.getPosts.data.posts.map((post) => {
          //   if (post._id.toString() == newComment.postId.toString()) {
          //     return {
          //       ...post,
          //       comments: [...post.comments, newComment],
          //     };
          //   } else return post;
          // });
          // cache.writeQuery({
          //   query: Query_getPosts,
          //   data: {
          //     getPosts: {
          //       ...dataGetPosts.getPosts,
          //       data: {
          //         ...dataGetPosts.getPosts.data,
          //         posts: updatedPosts,
          //       },
          //     },
          //   },
          // });
          refetchDataGetPosts();
          refetchGetCommentsFromUser();
          refetchDataGetPostsFromUser();
          refetchPostsUserUpvoted();
          refetchPostsUserDownvoted();
          refetchGetHidePosts();
          refetchGetSavePosts();
        }
      },
    });
  };
  return (
    <>
      {!loadingMe && !dataMe?.me?.data && (
        <Alert severity='success'>To comment, please login!</Alert>
      )}
      {!loadingMe && dataMe?.me?.network?.success && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name='commentContent'
                type='text'
                label={`${setReplyMode ? `Reply to ${comment.user.userName}` : `Add a comment...`}`}
              />
              {exceptionErr && (
                <Alert variant='filled' severity='error'>
                  {exceptionErr}
                </Alert>
              )}
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default InputComment;
