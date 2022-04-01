import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Mutation_Login } from '../graphql-client/mutations/login';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
import NextLink from 'next/link';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, LinearProgress, Box } from '@mui/material';

const Login = () => {
  const client = useApolloClient();
  const router = useRouter();
  const initialValues = {
    userNameOrEmail: '',
    password: '',
  };
  const [login, { loading: loginLoading, error }] = useMutation(Mutation_Login);
  const meData = client.readQuery({ query: Query_me });
  const [exceptionErr, setExceptionError] = useState(null);
  const handleSubmit = async (values, { setErrors }) => {
    await login({
      variables: {
        userNameOrEmail: values.userNameOrEmail,
        password: values.password,
      },
      update(cache, { data }) {
        if (!data.login.network.success) {
          setExceptionError(
            data.login.network.errors && data.login.network.errors.length == 1
              ? data.login.network.errors[0].message
              : data.login.network.message
          );
          return setErrors(mapFieldErrors(data.login.network.errors));
        } else {
          cache.writeQuery({
            query: Query_me,
            data: { me: { ...data.login, data: data.login.data } },
          });
          const apolloClient = initializeApollo();
          apolloClient.resetStore();
          router.push('/');
        }
      },
    });
  };
  if (meData?.me?.data) {
    router.push('/');
    return null;
  }
  if (error) setExceptionError(error);
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Box sx={{ display: 'flex', alignItems: 'center', paddingLeft: '1em', gap: '1em' }}>
              <InputField name='userNameOrEmail' label='User Name' type='text' />
              <InputField name='password' label='Password' type='password' />
              <LoadingButton
                sx={{
                  border: '2px solid black',
                  background: 'orange',
                  color: 'black',
                  '&:hover': {
                    border: '2px solid #164920',
                    color: 'white',
                    background: '#164920',
                  },
                }}
                variant='outlined'
                loading={isSubmitting && loginLoading}
                type='submit'
              >
                Login
              </LoadingButton>
              or
              <NextLink href='/register'>
                <Button
                  sx={{
                    border: '2px solid orange',
                    color: 'orange',
                    background: 'black',
                    '&:hover': {
                      border: '2px solid #164920',
                      background: '#164920',
                      color: 'white',
                    },
                  }}
                  variant='contained'
                >
                  Register
                </Button>
              </NextLink>
            </Box>
            {exceptionErr && (
              <Alert variant='filled' severity='error'>
                {exceptionErr}
              </Alert>
            )}
            {isSubmitting && loginLoading && <LinearProgress />}
          </Form>
        )}
      </Formik>
      <NextLink href='/account/forgotPassword'>
        <Button sx={{ margin: '1em', textDecoration: 'underline', textTransform: 'lowercase' }}>
          Forgot password
        </Button>
      </NextLink>
    </div>
  );
};

export default Login;
