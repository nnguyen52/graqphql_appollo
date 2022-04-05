import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Query_getPostByID } from '../../../graphql-client/queries/getPostByID';
import { Box, Alert, LinearProgress } from '@mui/material';
import Post from '../../../components/Post';
import { styled } from '@mui/material/styles';

const PostDetailResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {},
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));
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
    <PostDetailResponsive>
      <Box
        className='postDetailContainer'
        sx={{
          paddingBottom: '1em',
        }}
      >
        <Post data={data?.getPostByID?.data} detail={true} />
      </Box>
    </PostDetailResponsive>
  );
};

export default PostDetail;
