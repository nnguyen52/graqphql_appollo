import React, { useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import { Avatar, Box } from '@mui/material';
import { dateFormat } from '../src/utils/dateFormat';
import noPictureImg from '../assets/noPicture.png';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Mutation_savePost } from '../graphql-client/mutations/savePost';
import { Query_me } from '../graphql-client/queries/user';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';
import { LoadingButton } from '@mui/lab';
import { Mutation_unsavePost } from '../graphql-client/mutations/unsavePost';
import { handleSavePost, handleUnsavePost } from '../src/utils/savePost_unsavePost';
import { Mutation_unhidePost } from '../graphql-client/mutations/unhidePost';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_getPostsUserVoted } from '../graphql-client/queries/getPostsUserVoted';
import { Query_getHideposts } from '../graphql-client/queries/getHidePosts';
import { Query_getCommentsFromUser } from '../graphql-client/queries/getCommentsFromUser';
import { useRouter } from 'next/router';
import { Query_getPostsFromUser } from '../graphql-client/queries/getPostsFromUser';
import { Mutation_hidePost } from '../graphql-client/mutations/hidePost';
import Nextlink from 'next/link';
import { styled } from '@mui/material/styles';
import ShareButtons from './ShareButtons';

const AuthSettings_Tab_0_Detail_Responsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.AuthSettings_Tab_0_container .AuthSettings_Tab_0 .AuthSettings_Tab_0_main .menu': {
      width: '100%',
      flexWrap: 'wrap',
      gap: '.5em',
      padding: '.2em',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.AuthSettings_Tab_0_container .AuthSettings_Tab_0 .AuthSettings_Tab_0_main .menu': {
      width: '100%',
      flexWrap: 'wrap',
      gap: '.5em',
      padding: '.2em',
    },

    '.AuthSettings_Tab_0_container .AuthSettings_Tab_0 .AuthSettings_Tab_0_main .menu > *': {
      display: 'flex',
      alignItems: 'center',
      padding: '.5em',

      '&:hover': {
        backgroundColor: 'lightgrey',
        cursor: 'pointer',
      },
    },
  },
}));

