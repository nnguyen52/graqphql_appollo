import { Query_getSaveposts } from '../../graphql-client/queries/getSavePosts';

export const handleSavePost = async ({
  loadingMe,
  dataMe,
  refetchMe,
  savePost,
  //setSavePostResult is optional: use toastify later
  // setSavePostResult,
  dataSaveposts,
  each,
}) => {
  //   setSavePostResult({ success: null, message: null });
  if (loadingMe) return;
  if ((!loadingMe && !dataMe) || !dataMe?.me?.network?.success) {
    refetchMe();
    return;
  }
  await savePost({
    variables: { id: each._id.toString() },
    update(cache, { data }) {
      if (!data?.savePost?.network?.success) {
        refetchMe();
        // setSavePostResult({
        //   success: data?.savePost?.network?.success,
        //   message: data.savePost?.network?.errors[0]?.message,
        // });
        // setTimeout(() => setSavePostResult({ success: null, message: null }), 5000);
        return;
      }
      const cacheAfterSavePost = {
        ...dataSaveposts.getSavePosts,
        data: {
          ...dataSaveposts.getSavePosts.data,
          posts: [{ ...data.savePost.data }],
        },
      };
      refetchMe();
      cache.writeQuery({
        query: Query_getSaveposts,
        data: { getSavePosts: cacheAfterSavePost },
      });
      // setSavePostResult({
      //   success: data?.savePost?.network?.success,
      //   message: data.savePost?.network?.message,
      // });
      // setTimeout(() => setSavePostResult({ success: null, message: null }), 5000);
    },
  });
};

export const handleUnsavePost = async ({
  loadingMe,
  dataMe,
  refetchMe,
  unsavePost,
  dataSaveposts,
  setUnsavePostResult,
  each,
}) => {
  // setUnsavePostResult({ success: null, message: null });
  if (loadingMe) return;
  if ((!loadingMe && !dataMe) || !dataMe?.me?.network?.success) {
    refetchMe();
    // setUnsavePostResult({
    //   success: data?.savePost?.network?.success,
    //   message: data.savePost?.network?.errors[0]?.message,
    // });
    // setTimeout(() => setUnsavePostResult({ success: null, message: null }), 5000);
    return;
  }
  await unsavePost({
    variables: { id: each._id.toString() },
    update(cache, { data }) {
      if (!data?.unsavePost?.network.success) {
        refetchMe();
        // setUnsavePostResult((prev) => ({
        //   success: data?.unsavePost?.network?.success,
        //   message: data.unsavePost?.network?.errors[0]?.message,
        // }));
        // setTimeout(() => setUnsavePostResult((prev) => ({ success: null, message: null })), 5000);
        return;
      }
      // remove from cache
      if (data.unsavePost?.network?.success) {
        cache.writeQuery({
          query: Query_getSaveposts,
          data: {
            getSavePosts: {
              ...dataSaveposts?.getSavePosts,
              data: {
                ...dataSaveposts?.getSavePosts?.data,
                posts: dataSaveposts?.getSavePosts?.data?.posts.filter(
                  (ea) => ea._id != each._id.toString()
                ),
              },
            },
          },
        });
        // setUnsavePostResult((prev) => ({
        //   success: data?.unsavePost?.network?.success,
        //   message: data.unsavePost?.network?.message,
        // }));
        // setTimeout(() => setUnsavePostResult((prev) => ({ success: null, message: null })), 5000);
      }
    },
  });
};
