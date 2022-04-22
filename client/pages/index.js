import CreatePost from '../components/CreatePost';
import ShowPosts from '../components/ShowPosts';
import { Query_getSaveposts } from '../graphql-client/queries/getSavePosts';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { initializeApollo, addApolloState } from '../lib/apolloClient';

export default function Home() {
  return (
    <>
      <ShowPosts />
    </>
  );
}
export async function getStaticProps(context) {
  const apolloClient = initializeApollo({ headers: context?.req?.headers });
  await apolloClient.query({
    query: Query_getPosts,
    variables: { limit: 10 },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
