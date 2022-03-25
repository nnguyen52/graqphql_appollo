import React, { useState } from 'react';
import InputField from './InputField';
import { Formik, Form } from 'formik';
import { Alert, Button, LinearProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { Mutation_createPost } from '../graphql-client/mutations/createPost';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import NextLink from 'next/link';
const CreatePost = () => {
  const client = useApolloClient();
  const initialValues = { title: '', content: '' };
  const [createPost, { loading: loadingCraetePost }] = useMutation(Mutation_createPost);
  const { data: meData, loading: meLoading } = useQuery(Query_me);
  // if (meData) console.log('meData: ', meData);
  const [exceptionErr, setExceptionErr] = useState(null);
  const handleSubmit = async (values, { setErrors }) => {
    const { title, content } = values;
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
    <>
      {!meLoading && meData?.me?.data == null ? (
        <Alert
          action={
            <NextLink href='/login'>
              <Button style={{ color: 'white', background: 'black' }}>Login</Button>
            </NextLink>
          }
          variant='filled'
          severity='success'
        >
          Please login to create post!
        </Alert>
      ) : (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField name='title' label='Title' type='text' />
              <InputField name='content' label='Content' type='text' />
              <Button type='submit' loading={isSubmitting || meLoading || loadingCraetePost}>
                Create post
              </Button>
              {(isSubmitting || meLoading || loadingCraetePost) && <LinearProgress />}
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

export default CreatePost;
