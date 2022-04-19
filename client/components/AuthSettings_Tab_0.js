import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { Avatar, Box, Alert } from '@mui/material';
import { dateFormat } from '../src/utils/dateFormat';
import noPictureImg from '../assets/noPicture.png';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Mutation_savePost } from '../graphql-client/mutations/savePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';
import { LoadingButton } from '@mui/lab';
import { Mutation_unsavePost } from '../graphql-client/mutations/unsavePost';
import { handleSavePost, handleUnsavePost } from '../src/utils/savePost_unsavePost';

const AuthSettings_Tab_0 = ({ data, pageInfo, value }) => {
  const { data: dataMe, loading: loadingMe, refetch: refetchMe } = useQuery(Query_me);
  const [savePost, { loading: loadingSavePost }] = useMutation(Mutation_savePost);
  const [unsavePost, { loading: loadingUnsavePost }] = useMutation(Mutation_unsavePost);
  return (
    <Box className='tab_0'>
      {data.map((each, index) => {
        return (
          <AuthSettings_Tab_0_Detail
            dataMe={dataMe}
            loadingMe={loadingMe}
            savePost={savePost}
            loadingSavePost={loadingSavePost}
            unsavePost={unsavePost}
            loadingUnsavePost={loadingUnsavePost}
            refetchMe={refetchMe}
            data={data}
            index={index}
            each={each}
          />
        );
      })}
    </Box>
  );
};

const AuthSettings_Tab_0_Detail = ({
  data,
  each,
  index,
  savePost,
  loadingSavePost,
  unsavePost,
  loadingUnsavePost,
  dataMe,
  loadingMe,
  refetchMe,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const { data: dataSaveposts, loading: loadingDataSaveposts } = useQuery(Query_getSaveposts);
  const [savePostResult, setSavePostResult] = useState({ success: null, message: null });
  const [unsavePostResult, setUnsavePostResult] = useState({ success: null, message: null });

  return (
    <Box
      sx={{
        border: '1px solid grey',
        borderBottom: index !== data.length - 1 ? 'none' : '1px solid grey',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding: '10px 0 10px 0',
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
              <OpenInFullIcon onClick={() => setIsExpanding((prev) => !prev)} />
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
            {/* save  */}
            {!dataSaveposts?.getSavePosts?.data?.posts
              .map((each) => each._id.toString())
              .includes(each._id.toString()) && (
              <LoadingButton
                sx={{ color: 'black' }}
                loading={loadingMe && loadingDataSaveposts && loadingSavePost}
                onClick={async () =>
                  await handleSavePost({
                    loadingMe,
                    dataMe,
                    refetchMe,
                    savePost,
                    dataSaveposts,
                    setSavePostResult,
                    each,
                  })
                }
              >
                <BookmarkAddIcon />
                <b> Save</b>
              </LoadingButton>
            )}
            {dataSaveposts?.getSavePosts?.data?.posts
              .map((each) => each._id.toString())
              .includes(each._id.toString()) && (
              <LoadingButton
                sx={{ color: 'black' }}
                loading={loadingMe && loadingDataSaveposts && loadingUnsavePost}
                onClick={() =>
                  handleUnsavePost({
                    loadingMe,
                    dataMe,
                    refetchMe,
                    unsavePost,
                    dataSaveposts,
                    setUnsavePostResult,
                    each,
                  })
                }
              >
                <BookmarkRemoveIcon />
                <b> Unsave</b>
              </LoadingButton>
            )}
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
      {/* {savePostResult?.message && (
        <Alert severity={savePostResult.code != 200 ? 'error' : 'success'}>
          {savePostResult.message}
        </Alert>
      )}
      {unsavePostResult?.message && (
        <Alert severity={unsavePostResult.code != 200 ? 'error' : 'success'}>
          {unsavePostResult.message}
        </Alert>
      )} */}
      {isExpanding && (
        <Box>
          <Box
            dangerouslySetInnerHTML={{ __html: each.content }}
            sx={{
              padding: '1em 20% 1em 1em',
            }}
          />
        </Box>
      )}
    </Box>
  );
};
export default AuthSettings_Tab_0;
