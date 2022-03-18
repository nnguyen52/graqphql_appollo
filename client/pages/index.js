import CreatePost from '../components/CreatePost';
import ShowPosts from '../components/ShowPosts';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { initializeApollo, addApolloState } from '../lib/apolloClient';
export default function Home() {
  return (
    <>
      <CreatePost />
      <hr />
      <ShowPosts />
    </>
  );
}
export async function getStaticProps() {
  const apolloClient = initializeApollo();
  try {
    await apolloClient.query({
      query: Query_getPosts,
      variables: { limit: 2 },
    });
  } catch (e) {
    console.log('ERROR_getStaticProps pages/index', e);
  }

  return addApolloState(apolloClient, {
    props: {},
    // revalidate: 1,
  });
}
