import React, { useState } from 'react';
import InputField from './InputField';
import { Form, Formik } from 'formik';
import { Alert } from '@mui/material';
import { useMutation } from '@apollo/client';
import { Mutation_createComment } from '../graphql-client/mutations/createComment';
import { Query_getPosts } from '../graphql-client/queries/posts';

const InputComment = ({
  comment,
  loadingMe,
  dataMe,
  setReplyMode,
  loadingDataGetPosts,
  dataGetPosts,
}) => {
  const [createComment, { loading: loadingCreateComment }] = useMutation(Mutation_createComment);
  const [exceptionErr, setexceptionErr] = useState(null);
  const initialValues = {
    commentContent: '',
  };
  console.log('here', dataGetPosts);
  const handleSubmit = async (values, { setErrors }) => {
    if (loadingCreateComment || values.commentContent == '' || loadingDataGetPosts) return;

    await createComment({
      variables: {
        content: values.commentContent.toString(),
        tag: comment.tag.id.toString(),
        postId: comment.postId.toString(),
        postUserId: comment.tag.id.toString(),
        reply: comment._id.toString(),
      },
      update(cache, { data }) {
        console.log('after createcomment: ', data);
        if (!data.createComment.network.success) {
          // handle errors
          setexceptionErr(data.createComment.network.message);
        } else {
          setReplyMode((prev) => false);
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
      {!loadingMe && dataMe?.me?.network?.success && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSumitting }) => (
            <Form>
              <InputField
                name='commentContent'
                type='text'
                label={`Reply to ${comment.user.userName}`}
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
