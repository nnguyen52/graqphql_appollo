import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useQuery } from '@apollo/client';
import { Query_getPostByID } from '../graphql-client/queries/getPostByID';
import { dateFormat } from '../src/utils/dateFormat';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareButtons from './ShareButtons';
import NextLink from 'next/link';

const AuthSettings_Tab_1 = ({ data, pageInfo, value }) => {
  return (
    <Box className='tab_1'>
      {data.map((each, index) => {
        return <AuthSettings_Tab_1_Detail key={each} data={each} index={index} />;
      })}
    </Box>
  );
};

const AuthSettings_Tab_1_Detail = ({ data }) => {
  const { data: dataPost, loading: loadingGetPostByID } = useQuery(Query_getPostByID, {
    variables: { id: data.postId.toString() },
  });
  const [isSharing, setIsSharing] = useState(false);

  return (
    <>
      <Box className='tab_1_detail' sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <ChatBubbleOutlineIcon />
          </Box>
          <Box sx={{ padding: '.5em 0 .5em 0', display: 'flex' }}>
            <Box>
              <b> {data.user.userName.toString()}</b> commented on
              {loadingGetPostByID && <>...</>}
              {!loadingGetPostByID && data && <> {dataPost?.getPostByID?.data?.title}</>}
              &nbsp;
              {'- '}
              Posted by&nbsp;<b> {dataPost?.getPostByID?.data?.user.userName}</b>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <NextLink href={`/post/${data.postId.toString()}/detail`}>
            <Box>
              <Box>
                <b> {data.user.userName.toString()} </b>
                {' - '}
                {`${data.points.toString()} ${data.points > 1 ? 'points' : 'point'} - `}
                {dateFormat(data.createdAt)}
              </Box>
              <Box dangerouslySetInnerHTML={{ __html: data.content }} />
            </Box>
          </NextLink>
          <Box
            sx={{
              display: 'flex',
              gap: '.5em',
              cursor: 'pointer',
            }}
          >
            <NextLink href={`/post/${data.postId.toString()}/detail`}>
              <Box>
                <b>Reply</b>
              </Box>
            </NextLink>
            <Box onClick={() => setIsSharing((prev) => !prev)}>
              <b>Share</b>
            </Box>
            <MoreHorizIcon />
          </Box>
          {isSharing && <ShareButtons />}
        </Box>
      </Box>
    </>
  );
};

export default AuthSettings_Tab_1;