const AuthSettings_Tab_0 = ({ data, pageInfo, value }) => {
  const router = useRouter();
  const { data: dataMe, loading: loadingMe, refetch: refetchMe } = useQuery(Query_me);
  const [savePost, { loading: loadingSavePost }] = useMutation(Mutation_savePost);
  const [unsavePost, { loading: loadingUnsavePost }] = useMutation(Mutation_unsavePost);
  const { refetch: refetchGetposts } = useQuery(Query_getPosts, { variables: { cursor: '' } });
  const { refetch: refetchGetSaveposts } = useQuery(Query_getSaveposts, {
    variables: { cursor: '' },
  });
  const { refetch: refetchGetHidePosts } = useQuery(Query_getHideposts, {
    variables: { cursor: '' },
  });
  const { refetch: refetchGetPostsUserDownVoted } = useQuery(Query_getPostsUserVoted);
  const { refetch: refetchGetPostsUserUpVoted } = useQuery(Query_getPostsUserVoted, {
    variables: { type: 'upvote' },
  });
  const { refetch: refetchGetCommentsFromUser } = useQuery(Query_getCommentsFromUser, {
    variables: {
      userId: router?.query?.id.toString(),
    },
  });
  const { refetch: refetchGetPostsFromUser } = useQuery(Query_getPostsFromUser, {
    variables: { userId: router?.query?.id?.toString() },
  });
  const [unhidePost] = useMutation(Mutation_unhidePost);
  const [hidePost] = useMutation(Mutation_hidePost);
  return (
    <Box className='tab_0'>
      {data.map((each, index) => {
        return (
          <AuthSettings_Tab_0_Detail_Responsive>
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
              value={value}
              refetchGetposts={refetchGetposts}
              refetchGetSaveposts={refetchGetSaveposts}
              hidePost={hidePost}
              unhidePost={unhidePost}
              refetchGetHidePosts={refetchGetHidePosts}
              refetchGetPostsUserDownVoted={refetchGetPostsUserDownVoted}
              refetchGetPostsUserUpVoted={refetchGetPostsUserUpVoted}
              refetchGetCommentsFromUser={refetchGetCommentsFromUser}
              refetchGetPostsFromUser={refetchGetPostsFromUser}
            />
          </AuthSettings_Tab_0_Detail_Responsive>
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
  value,
  refetchGetposts,
  refetchGetSaveposts,
  hidePost,
  unhidePost,
  refetchGetHidePosts,
  refetchGetPostsUserUpVoted,
  refetchGetPostsUserDownVoted,
  refetchGetCommentsFromUser,
  refetchGetPostsFromUser,
}) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const { data: dataSaveposts, loading: loadingDataSaveposts } = useQuery(Query_getSaveposts);
  const [isSharing, setIsSharing] = useState(false);

  const handleHidePost = async (id) => {
    setTimeout(() => {}, 0);
    await hidePost({
      variables: {
        id: id.toString(),
      },
      update(cache, { data }) {
        if (!data?.hidePost?.network?.success) {
          refetchMe();
          // toastify later
          return;
        }
        refetchGetposts();
        refetchGetHidePosts();
        // no need get savePosts
        refetchGetPostsUserUpVoted();
        refetchGetPostsUserDownVoted();
        refetchGetCommentsFromUser();
        refetchGetPostsFromUser();
      },
    });
  };
  const handleUnhidePost = async () => {
    setTimeout(() => {}, 0);
    await unhidePost({
      variables: {
        id: each._id.toString(),
      },
      update(cache, { data }) {
        if (!data?.unhidePost?.network?.success) {
          // toastify later
          refetchMe();
          return;
        }
        // hide post affect all other tabs (exclude comment tab)
        refetchGetposts();
        refetchGetSaveposts();
        refetchGetHidePosts();
        refetchGetPostsUserUpVoted();
        refetchGetPostsUserDownVoted();
        refetchGetCommentsFromUser();
        refetchGetPostsFromUser();
        refetchGetCommentsFromUser();
      },
    });
  };
  return (
    <Box
      className='AuthSettings_Tab_0_container'
      sx={{
        border: '1px solid grey',
        borderBottom: index !== data.length - 1 ? 'none' : '1px solid grey',
      }}
    >
      <Box
        className='AuthSettings_Tab_0'
        sx={{
          display: 'flex',
          padding: '10px 0 10px 0',
        }}
      >
        {/* imageCover */}
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
        {/* main */}
        <Box
          className='AuthSettings_Tab_0_main'
          sx={{
            display: 'flex',
            flex: 1,
            gap: '.5em',
            flexDirection: 'column',
          }}
        >
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
            <NextLink href={`/account/${each.userId.toString()}`}>
              <>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {each?.user?.userName}
                </Box>
                <Avatar src={each?.user?.avatar} alt={each?.user?.userName.toUpperCase()} />(
                {dateFormat(each.createdAt.toString())})
              </>
            </NextLink>
          </Box>
          <NextLink href={`/post/${each._id.toString()}/detail`}>
            <Box
              sx={{
                padding: '.5em',
              }}
            >
              {/* title */}
              {each.title}
            </Box>
          </NextLink>
          {/*  menu: expand-comments-share-bookmark-hide-extras */}
          <Box
            className='menu'
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
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
            <Box onClick={() => setIsSharing((prev) => !prev)}>
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
                    // setSavePostResult,
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
                    // setUnsavePostResult,
                    each,
                  })
                }
              >
                <BookmarkRemoveIcon />
                <b> Unsave</b>
              </LoadingButton>
            )}
            {/* hide */}
            {value !== 3 && (
              <Box onClick={async () => await handleHidePost(each._id.toString())}>
                <VisibilityOffIcon />
                <b> Hide</b>
              </Box>
            )}
            {value == 3 && (
              <Box onClick={handleUnhidePost}>
                <VisibilityIcon />
                <b> Unhide</b>
              </Box>
            )}
            {/* edit */}
            <Nextlink href={`editPost/${each._id.toString()}`}>
              <Box>
                <EditIcon />
                <b> Edit</b>
              </Box>
            </Nextlink>
            {/* extras */}
            <Box>
              <MoreHorizIcon />
            </Box>
          </Box>
          {isSharing && <ShareButtons />}
        </Box>
      </Box>
      {isExpanding && (
        <NextLink href={`/post/${each._id.toString()}/detail`}>
          <Box>
            <Box
              dangerouslySetInnerHTML={{ __html: each.content }}
              sx={{
                padding: '1em 20% 1em 1em',
              }}
            />
          </Box>
        </NextLink>
      )}
    </Box>
  );
};
export default AuthSettings_Tab_0;
