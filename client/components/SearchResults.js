import React from 'react';
import { Modal, Card, Box, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { dateFormat } from '../src/utils/dateFormat';
import NextLink from 'next/link';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonIcon from '@mui/icons-material/Person';

const ResponsiveModal = styled('div')(({ theme }) => ({
  // mobile
  [theme.breakpoints.down('md')]: {
    '.searchResults': { width: '90%', height: '80vh' },
  },
  // tablet
  [theme.breakpoints.up('md')]: {
    '.searchResults': { width: '80%', height: '80vh' },
  },
  // desktop
  [theme.breakpoints.up('lg')]: {
    '.searchResults': { width: '60%', height: '90vh' },
  },
}));
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
    <>
      <Modal
        sx={{
          zIndex: 9999,
        }}
        open={openSearchResult}
        onClose={() => {
          closeSearchResult();
          setOpenSearchResult(false);
        }}
      >
        <ResponsiveModal>
          <Box
            className='searchResults'
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Card
              sx={{
                position: 'relative',
                display: 'flex',
                flexWrap: 'no-wrap',
                flexDirection: 'column',
                overflow: 'auto',
                background: 'white',
                borderRadius: '.8em',
                height: '100%',
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
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                <b
                  style={{
                    padding: '.5em',
                    width: '100%',
                  }}
                >
                  <u> Posts </u>
                </b>
                <NewspaperIcon />
              </Box>
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
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                          Posted by&nbsp;
                          <NextLink href={`/post/${each._id.toString()}/detail`}>
                            <Box
                              sx={{
                                fontWeight: 'bold',
                                '&:hover': {
                                  textDecoration: 'underline  ',
                                },
                              }}
                            >
                              {each?.user?.userName}
                            </Box>
                          </NextLink>
                          <Avatar src={each?.user?.avatar} alt={each?.user?.userName} />(
                          {dateFormat(each.createdAt.toString())})
                        </Box>
                        {`${each.title.slice(0, 50)}...`}
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', padding: '.5em' }}>
                            <ChatBubbleIcon sx={{ marginRight: '.2em' }} />
                            <b>
                              {each?.comments.length}{' '}
                              {each?.comments.length > 0 ? `Comments` : `Comment`}
                            </b>
                          </Box>
                          <h4>Share feature...</h4>
                        </Box>
                      </Box>
                    );
                  })}
                  {searchPostsPagination.hasNextPage && (
                    <>
                      <LoadingButton onClick={fetchMoreSearchPosts}>
                        See more posts...
                      </LoadingButton>
                    </>
                  )}
                </>
              ) : (
                'No posts'
              )}
              <br />
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                <b style={{ padding: '.5em', width: '100%' }}>
                  <u> Users</u>
                </b>
                <PersonIcon />
              </Box>
              {usersResult.length > 0 && (
                <>
                  {usersResult.map((each, index) => {
                    return (
                      <Box
                        sx={{
                          width: '100%',
                          borderBottom: '1px solid grey',
                          '&:hover': {
                            background: '#f4f4f4',
                            cursor: 'pointer',
                          },
                        }}
                        onClick={() => {
                          closeSearchResult();
                          setOpenSearchResult(false);
                          router.push(`/account/${each.id.toString()}`);
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: index % 2 ? 'row-reverse' : 'row',
                            width: 'fit-content',
                            padding: '.5em',
                            gap: '1em',
                            alignItems: 'center',
                          }}
                          key={each._id - index}
                        >
                          <Avatar src={each?.avatar} alt={each.userName} />
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <b>{each.userName}</b>
                            {each?.about}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                  {searchUsersPagination.hasNextPage && (
                    <>
                      <LoadingButton onClick={fetchMoreSearchUsers}>
                        See more users...
                      </LoadingButton>
                    </>
                  )}
                </>
              )}
            </Card>
          </Box>
        </ResponsiveModal>
      </Modal>
    </>
  );
};

export default SearchResults;
