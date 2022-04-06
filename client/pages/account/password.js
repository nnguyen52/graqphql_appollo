import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import InputField from '../../components/InputField';
import { Box, LinearProgress, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_changePassword } from '../../graphql-client/mutations/changePassword';
import { Query_me } from '../../graphql-client/queries/user';
import { styled } from '@mui/material/styles';

const PasswordResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.confirmNewPasswordContainer .form': {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      padding: '.5em',
      background: '#dff7c8',
    },
    '.confirmNewPasswordContainer .form button': {
      alignSelf: 'end',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.confirmNewPasswordContainer': {
      background: '#dff7c8',
      padding: '.5em',
    },
  },
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));

const Password = () => {
  const { data: dataMe, loading: loadingMe, refetch: refetchMe } = useQuery(Query_me);
  const router = useRouter();
  const { id, token, type } = router.query;
  const [changePassword, { loading: loadingChangePassword }] = useMutation(Mutation_changePassword);
  const initialValues = {
    newPassword: '',
    confirmNewPassword: '',
  };
  const [message, setMessage] = useState(null);
  const [messageError, setMessageError] = useState(null);
  const handleResetPassword = async (values, { setErrors }) => {
    if (message) return;
    if (!id && !token && !type) return;
    if (values.newPassword !== values.confirmNewPassword) {
      setMessageError('Password and confirm password does not match');
      return;
    }
    await changePassword({
      variables: {
        token,
        userId: id.toString(),
        newPassword: values.newPassword,
        type,
      },
      update(cache, { data }) {
        if (!data.changePassword.network.success) {
          refetchMe();
          return setMessageError(data.changePassword.network.errors[0].message);
        }
        if (data.changePassword.network.success) {
          refetchMe();
          return setMessage(data.changePassword.network.message);
        }
      },
    });
  };
  if (loadingMe) return <LinearProgress />;
  return (
    <>
      <PasswordResponsive>
        <Box className='confirmNewPasswordContainer'>
          {/* {!loadingMe && !dataMe?.me?.network?.success && (
        <Alert severity='error'>Please login to access this content!</Alert>
      )} */}
          {/* {dataMe?.me?.network.success && ( */}
          <Formik initialValues={initialValues} onSubmit={handleResetPassword}>
            {({ isSubmitting }) => (
              <Form>
                <Box className='form' sx={{ display: 'flex', gap: '.5em', flexDirection: 'row' }}>
                  <InputField name='newPassword' type='password' label='New Password' />
                  <InputField
                    name='confirmNewPassword'
                    type='password'
                    label='Confirm new password'
                  />
                  <LoadingButton disabled={message} loading={isSubmitting} type='submit'>
                    Update password
                  </LoadingButton>
                </Box>
                {isSubmitting && loadingChangePassword && loadingMe && <LinearProgress />}
                <Box sx={{ marginTop: '.5em' }}>
                  {message && <Alert severity='success'>{message} </Alert>}
                  {messageError && <Alert severity='error'>{messageError} </Alert>}
                </Box>
              </Form>
            )}
          </Formik>
          {/* )} */}
        </Box>
      </PasswordResponsive>
    </>
  );
};

export default Password;
