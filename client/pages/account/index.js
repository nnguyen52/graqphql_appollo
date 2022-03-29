import { useQuery } from '@apollo/client';
import React from 'react';
import AuthEdit from '../../components/AuthEdit';
import { Query_me } from '../../graphql-client/queries/user';
import { Alert } from '@mui/material';

const Account = () => {
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
  const { data: dataMe, loading: loadingMe } = useQuery(Query_me);
  if (loadingMe)
    return (
      <>
        <h2>Authenticating...</h2>
      </>
    );
  if (!loadingMe && !dataMe?.me?.network.success)
    return <Alert severity='error'>Please login to see this content!</Alert>;
  return (
    <div>
      <h2>Info</h2>
      userName: {dataMe.me.data.userName} <br />
      email: {hideEmail(dataMe.me.data.email)}
      <hr />
      <h2>Edit</h2>
      <AuthEdit me={dataMe.me} />
    </div>
  );
};

export default Account;
