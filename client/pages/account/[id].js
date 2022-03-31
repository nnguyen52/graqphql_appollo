import { useQuery } from '@apollo/client';
import React from 'react';
import AuthEdit from '../../components/AuthEdit';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { Query_getUserByID } from '../../graphql-client/queries/getUserByID';

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
  // if loading
  if (loadingMe || loadingDataUserByID) return <LinearProgress />;
  // if user not login
  if (!loadingMe && !dataMe?.me?.network.success)
    return <Alert severity='error'>Please login to see these contents!</Alert>;
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
          <h2>Edit</h2>
          <AuthEdit me={dataMe.me} />
        </>
      )}
    </div>
  );
};
const UserInfo = ({ data }) => {
  return (
    <>
      <h2>Info</h2>
      userName: {data.userName} <br />
      email: {hideEmail(data.email)} <br />
      <span style={{ color: 'orange' }}>karma</span>: {data.karma}
    </>
  );
};
export default Account;
