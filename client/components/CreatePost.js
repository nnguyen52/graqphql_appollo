import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import InputField from './InputField';
import { Formik, Form, useFormik } from 'formik';
import { Alert, Box, Tooltip, Input, LinearProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation, useQuery } from '@apollo/client';
import { Mutation_createPost } from '../graphql-client/mutations/createPost';
import { Query_getPosts } from '../graphql-client/queries/posts';
import { Query_me } from '../graphql-client/queries/user';
import Image from 'next/image';
import { mapFieldErrors } from '../../server/src/utils/mapFieldErrors';
import { styled } from '@mui/material/styles';
import { checkImageUpload, imageUpload } from '../src/utils/uploadImage';
import { Mutation_deleteImages } from '../graphql-client/mutations/deleteImages';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';

export const ReactQuill = dynamic(
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
    '.createPostQuillContainer': {
      marginTop: '3em',
    },
  },
  [theme.breakpoints.up('md')]: {
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
  const router = useRouter();

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
  const [deleteImages, { loading: loadingDeleteImages }] = useMutation(Mutation_deleteImages);
  const [imgCoverFile, setImgCoverFile] = useState(null);
  const imgCoverFileRef = useRef(null);
  const titleRef = useRef(null);

  const handleChangeImgCover = async (e) => {
    if (loadingCreatePost || loadingDeleteImages) return;
    const file = e.target.files[0];
    const err = checkImageUpload(file);
    if (err) {
      imgCoverFileRef.current.value = '';
      return toast.error(err);
    }
    setImgCoverFile(file);
    return;
  };

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
  const handleSubmit = async (values, { setErrors }) => {
    // loop thru public_ids
    // check if content.include(each publicid)
    // if not -> destroy that public id
    if (!values.title) {
      return setErrors(
        mapFieldErrors([
          {
            field: 'title',
            message: 'Your post must have a title!',
          },
        ])
      );
    }
    if (loadingCreatePost || loadingDeleteImages) return;
    let publicIDs_toDelete;
    let publicIDs;
    if (imgPublicIDs.length > 0) {
      publicIDs_toDelete = imgPublicIDs.filter((each) => !content.includes(each.toString()));
      publicIDs = imgPublicIDs.filter((each) => content.includes(each.toString()));
      await deleteImages({
        variables: { publicIDs: publicIDs_toDelete },
        // update(cache, { data }) {
        // },
      });
    }
    // all good
    await createPost({
      variables: {
        title: values.title.toString(),
        content: content ? content.toString() : null,
        publicIDs: publicIDs ? publicIDs : [],
        imgCoverFile: imgCoverFile ? imgCoverFile : null,
      },
      update(cache, { data }) {
        if (!data.createPost.network.success) {
          refetchMe();
          toast.error(data.createPost.network.errors[0].message);
          return;
        }
        if (data.createPost.network.success) {
          refetchMe();
          // formik.resetForm({
          //   initialValues: {
          //     title: '',
          //   },
          // });
          // imgCoverFileRef.current.value = '';
          // titleRef.current.value = '';
          setContent(null);
          setImgPublicIDs([]);
          setImgCoverFile(null);
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
          toast.success(data.createPost.network.message);
          return router.push('/');
        }
      },
    });
  };

  return (
    <CreatePostResponsive>
      <Box className='createPostQuillContainer'>
        <h3 style={{ padding: '.5em' }}> Create post </h3>
        <Formik
          enctype='multipart/form-data'
          initialValues={formik.initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form enctype='multipart/form-data'>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <InputField
                  ref={titleRef}
                  name='title'
                  type='text'
                  label='Title'
                  placeholder='Title (required)'
                />
                <Box
                  sx={{
                    padding: '1em',
                  }}
                >
                  Cover image (optional)
                  <input
                    ref={imgCoverFileRef}
                    sx={{ width: '100%', marginTop: '.2em' }}
                    type='file'
                    name='file'
                    accept='image/*'
                    onChange={handleChangeImgCover}
                  />
                  {imgCoverFile && (
                    <>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '300px',
                        }}
                      >
                        <Image
                          src={URL.createObjectURL(imgCoverFile)}
                          width={'300px'}
                          height={'300px'}
                          objectFit='contain'
                        />
                        <Tooltip title='remove'>
                          <CancelIcon
                            onClick={() => {
                              setImgCoverFile(null);
                              imgCoverFileRef.current.value = '';
                            }}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              fontSize: '2em',
                              cursor: 'pointer',
                              borderRadius: '50%',
                              color: 'white',
                              background: '#bc074c',
                              '&:hover': {
                                color: 'white',
                                background: 'crimson',
                              },
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </>
                  )}
                </Box>
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
                    marginTop: '.5em',
                    alignSelf: 'end',
                    color: 'white',
                    background: 'green',
                    '&:hover': {
                      color: 'white',
                      background: '#24d645',
                    },
                  }}
                >
                  Create Post
                </LoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
        {loadingCreatePost && loadingDeleteImages && <LinearProgress />}
      </Box>
    </CreatePostResponsive>
  );
};

export default CreatePost;
