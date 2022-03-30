import React, { useState } from 'react';
import InputField from './InputField';
import { Formik, Form } from 'formik';
import { Alert, Box, Card, LinearProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_createPost } from '../graphql-client/mutations/createPost';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import NextLink from 'next/link';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
const CreatePost = () => {
  const initialValues = { title: '', content: '' };
  const [createPost, { loading: loadingCraetePost }] = useMutation(Mutation_createPost);
  const { data: meData, loading: meLoading } = useQuery(Query_me);
  const [exceptionErr, setExceptionErr] = useState(null);
  const handleSubmit = async (values, { setErrors }) => {
    const { title, content } = values;
    if (!title)
      return setErrors(
        mapFieldErrors([{ field: 'title', message: 'What is the title of this post?' }])
      );
    await createPost({
      variables: { title, content },
      update(cache, { data }) {
        if (!data.createPost.network.success) {
          setExceptionErr(data.createPost.network.errors[0].message);
          setTimeout(() => setExceptionErr(null), 3000);
          return;
        }
        if (data.createPost.network.success) {
          const { getPosts } = cache.readQuery({ query: Query_getPosts });
          // console.log('after createPost: ', data.createPost);
          // incoming data -> will get checked by typePolicies for merging
          const cacheAfterCreatePost = {
            ...getPosts,
            data: {
              ...getPosts.data,
              posts: [{ ...data.createPost.data }],
            },
          };
          cache.writeQuery({
            query: Query_getPosts,
            data: { getPosts: cacheAfterCreatePost },
          });
          return;
        }
      },
    });
  };
  return (
    <Card>
      {!meLoading && meData?.me?.data == null ? (
        <Alert severity='success'>
          <u> Please login to create post!</u>
        </Alert>
      ) : (
        <Alert
          severity='success'
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1em',
                  }}
                >
                  <InputField name='title' label='Title' type='text' />
                  <InputField name='content' label='Content' type='text' />
                  <LoadingButton
                    type='submit'
                    loading={isSubmitting || meLoading || loadingCraetePost}
                  >
                    Create post
                  </LoadingButton>
                  {isSubmitting && meLoading && loadingCraetePost && <LinearProgress />}
                  {exceptionErr && (
                    <Alert variant='filled' severity='error'>
                      {exceptionErr}
                    </Alert>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        </Alert>
      )}
    </Card>
  );
};

export default CreatePost;
