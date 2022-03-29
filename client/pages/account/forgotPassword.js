import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { Form, Formik } from 'formik';
import InputField from '../../components/InputField';
import { LoadingButton } from '@mui/lab';
import NextLink from 'next/link';

const ForgotPassword = () => {
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);
  const initialValues = {
    email: '',
  };
  const handleConfirmingResetPass = async (values, { setErrors }) => {
    console.log(values);
  };
  if (loadingMe) return <LinearProgress />;
  if (!loadingMe && dataMe?.me?.data?.network?.success)
    return (
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
    );
  return (
    <>
      <Alert sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1em',
          }}
        >
          Please enter your email
          <Formik initialValues={initialValues} onSubmit={handleConfirmingResetPass}>
            {({ isSubmitting }) => (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <InputField name='email' type='email' label='Enter your email' />
                  <LoadingButton loading={isSubmitting && loadingMe}>Confirm</LoadingButton>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Alert>
    </>
  );
};

export default ForgotPassword;
