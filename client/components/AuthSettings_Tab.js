import { Avatar, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { dateFormat } from '../src/utils/dateFormat';
import noPictureImg from '../assets/noPicture.png';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { styled } from '@mui/material/styles';

const ResponsiveAuthSettings_Tab = styled('div')(({ theme }) => ({
  // mobile
  [theme.breakpoints.down('md')]: {},
  // tablet
  [theme.breakpoints.up('md')]: {
    '.tab_0 .tab_0_settings > *': {
      padding: '10px',
      display: 'flex',
      justifyItems: 'center',
      cursor: 'pointer',
      '&:hover': {
        background: 'lightgrey',
      },
    },
  },
}));

// tab0 :posts
// tab1 :comments
// tab2 :saveds
// tab3 :upvoteds
// tab4: downvoteds
const AuthSettings_Tab = ({ dataRaw, loading, value }) => {
  if (!dataRaw || loading) return <>loading...</>;
  if (value == 0 && !loading && (dataRaw?.data || dataRaw.network)) {
    return (
      <AuthSettings_Tab_0 data={dataRaw.data.posts} pageInfo={dataRaw.data.pageInfo} value={0} />
    );
  }
  if (value == 1 && !loading && (dataRaw?.data || dataRaw.network)) {
    return (
      <AuthSettings_Tab_1 data={dataRaw.data.comments} pageInfo={dataRaw.data.pageInfo} value={1} />
    );
  }
  if ((value == 3 || value == 4) && !loading && (dataRaw?.data || dataRaw.network)) {
    return (
      <AuthSettings_Tab_0
        data={dataRaw.data.posts}
        pageInfo={dataRaw.data.pageInfo}
        value={value}
      />
    );
  }
  return <></>;
};

const AuthSettings_Tab_0 = ({ data, pageInfo, value }) => {
  return (
    <ResponsiveAuthSettings_Tab>
      <Box className='tab_0'>
        {data.map((each) => {
          return (
            <Box
              sx={{
                border: '1px solid grey',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  minWidth: '15%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src={
                    each.imageCover
                      ? `https://res.cloudinary.com/cloudinarystore/image/upload/v1649382290/${each.imageCover}.jpg`
                      : noPictureImg.src
                  }
                  alt='imageCover'
                  width='150px'
                  height='100px'
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  gap: '.5em',
                  flexDirection: 'column',
                  border: '1px solid blue',
                }}
              >
                {/* title */}
                {each.title}
                {/* author */}
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    flex: 1,
                    gap: '.2em',
                  }}
                >
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
                {/*  settings: expand-comments-share-bookmark-hide-extras */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className='tab_0_settings'
                >
                  {/* expand */}
                  <Box>
                    <OpenInFullIcon />
                  </Box>
                  {/* comments */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChatBubbleOutlineIcon />
                    <b>
                      {each?.comments.length} {each?.comments.length > 0 ? `Comments` : `Comment`}
                    </b>
                  </Box>
                  {/* share */}
                  <Box>
                    <ShareIcon />
                    <b> Share</b>
                  </Box>
                  {/* bookmark */}
                  <Box>
                    <BookmarkAddIcon />
                    <b> Save</b>
                  </Box>
                  {/* hide */}
                  <Box>
                    <VisibilityOffIcon />
                    <b> Hide</b>
                  </Box>
                  {/* edit */}
                  <Box>
                    <EditIcon />
                    <b> Edit Post</b>
                  </Box>
                  {/* extras */}
                  <Box>
                    <MoreHorizIcon />
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </ResponsiveAuthSettings_Tab>
  );
};

const AuthSettings_Tab_1 = ({ data, pageInfo, value }) => {
  return (
    <Box>
      {data.map((each) => {
        return (
          <>
            <h3> {each.content} </h3>
          </>
        );
      })}
    </Box>
  );
};
export default AuthSettings_Tab;
