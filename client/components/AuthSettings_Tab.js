import React from 'react';
import { styled } from '@mui/material/styles';
import AuthSettings_Tab_0 from './AuthSettings_Tab_0';
import AuthSettings_Tab_1 from './AuthSettings_Tab_1';

const ResponsiveAuthSettings_Tab = styled('div')(({ theme }) => ({
  // mobile
  [theme.breakpoints.down('md')]: {
    '.tab_1 .tab_1_detail': {
      border: '1px solid lightgrey',
      margin: '.2em 0 .2em 0',
    },
    '.tab_1 .tab_1_detail >*:first-child': {
      alignItems: 'center',
      '&:hover': {
        border: '1px solid grey',
      },
      padding: '.5em',
    },
    '.tab_1 .tab_1_detail >*:first-child >*': {
      margin: '0 .2em 0 .2em',
    },
    '.tab_1 .tab_1_detail >*:nth-child(2)': {
      padding: '0 .5em .5em 2.5em',
      '&:hover': {
        border: '1px solid grey',
      },
    },
  },
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
    '.tab_1 .tab_1_detail': {
      border: '1px solid lightgrey',
      margin: '.2em 0 .2em 0',
    },
    '.tab_1 .tab_1_detail >*:first-child': {
      alignItems: 'center',
      '&:hover': {
        border: '1px solid grey',
      },
      padding: '.5em',
    },
    '.tab_1 .tab_1_detail >*:first-child >*': {
      margin: '0 .2em 0 .2em',
    },
    '.tab_1 .tab_1_detail >*:nth-child(2)': {
      padding: '0 .5em .5em 2.5em',
      '&:hover': {
        border: '1px solid grey',
      },
    },
  },
}));

// tab0 :posts
// tab1 :comments
// tab2 :saveds
// tab3 :hidden
// tab4 :upvoteds
// tab5 :downvoteds

const AuthSettings_Tab = ({ dataRaw, loading, value }) => {
  return (
    <ResponsiveAuthSettings_Tab>
      {(!dataRaw || loading) && <> Loading... </>}
      {value == 0 && !loading && (dataRaw?.data || dataRaw.network) && (
        <AuthSettings_Tab_0 data={dataRaw.data.posts} pageInfo={dataRaw.data.pageInfo} value={0} />
      )}
      {value == 1 && !loading && (dataRaw?.data || dataRaw.network) && (
        <AuthSettings_Tab_1
          data={dataRaw.data.comments}
          pageInfo={dataRaw.data.pageInfo}
          value={1}
        />
      )}
      {value == 2 && !loading && (dataRaw?.data || dataRaw?.network) && (
        <AuthSettings_Tab_0 data={dataRaw.data.posts} pageInfo={dataRaw.data.pageInfo} value={2} />
      )}
      {value == 3 && !loading && (dataRaw?.data || dataRaw?.network) && (
        <AuthSettings_Tab_0 data={dataRaw.data.posts} pageInfo={dataRaw.data.pageInfo} value={3} />
      )}
      {(value == 4 || value == 5) && !loading && dataRaw.data && (
        <AuthSettings_Tab_0
          data={dataRaw.data.posts}
          pageInfo={dataRaw.data.pageInfo}
          value={value}
        />
      )}
    </ResponsiveAuthSettings_Tab>
  );
};
export default AuthSettings_Tab;
