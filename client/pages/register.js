import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Mutation_register } from '../graphql-client/mutations/register';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
import NextLink from 'next/link';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { LoadingButton } from '@mui/lab';
import { Alert, Button, LinearProgress, Box, Grid } from '@mui/material';
import { ResponsiveBox } from './login';
import Image from 'next/image';
import char1 from '../assets/redditChars1.jpg';
import char2 from '../assets/redditChars2.jpg';
import char3 from '../assets/redditChars3.jpg';
import char4 from '../assets/redditChars4.jpg';
import char5 from '../assets/redditChars5.jpg';
import char6 from '../assets/redditChars6.jpg';
import char7 from '../assets/redditChars7.jpg';
import char8 from '../assets/redditChars8.jpg';
import theme from '../src/theme';
import { ThemeProvider } from '@mui/material/styles';

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

  useEffect(() => {
    if (!exceptionErr) return;
    setTimeout(() => {
      setExceptionError(null);
    }, 3000);
  }, [exceptionErr]);

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
    <>
      <ThemeProvider theme={theme}>
        <ResponsiveBox>
          <Grid
            container
            sx={{
              width: '100%',
              height: '100%',
            }}
          >
            <Grid
              item
              sx={{
                width: '33%',
                height: '25%',
                objectFit: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>
                <Image src={char1.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              className='decor_img_login'
              item
              sx={{
                width: '34%',
                height: '25%',
                objectFit: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>
                <Image src={char2.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              item
              sx={{
                width: '33%',
                height: '25%',
                objectFit: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>
                <Image src={char3.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              className='hide_mobile'
              item
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '20%',
                height: '50%',
                alignItems: 'center',
                objectFit: 'cover',
              }}
            >
              <Box
                sx={{
                  height: 'fit-content',
                }}
              >
                <Image src={char4.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              className='grid_login'
              item
              sx={{
                width: '60%',
                height: '50%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                  {({ isSubmitting }) => (
                    <Form>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '1em',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1em',
                          }}
                        >
                          <InputField name='userName' label='User Name' type='text' />
                          <InputField name='email' label='Email' type='text' />
                          <InputField name='password' label='Password' type='password' />
                        </Box>
                        {exceptionErr && <Alert severity='error'>{exceptionErr}</Alert>}
                        <Box sx={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
                          <LoadingButton
                            sx={{
                              border: `2px solid ${theme.palette.upvoteButton.main}`,
                              color: theme.palette.upvoteButton.main,
                              background: 'black',
                              '&:hover': {
                                border: '2px solid #164920',
                                background: '#164920',
                                color: 'white',
                              },
                            }}
                            variant='contained'
                            loading={isSubmitting && registerLoading}
                            type='submit'
                          >
                            Register
                          </LoadingButton>
                          or
                          <NextLink href='/login'>
                            <Button
                              sx={{
                                border: '2px solid black',
                                background: theme.palette.upvoteButton.main,
                                color: 'black',
                                '&:hover': {
                                  border: '2px solid #164920',
                                  color: 'white',
                                  background: '#164920',
                                },
                              }}
                            >
                              Login
                            </Button>
                          </NextLink>
                        </Box>
                      </Box>
                      {isSubmitting && registerLoading && <LinearProgress />}
                    </Form>
                  )}
                </Formik>
              </Box>
            </Grid>
            <Grid
              className='hide_mobile'
              item
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '20%',
                alignItems: 'center',
                objectFit: 'cover',
              }}
            >
              <Box
                sx={{
                  height: 'fit-content',
                }}
              >
                <Image src={char5.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              item
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '33%',
                height: '25%',
                objectFit: 'cover',
              }}
            >
              <Box>
                <Image src={char6.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              item
              sx={{
                width: '34%',
                height: '25%',
                objectFit: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>
                <Image src={char7.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
            <Grid
              item
              sx={{
                width: '33%',
                height: '25%',
                objectFit: 'cover',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box>
                <Image src={char8.src} width={'150em'} height={'150em'} />
              </Box>
            </Grid>
          </Grid>
        </ResponsiveBox>
      </ThemeProvider>
    </>
  );
};

export default Register;
