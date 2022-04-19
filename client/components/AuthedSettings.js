import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Query_getUserByID } from '../graphql-client/queries/getUserByID';
import { Query_me } from '../graphql-client/queries/user';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Query_getPostsFromUser } from '../graphql-client/queries/getPostsFromUser';
import AuthSettings_Tab from './AuthSettings_Tab';
import { Query_getCommentsFromUser } from '../graphql-client/queries/getCommentsFromUser';
import { Query_getPostsUserVoted } from '../graphql-client/queries/getPostsUserVoted';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';

const AuthedSettings = () => {
  const router = useRouter();
  const { data: dataMe, loading: loadingMe, refetch: refetchMe } = useQuery(Query_me);
  const { data: dataUserByID, loading: loadingUserByID } = useQuery(Query_getUserByID, {
    variables: {
      id: router?.query?.id?.toString(),
    },
  });
  // tab0
  const { data: dataPosts, loading: loadingPosts } = useQuery(Query_getPostsFromUser, {
    variables: { userId: router?.query?.id.toString() },
  });
  // tab1
  const { data: dataComments, loading: loadingDataComments } = useQuery(Query_getCommentsFromUser, {
    variables: { userId: router?.query?.id.toString() },
  });
  // tab2
  const { data: dataSaveposts, loading: loadingDataSaveposts } = useQuery(Query_getSaveposts, {
    variables: { cursor: '' },
  });
  // tab3
  const { data: dataPostsUserUpVoted, loading: loadingPostsUserUpVoted } = useQuery(
    Query_getPostsUserVoted,
    {
      variables: { userId: router?.query?.id.toString(), type: 'upvote' },
    }
  );
  // tab4
  const { data: dataPostsUserDownVoted, loading: loadingPostsUserDownVoted } = useQuery(
    Query_getPostsUserVoted,
    {
      variables: { userId: router?.query?.id.toString() },
    }
  );
  //tabs
  const [tabs, setTabs] = useState([
    { name: 'Posts', value: 0 },
    { name: 'Comments', value: 1 },
    { name: 'Saved', value: 2 },
    { name: 'Upvoted', value: 3 },
    { name: 'Downvoted', value: 4 },
  ]);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value == index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  if (loadingMe || loadingUserByID) return <></>;
  if (!loadingMe && !dataMe?.me?.data) {
    refetchMe();
    return <></>;
  }
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange}>
        {tabs.map((each, index) => {
          return <Tab label={each.name.toUpperCase()} {...a11yProps(index)} />;
        })}
      </Tabs>
      {tabs.map((each, index) => {
        return (
          <TabPanel index={index} value={value}>
            <AuthSettings_Tab
              dataRaw={
                value == 0
                  ? dataPosts?.getPostsFromUser
                  : value == 1
                  ? dataComments.getCommentsFromUser
                  : value == 2
                  ? dataSaveposts.getSavePosts
                  : value == 3
                  ? dataPostsUserUpVoted.getPostsUserVoted
                  : value == 4
                  ? dataPostsUserDownVoted.getPostsUserVoted
                  : null
              }
              loading={
                value == 0
                  ? loadingPosts
                  : value == 1
                  ? loadingDataComments
                  : value == 2
                  ? loadingDataSaveposts
                  : value == 3
                  ? loadingPostsUserUpVoted
                  : value == 4
                  ? loadingPostsUserDownVoted
                  : null
              }
              value={value}
            />
          </TabPanel>
        );
      })}
    </Box>
  );
};

export default AuthedSettings;
