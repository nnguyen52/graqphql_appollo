import React, { useState } from 'react';
import AuthEdit from '../../components/AuthEdit';
import { useMutation, useQuery } from '@apollo/client';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert, LinearProgress, Button, Box, Input } from '@mui/material';
import { useRouter } from 'next/router';
import { Query_getUserByID } from '../../graphql-client/queries/getUserByID';
import NextLink from 'next/link';
import { checkImageUpload, imageUpload } from '../../src/utils/uploadImage';
import Image from 'next/image';
import { Mutation_editMe } from '../../graphql-client/mutations/editMe';

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
      <Alert
        severity='error'
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            Don't have an account?
            <NextLink href='/register'>
              <Button>Register</Button>
            </NextLink>
          </Box>
        }
      >
        Please login to see these contents!
      </Alert>
    );
  // if user not found
  if (!dataUserByID?.getUserByID?.data && dataMe?.me?.network.success)
    return <Alert severity='error'>User not found</Alert>;
  return (
    <div>
      <UserInfo
        data={
          dataMe?.me?.data && router.query.id.toString() == dataMe?.me?.data?.id.toString()
            ? dataMe?.me?.data
            : dataUserByID?.getUserByID?.data
        }
      />
      <hr />
      {dataMe?.me?.data?.id.toString() == router.query?.id.toString() && (
        <>
          <Button
            variant='contained'
            sx={{
              margin: '1em',
            }}
            onClick={() => setIsEditing(!isEditing)}
          >
            Edit Profile
          </Button>
          {isEditing && <AuthEdit me={dataMe.me} />}
          <hr />
        </>
      )}
    </div>
  );
};
const UserInfo = ({ data }) => {
  const [avatar, setAvatar] = useState(null);
  const [images, setImages] = useState([]);
  const [editMe, { loading: loadingEditMe }] = useMutation(Mutation_editMe);
  const changeAvatar = (e) => {
    const file = e.target.files[0];

    const err = checkImageUpload(file);
    if (err) return console.log(err);
    else {
      setAvatar(file);
      setImages([...images, file]);
    }
  };
  const upload = async () => {
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
        update(cache, { data }) {},
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box
      sx={{
        padding: '1em',
      }}
    >
      <h2>Hello, {data.userName}!</h2>
      <span style={{ color: 'blue' }}> userName</span>: <b> {data.userName}</b> <br />
      <span style={{ color: 'blue' }}>email</span>: <b>{hideEmail(data.email)}</b> <br />
      <span style={{ color: 'orange' }}>karma</span>: <b>{data.karma}</b>
      <br />
      {avatar && (
        <Image
          src={`${URL.createObjectURL(avatar)}`}
          alt='picture from cloud deleted (alt text)'
          width={100}
          height={100}
        />
      )}
      <input
        // multiple
        // only accept 1 img
        type='file'
        name='file'
        id='file_up'
        accept='image/*'
        onChange={changeAvatar}
      />
      <button onClick={() => console.log(images)}>images</button>
      <button onClick={upload}>upload</button>
      <button onClick={() => deleteImage()}>delete testting</button>
    </Box>
  );
};
export default Account;
