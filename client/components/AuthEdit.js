import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import InputField from './InputField';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_verifyPassword } from '../graphql-client/mutations/verifyPassword';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { Mutation_editMe } from '../graphql-client/mutations/editMe';
import { Query_me } from '../graphql-client/queries/user';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

const AuthEditResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.authEditContainer': {
      flexDirection: 'column',
      width: '100%',
      margin: 0,
      padding: 0,
    },
    '.authEditContainer .form': {
      flexDirection: 'column',
      width: '100%',
      padding: 0,
      margin: 0,
    },
    '.authEditContainer .form button': {
      alignSelf: 'end',
    },
  },
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
    '.authEditContainer': {
      alignItems: 'center',
    },
  },
}));
const AuthEdit = ({ me, setIsEditing }) => {
  const { refetch: refetchMe } = useQuery(Query_me);
  const initPasswordValue = {
    password: '',
    email: '',
  };
  const [verifyPassword, { loading: loadingVerifyPasword }] = useMutation(Mutation_verifyPassword);
  const initialValues = {
    userName: me.data.userName,
    password: '',
    email: me.data.email,
  };

  const [checkPassword, setCheckPassword] = useState(false);
  const [errorCheckPassword, setErrorCheckPassword] = useState(null);

  const [editMe, { loading: loadingEditMe }] = useMutation(Mutation_editMe);
  const [messageEditMe, setMessageEditMe] = useState(null);

  const handleSubmitCheckPass = async (values, { setErrors }) => {
    await verifyPassword({
      variables: {
        password: values.password,
        email: values.email,
      },
      update(cache, { data }) {
        if (!data.verifyPassword.network.success) {
          refetchMe();
          setErrorCheckPassword(data.verifyPassword.network.errors[0].message);
          return;
        }
        if (data.verifyPassword.network.success) {
          setErrorCheckPassword(null);
          setCheckPassword(true);
        }
      },
    });
  };
  const handleEditMe = async (values, { setErrors }) => {
    if (messageEditMe) return;
    if (!values.userName && !values.password) return;
    await editMe({
      variables: {
        newUserInfo: {
          userName: values.userName,
          password: values.password,
          email: values.email,
        },
      },
      update(cache, { data }) {
        if (!data.editMe.network.success) {
          refetchMe();
          messageEditMe(data.editMe.network.errors[0].message);
          setIsEditing(false);
          return;
        }
        // update cache Query_me
        cache.writeQuery({
          query: Query_me,
          data: {
            me: {
              network: { ...me.network },
              data: { ...data.editMe.data },
            },
          },
        });
        setMessageEditMe(data.editMe.network.message);
        setIsEditing(false);
      },
    });
  };
  return (
    <>
      <AuthEditResponsive>
        <ThemeProvider theme={theme}>
          {!checkPassword && (
            <Alert
              sx={{
                alignItems: 'center',
                gap: '1em',
              }}
            >
              <Box
                className='authEditContainer'
                sx={{
                  display: 'flex',
                  gap: '1em',
                }}
              >
                <u> Before changing your credentials, please enter your Email and Password</u>
                <Formik initialValues={initPasswordValue} onSubmit={handleSubmitCheckPass}>
                  {({ isSubmitting: isSubmittingCheckPass }) => (
                    <Form>
                      <Box
                        className='form'
                        sx={{ display: 'flex', gap: '.5em', flexDirection: 'row' }}
                      >
                        <InputField
                          disabled={
                            (isSubmittingCheckPass || loadingVerifyPasword) && checkPassword
                          }
                          name='email'
                          type='email'
                          label='Email'
                        />
                        <InputField
                          disabled={
                            (isSubmittingCheckPass || loadingVerifyPasword) && checkPassword
                          }
                          name='password'
                          type='password'
                          label='Password'
                        />
                        <Button
                          sx={{
                            width: 100,
                            background: theme.palette.upvoteButton.main,
                            color: 'white',
                            borderRadius: '5px',
                            '&:hover': {
                              background: '#ffbf1e',
                            },
                          }}
                          type='submit'
                        >
                          Save
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Alert>
          )}
          {errorCheckPassword && <Alert severity='error'>{errorCheckPassword}</Alert>}
          {checkPassword && (
            <>
              <Alert severity='success' sx={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
                <Box className='authEditContainer' sx={{ display: 'flex', gap: '1em' }}>
                  <u> You can now edit your profile!</u>
                  <Formik initialValues={initialValues} onSubmit={handleEditMe}>
                    {({ isSubmitting: isSubmittingCheckPass }) => (
                      <Form>
                        <Box
                          className='form'
                          sx={{ display: 'flex', gap: '1em', marginTop: '1em' }}
                        >
                          <InputField
                            defaultValue={initialValues.userName}
                            name='userName'
                            type='text'
                            label='User name'
                            helperText='leave blank you dont want to update user name.'
                          />
                          <InputField
                            disabled
                            value={initialValues.email}
                            name='email'
                            type='email'
                            label='Email'
                          />
                          <InputField
                            defaultValue={initialValues.password}
                            name='password'
                            type='password'
                            label='New password'
                            helperText='leave blank you dont want to update password.'
                          />
                          <LoadingButton
                            disabled={messageEditMe}
                            style={{ height: 'fit-content' }}
                            loading={isSubmittingCheckPass && loadingEditMe}
                            type='submit'
                          >
                            Update Profile
                          </LoadingButton>
                        </Box>
                        {isSubmittingCheckPass && loadingEditMe && <LinearProgress />}
                      </Form>
                    )}
                  </Formik>
                </Box>
              </Alert>
            </>
          )}
          {messageEditMe && <Alert severity='success'>{messageEditMe}</Alert>}
        </ThemeProvider>
      </AuthEditResponsive>
    </>
  );
};

export default AuthEdit;
