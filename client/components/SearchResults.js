import React from 'react';
import { Modal, Card, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const SearchResults = ({
  postsResult,
  usersResult,
  searchPostsPagination,
  setSearchPostsPagination,
  searchUsersPagination,
  setSearchUsersPagination,
  searchPosts,
  searchUsers,
  closeSearchResult,
  openSearchResult,
  setOpenSearchResult,
  setUsersResult,
  setPostsResult,
  input,
}) => {
  const router = useRouter();
  const fetchMoreSearchPosts = async () => {
    await searchPosts({
      variables: {
        input,
        cursor: searchPostsPagination.endCursor.toString(),
      },
      update(cache, { data }) {
        if (data?.searchPosts?.data?.posts.length > 0) {
          setPostsResult([...postsResult.concat(data?.searchPosts?.data?.posts)]);
          if (data?.searchPosts?.data?.pageInfo?.hasNextPage)
            setSearchPostsPagination(data?.searchPosts?.data?.pageInfo);
          else
            setSearchPostsPagination({
              endCursor: null,
              hasNextPage: false,
            });
        }
      },
    });
  };
  const fetchMoreSearchUsers = async () => {
    await searchUsers({
      variables: {
        input,
        cursor: searchUsersPagination.endCursor.toString(),
      },
      update(cache, { data }) {
        if (data?.searchUsers?.data?.users.length > 0) {
          setUsersResult([...usersResult.concat(data?.searchUsers?.data?.users)]);
          if (data?.searchUsers?.data?.pageInfo?.hasNextPage)
            setSearchUsersPagination(data?.searchUsers?.data?.pageInfo);
          else
            setSearchUsersPagination({
              endCursor: null,
              hasNextPage: false,
            });
        }
      },
    });
  };

  return (
    <Modal
      open={openSearchResult}
      onClose={() => {
        closeSearchResult();
        setOpenSearchResult(false);
      }}
    >
      <Card
        className='searchResults'
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          display: 'flex',
          flexWrap: 'no-wrap',
          flexDirection: 'column',
          transform: 'translate(-50%, -100%)',
          zIndex: 9999,
          width: '60%',
          height: '200px',
          overflow: 'auto',
          background: 'white',
          borderRadius: '.8em',
        }}
      >
        <CloseIcon
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: 'red',
            cursor: 'pointer',
          }}
          onClick={() => {
            closeSearchResult();
            setOpenSearchResult(false);
          }}
        />
        <b
          style={{
            padding: '.5em',
            width: '100%',
          }}
        >
          <u> Posts </u>
        </b>
        {postsResult.length > 0 ? (
          <>
            {postsResult.map((each, index) => {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '.5em',
                    borderBottom: '1px solid grey',
                    '&:hover': {
                      background: '#f4f4f4',
                      cursor: 'pointer',
                    },
                  }}
                  key={each._id + index}
                  onClick={() => {
                    closeSearchResult();
                    setOpenSearchResult(false);
                    router.push(`/post/${each._id.toString()}/detail `);
                  }}
                >
                  {each.title}
                </Box>
              );
            })}
            {searchPostsPagination.hasNextPage && (
              <>
                <LoadingButton onClick={fetchMoreSearchPosts}>See more posts...</LoadingButton>
              </>
            )}
          </>
        ) : (
          'No posts'
        )}
        <b style={{ padding: '.5em', width: '100%' }}>
          <u> Users</u>
        </b>
        {usersResult.length > 0 && (
          <>
            {usersResult.map((each, index) => {
              return (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      padding: '.5em',
                      borderBottom: '1px solid grey',
                      borderBottom: '1px solid grey',
                      '&:hover': {
                        background: '#f4f4f4',
                        cursor: 'pointer',
                      },
                    }}
                    key={each._id - index}
                    onClick={() => {
                      closeSearchResult();
                      setOpenSearchResult(false);
                      router.push(`/account/${each.id.toString()}`);
                    }}
                  >
                    {each.userName}
                  </Box>
                </>
              );
            })}
            {searchUsersPagination.hasNextPage && (
              <>
                <LoadingButton onClick={fetchMoreSearchUsers}>See more users...</LoadingButton>
              </>
            )}
          </>
        )}
      </Card>
    </Modal>
  );
};

export default SearchResults;
