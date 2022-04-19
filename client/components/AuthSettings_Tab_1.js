import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useQuery } from '@apollo/client';
import { Query_getPostByID } from '../graphql-client/queries/getPostByID';
import { dateFormat } from '../src/utils/dateFormat';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
  return (
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
          </Box>
          &nbsp;
          {'- '}
          Posted by&nbsp;<b> {dataPost?.getPostByID?.data?.user.userName}</b>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <b> {data.user.userName.toString()} </b>
          {' - '}
          {`${data.points.toString()} ${data.points > 1 ? 'points' : 'point'} - `}
          {dateFormat(data.createdAt)}
        </Box>
        <Box dangerouslySetInnerHTML={{ __html: data.content }} />
        <Box
          sx={{
            display: 'flex',
            gap: '.5em',
            cursor: 'pointer',
          }}
        >
          <b>Reply</b>
          <b>Share</b>
          <MoreHorizIcon />
        </Box>
      </Box>
    </Box>
  );
};

export default AuthSettings_Tab_1;
