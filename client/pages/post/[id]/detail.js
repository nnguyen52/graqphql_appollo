import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Query_getPostByID } from '../../../graphql-client/queries/getPostByID';
import { Box, Alert, LinearProgress } from '@mui/material';
import Post from '../../../components/Post';

const PostDetail = () => {
  const router = useRouter();
  const { data, loading } = useQuery(Query_getPostByID, {
    variables: { id: router?.query?.id?.toString() },
  });
  if (loading) return <LinearProgress />;
  if (
    !loading &&
    (data?.getPostByID?.network?.code == 500 ||
      data?.getPostByID?.network?.code == 400 ||
      !data?.getPostByID?.data)
  ) {
    return <Alert severity='error'>Post Not Found</Alert>;
  }
  return (
    <Box
      sx={{
        paddingBottom: '1em',
      }}
    >
      <Post data={data?.getPostByID?.data} detail={true} />
    </Box>
  );
};

export default PostDetail;
