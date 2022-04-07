import React, { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import InputField from './InputField';
import { Formik, Form, useFormik } from 'formik';
import { Alert, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_createPost } from '../graphql-client/mutations/createPost';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { styled } from '@mui/material/styles';
import char1 from '../assets/redditChars1.jpg';
import { checkImageUpload, imageUpload } from '../src/utils/uploadImage';
import { Mutation_deleteImages } from '../graphql-client/mutations/deleteImages';

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
  }
);
const CreatePostResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    // '.createPost': {
    //   marginTop: '1em',
    //   marginBottom: '1em',
    //   display: 'flex',
    //   flexDirection: 'column',
    //   background: '#dff7c8',
    // },
    // '.createPost > *': {
    //   width: '100%',
    //   padding: '.5em',
    // },
    // '.createPost span': {
    //   padding: 0,
    //   margin: 0,
    //   paddingLeft: '1em',
    // },
  },
  [theme.breakpoints.up('md')]: {
    // '.createPost': {
    //   background: '#dff7c8',
    //   padding: '.5em',
    // },
    '.createPostQuillContainer': {
      width: '60%',
      margin: '0 auto',
    },
  },
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));

const CreatePost = () => {
  const [createPost, { loading: loadingCreatePost }] = useMutation(Mutation_createPost);
  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(Query_me);
  // CreatePost info
  const formik = useFormik({
    initialValues: {
      title: '',
    },
  });

  const [content, setContent] = useState(null);
  const [imgPublicIDs, setImgPublicIDs] = useState([]);
  const [imgMsg, setImgMsg] = useState(null);
  const [deleteImages, { loading: loadingDeleteImages }] = useMutation(Mutation_deleteImages);

  // Quill
  let quillRef = useRef(null);

  const customImageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      var files = input.files;
      if (!files) return setImgMsg('File corrupted.');
      const file = files[0];
      const checkImgUpload = checkImageUpload(file);
      if (checkImgUpload) return setImgMsg(checkImgUpload);
      const photo = await imageUpload([file]);
      setImgPublicIDs((prev) => prev.concat(photo[0].public_id));
      const quill = quillRef.current;
      const range = quill?.getEditor().getSelection()?.index;
      if (range !== undefined) {
        quill?.getEditor().insertText(range, '\n');
        quill?.getEditor().insertEmbed(range, 'image', `${photo[0].url}`);
        quill?.getEditor().insertText(range, '\n');
      }
      setImgMsg('done uploading');
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          image: customImageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const quillHandleChange = (e) => {
    setContent(e);
  };
  // form submit
  const [submitMsg, setSubmitMsg] = useState({
    code: null,
    message: null,
  });
  const handleSubmitTest = async (values, { setErrors }) => {
    // loop thru public_ids
    // check if content.include(each publicid)
    // if not -> destroy that public id
    if (!values.title)
      return setErrors(
        mapFieldErrors([
          {
            field: 'title',
            message: 'Dont get lazy, please give me a title!',
          },
        ])
      );
    if (loadingCreatePost || loadingDeleteImages) return;
    const publicIDs_toDelete = imgPublicIDs.filter((each) => !content.includes(each.toString()));
    let publicIDs = imgPublicIDs.filter((each) => content.includes(each.toString()));
    await deleteImages({
      variables: { publicIDs: publicIDs_toDelete },
      // update(cache, { data }) {
      // },
    });
    // all good
    await createPost({
      variables: {
        title: values.title.toString(),
        content: content.toString(),
        publicIDs,
      },
      update(cache, { data }) {
        console.log(data);
        if (!data.createPost.network.success) {
          refetchMe();
          setSubmitMsg({
            code: data.createPost.network.code,
            message: data.createPost.network.errors[0].message,
          });
          setTimeout(() => setSubmitMsg(null), 3000);
          return;
        }
        if (data.createPost.network.success) {
          setSubmitMsg({
            code: data.createPost.network.code,
            message: data.createPost.network.message,
          });
          refetchMe();
          formik.resetForm({
            initialValues: {
              title: '',
            },
          });
          setContent(null);
          setImgPublicIDs([]);
          setImgMsg(null);
          const { getPosts } = cache.readQuery({ query: Query_getPosts });
          // incoming data -> will get checked by typePolicies for merging
          const cacheAfterCreatePost = {
            ...getPosts,
            data: {
              ...getPosts.data,
              posts: [{ ...data.createPost.data }],
            },
          };
          cache.writeQuery({
            query: Query_getPosts,
            data: { getPosts: cacheAfterCreatePost },
          });
          return;
        }
      },
    });
  };

  return (
    <CreatePostResponsive>
      <Box className='createPostQuillContainer'>
        <Formik initialValues={formik.initialValues} onSubmit={handleSubmitTest}>
          {({ isSubmitting }) => (
            <Form>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <InputField name='title' type='text' label='Title' placeholder='Title (required)' />
                <ReactQuill
                  onChange={quillHandleChange}
                  value={content}
                  modules={modules}
                  formats={formats}
                  forwardedRef={quillRef}
                  placeholder='Text (optional)'
                />
                <LoadingButton
                  type='submit'
                  loading={loadingCreatePost && loadingDeleteImages && isSubmitting}
                  sx={{
                    alignSelf: 'end',
                  }}
                >
                  Create Post
                </LoadingButton>
                {submitMsg.message && (
                  <Alert severity={submitMsg.code == 200 ? 'success' : 'error'}>
                    {submitMsg.message}
                  </Alert>
                )}
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      {/* <button onClick={() => console.log(content)}>content </button> <br />
      <button onClick={() => console.log(imgPublicIDs)}>public_id </button>
      <Button onClick={() => handleSubmitTest()}>Test submit</Button> */}
      {imgMsg && <h3>{imgMsg}</h3>}
    </CreatePostResponsive>
  );
};

export default CreatePost;
