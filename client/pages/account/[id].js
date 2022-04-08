import React, { useEffect, useState } from 'react';
import AuthEdit from '../../components/AuthEdit';
import { useMutation, useQuery } from '@apollo/client';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert, LinearProgress, Button, Box, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import { Query_getUserByID } from '../../graphql-client/queries/getUserByID';
import NextLink from 'next/link';
import { checkImageUpload, imageUpload } from '../../src/utils/uploadImage';
import Image from 'next/image';
import { Mutation_editMe } from '../../graphql-client/mutations/editMe';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import theme from '../../src/theme';
import { ThemeProvider } from '@mui/material/styles';

import { styled } from '@mui/material/styles';

const AccountResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.notloggedinAccount': {
      marginTop: '20%',
      width: '100%',
    },
    '.notloggedinAccount .container': {
      flexDirection: 'column',
      width: '100%',
    },
    '.loggedinAccount': {
      marginTop: '20%',
      width: '100%',
    },
    '.loggedinAccount .avatarContainer': {
      width: '7em',
      height: '7em',
    },
    '.loggedinAccount .btn': {
      padding: '5px',
      width: '1.5em',
      height: '1.5em',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.loggedinAccount .btn': {
      width: '2em',
      height: '2em',
      fontSize: '1em',
      padding: '2px',
    },
    '.loggedinAccount': {
      width: '80%',
      margin: '0 auto',
    },
  },
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));

