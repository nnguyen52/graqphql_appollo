import React, { useState } from 'react';
import { Modal, Card, Box, Avatar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { dateFormat } from '../src/utils/dateFormat';
import NextLink from 'next/link';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PersonIcon from '@mui/icons-material/Person';
import ShareButtons from './ShareButtons';
import { styled } from '@mui/material/styles';

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
  msgPostsResult,
  setMsgPostsResult,
  msgUsersResult,
  setMsgUsersResult,
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
          setMsgPostsResult(data?.searchPosts?.network?.message);
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
          setMsgUsersResult(data?.searchUsers?.network?.message);
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
                      <PostResult_detail
                        kep={each}
                        each={each}
                        index={index}
                        setOpenSearchResult={setOpenSearchResult}
                        closeSearchResult={closeSearchResult}
                      />
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
                <Box sx={{ padding: '1em' }}>
                  <Alert>
                    <b>{msgPostsResult}</b>
                  </Alert>
                </Box>
              )}
              <br />
              <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                <b style={{ padding: '.5em', width: '100%' }}>
                  <u> Users</u>
                </b>
                <PersonIcon />
              </Box>
              {usersResult.length > 0 ? (
                <>
                  {usersResult.map((each, index) => {
                    return (
                      <Box
                        key={each}
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
                          router.push(`/account/${each._id.toString()}`);
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
                          <Avatar src={each?.avatar} alt={each?.userName.toUpperCase()} />
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
              ) : (
                <Box sx={{ padding: '1em' }}>
                  <Alert severity='error'>
                    <b>{msgUsersResult}</b>
                  </Alert>
                </Box>
              )}
            </Card>
          </Box>
        </ResponsiveModal>
      </Modal>
    </>
  );
};
const PostResult_detail = ({ each, index, closeSearchResult, setOpenSearchResult }) => {
  const router = useRouter();
  const [openShareButtons, setOpenShareButtons] = useState(false);
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
    >
      <Box
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
          <Avatar src={each?.user?.avatar} alt={each?.user?.userName.toUpperCase()} />(
          {dateFormat(each.createdAt.toString())})
        </Box>
        {`${each.title.slice(0, 50)}...`}
      </Box>
      {/* menu */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          '&:hover': {
            borderTop: '1px solid lightgrey',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '.5em' }}>
          <ChatBubbleOutlineIcon sx={{ marginRight: '.2em' }} />
          <b>
            {each?.comments.length} {each?.comments.length > 0 ? `Comments` : `Comment`}
          </b>
        </Box>
        <Box className='centerItemsVertical' onClick={() => setOpenShareButtons((prev) => !prev)}>
          <ShareIcon />
          <b>Share</b>
        </Box>
      </Box>
      {/* share buttons */}
      {openShareButtons && (
        <Box>
          <ShareButtons />
        </Box>
      )}
    </Box>
  );
};
export default SearchResults;
