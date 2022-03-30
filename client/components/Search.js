import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import InputField from './InputField';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@apollo/client';
import { Mutation_SearchPosts } from '../graphql-client/mutations/searchPosts';
import { Mutation_SearchUsers } from '../graphql-client/mutations/searchUsers';
import { Box } from '@mui/material';
import SearchResults from './SearchResults';
const Search = () => {
  const initialValues = {
    input: '',
  };
  const [searchPosts, { loading: loadingSearchPosts }] = useMutation(Mutation_SearchPosts);
  const [searchUsers, { loading: loadingSearchUsers }] = useMutation(Mutation_SearchUsers);
  const [postsResult, setPostsResult] = useState([]);
  const [searchPostsPagination, setSearchPostsPagination] = useState({
    endCursor: null,
    hasNextPage: false,
  });
  const [usersResult, setUsersResult] = useState([]);
  const [searchUsersPagination, setSearchUsersPagination] = useState({
    endCursor: null,
    hasNextPage: false,
  });
  const closeSearchResult = () => {
    setPostsResult([]);
    setUsersResult([]);
    setSearchPostsPagination({
      endCursor: null,
      hasNextPage: false,
    });
    setSearchUsersPagination({
      endCursor: null,
      hasNextPage: false,
    });
  };

  const handleSearch = async (values) => {
    await searchPosts({
      variables: {
        input: values.input,
      },
      update(cache, { data }) {
        console.log(data);

        if (data?.searchPosts?.data?.posts) {
          setPostsResult(data.searchPosts.data.posts);
          setSearchPostsPagination(data.searchPosts.data.pageInfo);
        }
      },
    });
    await searchUsers({
      variables: {
        input: values.input,
      },
      update(cache, { data }) {
        console.log(data);
        if (data?.searchUsers?.data?.users) {
          setUsersResult(data.searchUsers.data.users);
          setSearchUsersPagination(data.searchUsers.data.pageInfo);
        }
      },
    });
  };
  return (
    <Box style={{ position: 'relative' }}>
      <Formik initialValues={initialValues} onSubmit={handleSearch}>
        {({ isSubmitting }) => (
          <Form>
            <InputField type='text' label='Search...' name='input' />
            <LoadingButton
              loading={loadingSearchUsers && loadingSearchPosts && isSubmitting}
              style={{ display: 'none' }}
              type='submit'
            >
              Search
            </LoadingButton>
          </Form>
        )}
      </Formik>
      {(postsResult.length > 0 || usersResult.length > 0) && (
        <SearchResults
          postsResult={postsResult}
          usersResult={usersResult}
          searchPostsPagination={searchPostsPagination}
          setSearchPostsPagination={setSearchPostsPagination}
          searchUsersPagination={searchUsersPagination}
          setSearchUsersPagination={setSearchUsersPagination}
          searchPosts={searchPosts}
          loadingSearchPosts={loadingSearchPosts}
          searchUsers={searchUsers}
          loadingSearchUsers={loadingSearchUsers}
          closeSearchResult={closeSearchResult}
        />
      )}
    </Box>
  );
};

export default Search;
