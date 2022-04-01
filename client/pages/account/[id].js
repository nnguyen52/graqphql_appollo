import React, { useState } from 'react';
import AuthEdit from '../../components/AuthEdit';
import { useQuery } from '@apollo/client';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert, LinearProgress, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { Query_getUserByID } from '../../graphql-client/queries/getUserByID';
import NextLink from 'next/link';

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
    </Box>
  );
};
export default Account;
