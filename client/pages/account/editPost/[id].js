import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { Query_getPostByID } from '../../../graphql-client/queries/getPostByID';
import { Alert, Button, LinearProgress } from '@mui/material';
import { Mutation_editPost } from '../../../graphql-client/mutations/editPost';
import { Formik, Form } from 'formik';
import InputField from '../../../components/InputField';
import { LoadingButton } from '@mui/lab';
import { mapFieldErrors } from '../../../../server/src/utils/mapFieldErrors';
import NextLink from 'next/link';
import { Button } from '@mui/material';

const EditPost = () => {
  const router = useRouter();
  const { data: dataPost, loading } = useQuery(Query_getPostByID, {
    variables: {
      id: router.query.id,
    },
  });
  const initialValues = {
    title: dataPost?.getPostByID?.data?.title ? dataPost.getPostByID.data.title : '',
    content: dataPost?.getPostByID?.data?.content ? dataPost.getPostByID.data.content : '',
  };
  const [updatePost, { loading: loadingEditPost }] = useMutation(Mutation_editPost);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (!router.query.id) return router.push('/');
  }, []);

  const handleEditPost = async (values, { setErrors }) => {
    if (loadingEditPost) return;
    await updatePost({
      variables: {
        id: router.query.id,
        title: values.title,
        content: values.content,
      },
      update(cache, { data }) {
        if (!data.updatePost.network.success) {
          setErrors(mapFieldErrors(data.updatePost.network.errors));
          return;
        }
        if (data.updatePost.network.success) return setMessage(data.updatePost.network.message);
      },
    });
  };
  if (loading) return <LinearProgress />;
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleEditPost}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              type='text'
              label='New title'
              defaultValue={initialValues.title}
              name='title'
            />
            <InputField
              type='text'
              label='New content'
              defaultValue={initialValues.content}
              name='content'
            />
            <LoadingButton loading={isSubmitting && loadingEditPost} type='submit'>
              Edit post
            </LoadingButton>
          </Form>
        )}
      </Formik>
      {message && (
        <Alert
          severity='success'
          action={
            <>
              <NextLink href='/'>
                <Button>Home</Button>
              </NextLink>
            </>
          }
        >
          {message}{' '}
        </Alert>
      )}
    </div>
  );
};

export default EditPost;
