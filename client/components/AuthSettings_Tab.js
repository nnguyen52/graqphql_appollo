import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
    <Box>
      {data.map((each) => {
        return (
          <>
            <h3> {each.title} </h3>
          </>
        );
      })}
    </Box>
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
