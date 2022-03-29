import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import InputField from './InputField';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, LinearProgress } from '@mui/material';
import { useMutation } from '@apollo/client';
import { Mutation_verifyPassword } from '../graphql-client/mutations/verifyPassword';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { Mutation_editMe } from '../graphql-client/mutations/editMe';

const AuthEdit = ({ me }) => {
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
        console.log('after edit me:', data);
        if (!data.editMe.network.success) {
          messageEditMe(data.editMe.network.errors[0].message);
          return;
        }
        setMessageEditMe(data.editMe.network.message);
      },
    });
  };
  return (
    <>
      {!checkPassword && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1em',
          }}
        >
          <span> Before changing your credentials, please enter your password:</span>
          <Formik initialValues={initPasswordValue} onSubmit={handleSubmitCheckPass}>
            {({ isSubmitting: isSubmittingCheckPass }) => (
              <Form>
                <Box sx={{ display: 'flex', gap: '.5em', flexDirection: 'row' }}>
                  <InputField
                    disabled={(isSubmittingCheckPass || loadingVerifyPasword) && checkPassword}
                    name='email'
                    type='email'
                    label='Enter your email...'
                  />
                  <InputField
                    disabled={(isSubmittingCheckPass || loadingVerifyPasword) && checkPassword}
                    name='password'
                    type='password'
                    label='Enter your password...'
                  />
                  <Button type='submit'></Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      )}
      {errorCheckPassword && <Alert severity='error'>{errorCheckPassword}</Alert>}
      {checkPassword && (
        <>
          <Alert severity='success'>You can now edit your profile!</Alert>
          <Formik initialValues={initialValues} onSubmit={handleEditMe}>
            {({ isSubmitting: isSubmittingCheckPass }) => (
              <Form>
                <Box sx={{ display: 'flex', gap: '.5em', flexDirection: 'row' }}>
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
                  <LoadingButton loading={isSubmittingCheckPass || loadingEditMe} type='submit'>
                    Update Profile
                  </LoadingButton>
                </Box>
                {(isSubmittingCheckPass || loadingEditMe) && <LinearProgress />}
              </Form>
            )}
          </Formik>
        </>
      )}
      {messageEditMe && <Alert severity='success'>{messageEditMe}</Alert>}
    </>
  );
};

export default AuthEdit;
