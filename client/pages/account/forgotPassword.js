import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import InputField from '../../components/InputField';
import { LoadingButton } from '@mui/lab';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Mutation_forgotPassword } from '../../graphql-client/mutations/forgotPassword';

const ForgotPasswordResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.forgotPasswordFormContainer': {
      marginTop: '3em',
      flexDirection: 'column',
      width: '100%',
      background: '#dff7c8',
    },
    '.forgotPasswordFormContainer span': {
      padding: '.5em',
      margin: 0,
    },
    '.forgotPasswordFormContainer .form': {
      width: '100%',
      flexDirection: 'column',
      padding: 0,
      margin: 0,
    },
    '.forgotPasswordFormContainer .form button': {
      alignSelf: 'end',
    },
    '.forgotPasswordForm > *': {
      width: '100%',
    },
  },
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
    '.forgotPasswordFormContainer': {
      alignItems: 'center',
      background: '#dff7c8',
      padding: '.5em',
    },
  },
}));
const ForgotPassword = () => {
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);
  const [forgotPassword, { loading: loadingForgotPassword }] = useMutation(Mutation_forgotPassword);
  const initialValues = {
    email: '',
  };
  const [forgotPasswordResult, setForgotPasswordResult] = useState(null);
  const handleConfirmingResetPass = async (values, { setErrors }) => {
    if (values.email == '') return;
    await forgotPassword({
      variables: {
        email: values.email,
      },
      update(cache, { data }) {
        setForgotPasswordResult(data?.forgotPassword);
      },
    });
  };
  if (loadingMe && loadingForgotPassword) return <LinearProgress />;
  if (
    !loadingForgotPassword &&
    forgotPasswordResult !== null &&
    forgotPasswordResult?.network?.success
  ) {
    return <Alert severity='success'>{forgotPasswordResult?.network?.message}</Alert>;
  }
  if (!loadingMe && dataMe?.me?.data?.network?.success)
    return (
      <ForgotPasswordResponsive>
        <Alert
          severity='error'
          sx={{
            alignItems: 'center',
          }}
        >
          Please change your password in profile setting
          <NextLink href='/account'>
            <Button>Profile Settings</Button>
          </NextLink>
        </Alert>
      </ForgotPasswordResponsive>
    );
  return (
    <>
      <ForgotPasswordResponsive>
        <Box
          className='forgotPasswordFormContainer'
          sx={{
            display: 'flex',
            gap: '1em',
            width: '100%',
            padding: 0,
            margin: 0,
          }}
        >
          <span>Please enter your email</span>
          <Formik initialValues={initialValues} onSubmit={handleConfirmingResetPass}>
            {({ isSubmitting }) => (
              <Form>
                <Box className='form' sx={{ display: 'flex' }}>
                  <InputField name='email' type='email' label='Enter your email' />
                  <LoadingButton loading={isSubmitting && loadingMe}>Confirm</LoadingButton>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </ForgotPasswordResponsive>
    </>
  );
};

export default ForgotPassword;
