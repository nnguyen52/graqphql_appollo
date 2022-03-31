import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Query_getPostByID } from '../../graphql-client/queries/getPostByID';
import { Alert, Button, LinearProgress } from '@mui/material';
import Post from '../../components/Post';
import NextLink from 'next/link';

const PostDetail = () => {
  const router = useRouter();
  const { data, loading } = useQuery(Query_getPostByID, {
    variables: { id: router?.query?.id?.toString() },
  });
  if (loading) return <LinearProgress />;
  if (
    !loading &&
    data?.getPostByID?.network?.code == 500 &&
    data?.getPostByID?.network?.code == 400 &&
    data?.getPostByID?.network?.data == null
  ) {
    return <Alert severity='error'>Post Not Found</Alert>;
  }
  return (
    <>
      <Post data={data?.getPostByID?.data} />
      <NextLink href='/'>
        <Button
          variant='outline'
          sx={{
            bgcolor: 'black',
            color: 'white',
            marginTop: '1em',
            maxHeight: '2em',
            fontSize: '.8em',
            '&.MuiButtonBase-root:hover': {
              bgcolor: '#2ba069',
              color: 'white',
            },
          }}
        >
          Homepage
        </Button>
      </NextLink>
    </>
  );
};

export default PostDetail;
