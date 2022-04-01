import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Mutation_register } from '../graphql-client/mutations/register';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
import NextLink from 'next/link';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, LinearProgress, Box } from '@mui/material';

const Register = () => {
  const client = useApolloClient();
  const router = useRouter();
  const initialValues = {
    userName: '',
    email: '',
    password: '',
  };
  const [register, { loading: registerLoading, error }] = useMutation(Mutation_register);
  const meData = client.readQuery({ query: Query_me });
  const [exceptionErr, setExceptionError] = useState(null);

  const handleSubmit = async (values, { setErrors }) => {
    try {
      await register({
        variables: {
          userName: values.userName,
          email: values.email,
          password: values.password,
        },
        update(cache, { data }) {
          if (!data.register.network.success) {
            if (data.register.network.errors.length == 1)
              setExceptionError(data.register.network.errors[0].message);
            return setErrors(mapFieldErrors(data.register.network.errors));
          } else {
            cache.writeQuery({
              query: Query_me,
              data: { me: { ...data.register, data: data.register.data } },
            });
            const apolloClient = initializeApollo();
            apolloClient.resetStore();
            router.push('/');
          }
        },
      });
    } catch (e) {
      console.log('___ERROR: ', e);
    }
  };
  if (meData?.me?.data) {
    router.push('/');
    return null;
  }
  if (error) setExceptionError(error);
  return (
    <Box>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1em', paddingLeft: '1em' }}>
              <InputField name='userName' label='User Name' type='text' />
              <InputField name='email' label='Email' type='text' />
              <InputField name='password' label='Password' type='password' />
              <LoadingButton
                variant='contained'
                loading={isSubmitting && registerLoading}
                type='submit'
              >
                Register
              </LoadingButton>
              or
              <NextLink href='/login'>
                <Button variant='outlined'>Login</Button>
              </NextLink>
              {exceptionErr && <Alert severity='error'>{exceptionErr}</Alert>}
            </Box>
            {isSubmitting && registerLoading && <LinearProgress />}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