const hideEmail = (email) => {
  let hiddenMail = '';
  // case1: abc@gmail.com
  if (email.split('@').length == 2) {
    for (let i = 0; i < email.split('@')[0].length; i++) hiddenMail += '*';
    hiddenMail += `@${email.split('@')[1]}`;
    return hiddenMail;
  }
  // case2:  xyz@123@abc@gmail.com
  else {
    const joinedHiddenMail = email
      .split('@')
      .slice(0, email.split('@').length - 1)
      .join('@');
    for (let i = 0; i < joinedHiddenMail.length; i++) hiddenMail += '*';
    hiddenMail += `@${email.split('@')[email.split('@').length - 1]}`;
    return hiddenMail;
  }
};
const Account = () => {
  const router = useRouter();
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);
  const { data: dataUserByID, loading: loadingDataUserByID } = useQuery(Query_getUserByID, {
    variables: {
      id: router?.query?.id ? router?.query?.id.toString() : '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);

  // if loading
  if (loadingMe || loadingDataUserByID) return <LinearProgress />;
  // if user not login
  if (!loadingMe && !dataMe?.me?.network.success)
    return (
      <AccountResponsive>
        <Alert
          className='notloggedinAccount'
          sx={{ display: 'flex', alignItems: 'center' }}
          severity='error'
        >
          <Box className='container' sx={{ display: 'flex', alignItems: 'center' }}>
            <span>Please login to see these contents!</span> &nbsp;
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Don't have an account?
              <NextLink href='/register'>
                <Button>Register</Button>
              </NextLink>
            </Box>
          </Box>
        </Alert>
      </AccountResponsive>
    );
  // if user not found
  if (!dataUserByID?.getUserByID?.data && dataMe?.me?.network.success)
    return (
      <AccountResponsive>
        <Alert className='notloggedinAccount' severity='error'>
          User not found
        </Alert>
      </AccountResponsive>
    );
  return (
    <>
      <AccountResponsive>
        <Box className='loggedinAccount'>
          <UserInfo
            isEditing={isEditing}
            data={
              dataMe?.me?.data && router.query.id.toString() == dataMe?.me?.data?._id.toString()
                ? dataMe?.me?.data
                : dataUserByID?.getUserByID?.data
            }
          />
          <hr />
          {dataMe?.me?.data?._id.toString() == router.query?.id.toString() && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Button
                  variant='contained'
                  sx={{
                    margin: '1em',
                    color: 'white',
                    background: isEditing ? '#bc074c' : 'green',
                    '&:hover': {
                      color: 'white',
                      background: isEditing ? 'crimson' : '#24d645',
                    },
                  }}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {!isEditing ? 'Edit Profile' : 'Cancel'}
                </Button>
                <hr />
              </Box>
              {isEditing && <AuthEdit setIsEditing={setIsEditing} me={dataMe.me} />}
            </>
          )}
        </Box>
      </AccountResponsive>
    </>
  );
};
const UserInfo = ({ data, isEditing }) => {
  const router = useRouter();
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);
  const [avatar, setAvatar] = useState(null);
  const [images, setImages] = useState([]);
  const [checkImgSizeMsg, setCheckImgSizeMsg] = useState({
    code: null,
    message: null,
  });
  const [editMe, { loading: loadingEditMe }] = useMutation(Mutation_editMe);

  useEffect(() => {
    setAvatar(null);
    setImages([]);
    setCheckImgSizeMsg({ code: null, message: null });
  }, [isEditing]);

  useEffect(() => {
    if (checkImgSizeMsg.message == null) return;
    setTimeout(() => {
      setAvatar(null);
      setImages([]);
      setCheckImgSizeMsg({
        code: null,
        message: null,
      });
    }, 3000);
  }, [checkImgSizeMsg.message]);

  const changeAvatar = (e) => {
    if (loadingMe || loadingEditMe) return;
    const file = e.target.files[0];
    const err = checkImageUpload(file);
    if (err) {
      setAvatar(null);
      setImages([]);
      setCheckImgSizeMsg({
        code: 400,
        message: err,
      });
    } else {
      setAvatar(file);
      setImages([file]);
    }
  };

  const upload = async () => {
    if (loadingMe || loadingEditMe) return;
    try {
      const media = await imageUpload(images);
      // delete current avatar in cloud
      await editMe({
        variables: {
          newUserInfo: {
            userName: data.userName,
            email: data.email,
            avatar: media[0].url.toString(),
          },
        },
        update(cache, { data }) {
          if (!data?.editMe?.network?.success) {
            setAvatar(null);
            setImages([]);
            return setCheckImgSizeMsg({
              code: 400,
              message: data?.editMe?.network?.errors[0]
                ? data?.editMe?.network?.errors[0]?.message
                : data?.editMe?.network?.message,
            });
          }
          cache.writeQuery({
            query: Query_me,
            data: {
              me: {
                network: { ...dataMe.me.network },
                data: { ...data.editMe.data },
              },
            },
          });
          setAvatar(null);
          setImages([]);
          setCheckImgSizeMsg({
            code: 200,
            message: data.editMe.network.message,
          });
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <>
        <Box
          sx={{
            padding: '1em',
            display: 'flex',
          }}
        >
          <Box sx={{ width: '70%' }}>
            {!isEditing ? (
              <>
                {dataMe?.me?.data?._id.toString() == router.query?.id.toString() ? (
                  <h2>Hello, {data.userName}!</h2>
                ) : (
                  <>
                    <h2>{`${data.userName}'s profile:`}</h2>
                  </>
                )}
                <span style={{ color: theme.palette.downvoteButton.main }}> userName</span>:
                <b> {data.userName}</b> <br />
                <span style={{ color: theme.palette.downvoteButton.main }}>email</span>:
                <b>{hideEmail(data.email)}</b> <br />
                <span style={{ color: theme.palette.upvoteButton.main }}>karma</span>:
                <b>{data.karma}</b>
                <br />
              </>
            ) : (
              <h2>You are in editing mode!</h2>
            )}
          </Box>
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 'fit-content',
                position: 'relative',
                margin: '0 auto',
              }}
            >
              <Box
                className='avatarContainer'
                sx={{
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  height: '200px',
                  width: '200px',
                }}
              >
                <Image
                  width={'100%'}
                  height={'100%'}
                  src={avatar ? `${URL.createObjectURL(avatar)}` : data?.avatar}
                  alt='picture from cloud deleted (alt text)'
                  layout='responsive'
                />
              </Box>
              {dataMe?.me?.data?._id.toString() == router?.query?.id.toString() && (
                <>
                  <Tooltip title='Edit' arrow>
                    <input
                      style={{
                        zIndex: 9001,
                        position: 'absolute',
                        top: 7,
                        right: -5,
                        width: '1.6em',
                        fontSize: '1.6em',
                        opacity: 0,
                      }}
                      // multiple
                      // only accept 1 img
                      type='file'
                      name='file'
                      id='file_up'
                      accept='image/*'
                      onChange={changeAvatar}
                    />
                  </Tooltip>
                  <SettingsIcon
                    sx={{
                      border: '2px solid black',
                      borderRadius: '50%',
                      zIndex: 9000,
                      position: 'absolute',
                      top: 10,
                      right: 0,
                      width: '1.2em',
                      height: '1.2em',
                      padding: 0,
                    }}
                  />
                  {images.length > 0 && (
                    <>
                      {loadingMe || loadingEditMe ? (
                        <HourglassBottomIcon />
                      ) : (
                        <SaveIcon
                          className='btn'
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            borderRadius: '50%',
                            background: theme.palette.upvoteButton.main,
                            color: 'white',
                            borderRadius: '5px',
                            '&:hover': {
                              background: '#ffbf1e',
                            },
                          }}
                          onClick={upload}
                        />
                      )}
                    </>
                  )}
                  {images.length > 0 && (
                    <>
                      {loadingMe || loadingEditMe ? (
                        <HourglassBottomIcon />
                      ) : (
                        <CancelIcon
                          className='btn'
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            borderRadius: '50%',
                            color: 'white',
                            background: '#bc074c',
                            '&:hover': {
                              color: 'white',
                              background: 'crimson',
                            },
                          }}
                          onClick={() => {
                            setAvatar(null);
                            setImages([]);
                            setCheckImgSizeMsg({
                              code: null,
                              message: null,
                            });
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
        {checkImgSizeMsg?.message && (
          <Alert severity={checkImgSizeMsg.code !== 200 ? 'error' : 'success'}>
            {checkImgSizeMsg.message}
          </Alert>
        )}
      </>
    </ThemeProvider>
  );
};
export default Account;
