import React from 'react';
import { Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SearchResults = ({
  postsResult,
  usersResult,
  searchPostsPagination,
  setSearchPostsPagination,
  searchUsersPagination,
  setSearchUsersPagination,
  searchPosts,
  loadingSearchPosts,
  searchUsers,
  loadingSearchUsers,
  closeSearchResult,
}) => {
  return (
    <Card
      className='searchResults'
      sx={{
        display: 'flex',
        flexWrap: 'no-wrap',
        flexDirection: 'column',
        transform: 'translate(-20%, 0)',
        zIndex: 9999,
        position: 'absolute',
        left: 0,
        width: '300px',
        height: '200px',
        overflow: 'auto',
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
        onClick={closeSearchResult}
      />
      <b style={{ padding: '.5em', width: '100%' }}>
        <u> Posts </u>
      </b>
      {postsResult.length > 0 ? (
        <>
          {postsResult.map((each, index) => {
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '.5em',
                    borderBottom: '1px solid grey',
                  }}
                  key={index}
                >
                  {each.title}
                </div>
              </>
            );
          })}
        </>
      ) : (
        'No posts'
      )}
      <b style={{ padding: '.5em', width: '100%' }}>
        <u> Users</u>
      </b>
      {usersResult.length > 0 && (
        <>
          {usersResult.map((each, index) => {
            return (
              <>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '.5em',
                    borderBottom: '1px solid grey',
                  }}
                  key={index}
                >
                  {each.userName}
                </div>
              </>
            );
          })}
        </>
      )}
    </Card>
  );
};

export default SearchResults;
