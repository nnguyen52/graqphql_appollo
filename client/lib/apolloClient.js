import { useMemo } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { createUploadLink } from 'apollo-upload-client';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createUploadLink({
      uri: 'http://localhost:4000/graphql', // Server URL (must be absolute)
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getPosts: {
              keyArgs: false,
              merge(existingData = undefined, incomingData) {
                // case1: post is modified
                for (let i = 0; i < existingData?.data?.posts.length; i++) {
                  if (
                    JSON.stringify(existingData?.data?.posts[i]) ===
                    JSON.stringify(incomingData?.data?.posts[0])
                  ) {
                    return { ...incomingData };
                  }
                }
                // case2: new post added
                if (incomingData.data.posts.length == 1) {
                  return {
                    ...incomingData,
                    data: {
                      ...incomingData.data,
                      posts: existingData
                        ? [...existingData.data.posts, ...incomingData.data.posts]
                        : [...incomingData.data.posts],
                    },
                  };
                }
                // case: delete last item
                if (incomingData.data.posts.length == 0) {
                  return {
                    ...incomingData,
                  };
                }
                // case 3: get posts at beginning
                return {
                  ...incomingData,
                  data: {
                    ...incomingData.data,
                    posts: existingData
                      ? [...existingData.data.posts, ...incomingData.data.posts]
                      : [...incomingData.data.posts],
                  },
                };
              },
            },
            getSavePosts: {
              keyArgs: false,
              merge(existingData = undefined, incomingData) {
                for (let i = 0; i < existingData?.data?.posts.length; i++) {
                  if (
                    JSON.stringify(existingData?.data?.posts[i]) ===
                    JSON.stringify(incomingData?.data?.posts[0])
                  ) {
                    return { ...incomingData };
                  }
                }
                if (incomingData.data.posts.length == 1) {
                  return {
                    ...incomingData,
                    data: {
                      ...incomingData.data,
                      posts: existingData
                        ? [...existingData.data.posts, ...incomingData.data.posts]
                        : [...incomingData.data.posts],
                    },
                  };
                }
                // case: delete last item
                if (incomingData.data.posts.length == 0) {
                  return {
                    ...incomingData,
                  };
                }
                // case 3: get saveposts at beginning
                return {
                  ...incomingData,
                  data: {
                    ...incomingData.data,
                    posts: existingData
                      ? [...existingData.data.posts, ...incomingData.data.posts]
                      : [...incomingData.data.posts],
                  },
                };
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
