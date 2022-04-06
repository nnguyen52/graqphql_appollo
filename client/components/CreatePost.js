import React, { useState } from 'react';
import InputField from './InputField';
import { Formik, Form } from 'formik';
import { Alert, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_createPost } from '../graphql-client/mutations/createPost';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { styled } from '@mui/material/styles';

const CreatePostResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.createPost': {
      marginTop: '1em',
      marginBottom: '1em',
      display: 'flex',
      flexDirection: 'column',
      background: '#dff7c8',
    },
    '.createPost > *': {
      width: '100%',
      padding: '.5em',
    },
    '.createPost span': {
      padding: 0,
      margin: 0,
      paddingLeft: '1em',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.createPost': {
      background: '#dff7c8',
      padding: '.5em',
    },
  },
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));

const CreatePost = () => {
  const initialValues = { title: '', content: '' };
  const [createPost, { loading: loadingCraetePost }] = useMutation(Mutation_createPost);
  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(Query_me);
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
          refetchMe();
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
    <CreatePostResponsive>
      <Box>
        {!meLoading && meData?.me?.data == null ? (
          <Alert severity='success'>
            <u> Please login to create post!</u>
          </Alert>
        ) : (
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <Box
                  className='createPost'
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1em',
                  }}
                >
                  <span>
                    <h4> Create Post: </h4>
                  </span>
                  <InputField name='title' label='Title' type='text' />
                  <InputField name='content' label='Content' type='text' />
                  <LoadingButton
                    type='submit'
                    variant='outlined'
                    loading={isSubmitting && loadingCraetePost}
                  >
                    Create post
                  </LoadingButton>
                  {exceptionErr && (
                    <Alert variant='filled' severity='error'>
                      {exceptionErr}
                    </Alert>
                  )}
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </CreatePostResponsive>
  );
};

export default CreatePost;
