import React, { useEffect, useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { Mutation_Login } from '../graphql-client/mutations/login';
import { useRouter } from 'next/router';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { initializeApollo } from '../lib/apolloClient';
import NextLink from 'next/link';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { LoadingButton } from '@mui/lab';
import { Grid, Alert, Button, LinearProgress, Box } from '@mui/material';
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

// responsive
import { styled } from '@mui/material/styles';
export const ResponsiveBox = styled('div')(({ theme }) => ({
  // mobile
  [theme.breakpoints.down('md')]: {
    margin: 0,
    width: '100%',
    height: '85vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '.hide_mobile': {
      display: 'none',
    },
    '.grid_login': {
      width: '100%',
    },
    '.loginContainer': {
      marginTop: '15vh',
    },
  },
  // tablet
  [theme.breakpoints.up('md')]: {
    margin: '0 auto',
    width: '100%',
    maxHeight: '85vh',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    '.decor_img_login': {},
  },
  // desktop
  [theme.breakpoints.up('lg')]: {
    margin: '0 auto',
    width: '50%',
    maxHeight: '85vh',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
}));

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

  useEffect(() => {
    console.log('ru5');

    if (!exceptionErr) return;
    setTimeout(() => {
      setExceptionError(null);
    }, 3000);
  }, [exceptionErr]);

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
  if (error) setExceptionError(error);
  return (
    <ThemeProvider theme={theme}>
      <ResponsiveBox>
        <Grid
          className='loginContainer'
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
                        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1em' }}
                      >
                        <InputField name='userNameOrEmail' label='User Name' type='text' />
                        <InputField name='password' label='Password' type='password' />
                      </Box>
                      {exceptionErr && <Alert severity='error'>{exceptionErr}</Alert>}
                      <Box sx={{ display: 'flex', gap: '.5em', alignItems: 'center' }}>
                        <LoadingButton
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
                              border: `2px solid ${theme.palette.upvoteButton.main} `,
                              color: theme.palette.upvoteButton.main,
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
                    </Box>
                    {isSubmitting && loginLoading && <LinearProgress />}
                  </Form>
                )}
              </Formik>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <NextLink href='/account/forgotPassword'>
                  <Button
                    sx={{
                      width: 'fit-content',
                      margin: '1em',
                      textDecoration: 'underline',
                      textTransform: 'lowercase',
                    }}
                  >
                    Forgot password
                  </Button>
                </NextLink>
              </Box>
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
  );
};

export default Login;
