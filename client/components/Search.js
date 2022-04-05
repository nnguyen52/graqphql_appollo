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
  const [initialValues, setInitialValues] = useState({
    input: '',
  });
  const [searchPosts, { loading: loadingSearchPosts }] = useMutation(Mutation_SearchPosts);
  const [searchUsers, { loading: loadingSearchUsers }] = useMutation(Mutation_SearchUsers);
  const [postsResult, setPostsResult] = useState([]);
  const [msgPostsResult, setMsgPostsResult] = useState(null);
  const [msgUsersResult, setMsgUsersResult] = useState(null);

  const [searchPostsPagination, setSearchPostsPagination] = useState({
    endCursor: null,
    hasNextPage: false,
  });
  const [usersResult, setUsersResult] = useState([]);
  const [searchUsersPagination, setSearchUsersPagination] = useState({
    endCursor: null,
    hasNextPage: false,
  });
  const [openSearchResult, setOpenSearchResult] = useState(false);
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
    setInitialValues({
      input: '',
    });
    setOpenSearchResult(false);
  };

  const handleSearch = async (values) => {
    setInitialValues({ input: values.input });
    await searchPosts({
      variables: {
        input: values.input,
        limit: 5,
      },
      update(cache, { data }) {
        if (data?.searchPosts?.data?.posts) {
          setMsgPostsResult(data?.searchPosts?.network?.message);
          setPostsResult(data?.searchPosts?.data?.posts);
          setSearchPostsPagination(data?.searchPosts?.data?.pageInfo);
          if (!openSearchResult) setOpenSearchResult(true);
        }
      },
    });
    await searchUsers({
      variables: {
        input: values.input,
        limit: 5,
      },
      update(cache, { data }) {
        if (data?.searchUsers?.data?.users) {
          setMsgUsersResult(data?.searchUsers?.network?.message);
          setUsersResult(data?.searchUsers?.data?.users);
          setSearchUsersPagination(data?.searchUsers?.data?.pageInfo);
          if (!openSearchResult) setOpenSearchResult(true);
        }
      },
    });
  };

  return (
    <Box style={{ position: 'relative' }}>
      <Formik initialValues={initialValues} onSubmit={handleSearch}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              style={{ background: 'white' }}
              type='text'
              label='Search...'
              name='input'
            />
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
      <SearchResults
        postsResult={postsResult}
        usersResult={usersResult}
        searchPostsPagination={searchPostsPagination}
        setSearchPostsPagination={setSearchPostsPagination}
        searchUsersPagination={searchUsersPagination}
        setSearchUsersPagination={setSearchUsersPagination}
        searchPosts={searchPosts}
        searchUsers={searchUsers}
        closeSearchResult={closeSearchResult}
        openSearchResult={openSearchResult}
        setOpenSearchResult={setOpenSearchResult}
        input={initialValues.input}
        setUsersResult={setUsersResult}
        setPostsResult={setPostsResult}
        msgPostsResult={msgPostsResult}
        setMsgPostsResult={setMsgPostsResult}
        msgUsersResult={msgUsersResult}
        setMsgUsersResult={setMsgUsersResult}
      />
    </Box>
  );
};

export default Search;
