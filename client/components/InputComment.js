import React, { useState } from 'react';
import InputField from './InputField';
import { Form, Formik } from 'formik';
import { Alert } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_createComment } from '../graphql-client/mutations/createComment';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';

const InputComment = ({
  post,
  comment,
  loadingMe,
  dataMe,
  setReplyMode,
  loadingDataGetPosts,
  dataGetPosts,
}) => {
  const { refetch: refetchMe } = useQuery(Query_me);
  const [createComment, { loading: loadingCreateComment }] = useMutation(Mutation_createComment);
  const [exceptionErr, setexceptionErr] = useState(null);
  const initialValues = {
    commentContent: '',
  };
  const handleSubmit = async (values, { setErrors }) => {
    if (loadingCreateComment || values.commentContent == '' || loadingDataGetPosts) return;
    await createComment({
      variables: setReplyMode
        ? {
            content: values.commentContent.toString(),
            tag: comment.tag.id.toString(),
            postId: comment.postId.toString(),
            postUserId: comment.tag.id.toString(),
            reply: comment._id.toString(),
          }
        : {
            content: values.commentContent.toString(),
            tag: dataMe.me.data.id.toString(),
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
          const newComment = data.createComment.data;
          let updatedPosts = dataGetPosts.getPosts.data.posts.map((post) => {
            if (post._id.toString() == newComment.postId.toString()) {
              return {
                ...post,
                comments: [...post.comments, newComment],
              };
            } else return post;
          });
          cache.writeQuery({
            query: Query_getPosts,
            data: {
              getPosts: {
                ...dataGetPosts.getPosts,
                data: {
                  ...dataGetPosts.getPosts.data,
                  posts: updatedPosts,
                },
              },
            },
          });
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
