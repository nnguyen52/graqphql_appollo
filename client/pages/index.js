import { useQuery } from '@apollo/client';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { initializeApollo, addApolloState } from '../lib/apolloClient';
export default function Home() {
  const { loading, data, error } = useQuery(Query_getPosts, {
    // variables: allPostsQueryVars,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });
  // if (data) console.log(data);
  return <></>;
}
export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: Query_getPosts,
    // variables: allPostsQueryVars,
  });

  return addApolloState(apolloClient, {
    props: {},
    // revalidate: 1,
  });
}
