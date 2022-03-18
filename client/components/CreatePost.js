import React, { useState } from 'react';
import InputField from './InputField';
import { Formik, Form } from 'formik';
import { Alert, LinearProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@apollo/client';
import { Mutation_createPost } from '../graphql-client/mutations/createPost';
import { Query_getPosts } from '../graphql-client/queries/posts';

const CreatePost = () => {
  const initialValues = { title: '', content: '' };
  const [createPost, { loading: loadingCraetePost }] = useMutation(Mutation_createPost);
  //   const { data: dataGetPosts, loading: loadingDataGetPosts } = useQuery(Query_getPosts, {
  //     variables: {
  //       limit: 2,
  //     },
  //     notifyOnNetworkStatusChange: true,
  //   });
  //   if (dataGetPosts) console.log('ldsadsa', dataGetPosts);

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
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <InputField name='title' label='Title' type='text' />
          <InputField name='content' label='Content' type='text' />
          <LoadingButton loading={isSubmitting || loadingCraetePost} type='submit'>
            Create post
          </LoadingButton>
          {isSubmitting && <LinearProgress />}
          {exceptionErr && (
            <Alert variant='filled' severity='error'>
              {exceptionErr}
            </Alert>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default CreatePost;
