import React from 'react';
import { Alert, Box, LinearProgress } from '@mui/material';
import CreatePost from '../../components/CreatePost';
import { Query_me } from '../../graphql-client/queries/user';
import { useQuery } from '@apollo/client';

const Create = () => {
  const { data: meData, loading: loadingMe } = useQuery(Query_me);
  return (
    <Box>
      {!meData?.me?.data && loadingMe && <LinearProgress />}
      {!meData?.me?.data && !loadingMe && (
        <Alert severity='error'>{meData?.me?.network.message}</Alert>
      )}
      {!loadingMe && meData?.me?.data && <CreatePost />}
    </Box>
  );
};

export default Create;
