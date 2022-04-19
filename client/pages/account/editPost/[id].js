import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { Query_me } from '../../../graphql-client/queries/user';
import { Query_getPostByID } from '../../../graphql-client/queries/getPostByID';
import { Mutation_editPost } from '../../../graphql-client/mutations/editPost';
import { mapFieldErrors } from '../../../../server/src/utils/mapFieldErrors';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { Formik, Form,  } from 'formik';
import InputField from '../../../components/InputField';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, LinearProgress, Tooltip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { ReactQuill } from '../../../components/CreatePost';
import { checkImageUpload, imageUpload } from '../../../src/utils/uploadImage';
import { Mutation_deleteImages } from '../../../graphql-client/mutations/deleteImages';

const CreatePostResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.editPostQuillContainer': {
      marginTop: '3em',
    },
  },
  [theme.breakpoints.up('md')]: {
    '.editPostQuillContainer': {
      width: '60%',
      margin: '0 auto',
    },
  },
}));
const EditPost = () => {
  const router = useRouter();
  const { data: meData, loading: meLoading, refetch: refetchMe } = useQuery(Query_me);

  const { data: dataPost, loading } = useQuery(Query_getPostByID, {
    variables: {
      id: router.query.id,
    },
  });

  // quill
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
  // edit post data
  const [updatePost, { loading: loadingEditPost }] = useMutation(Mutation_editPost);
  // let formik = useFormik({
  //   initialValues: {
  //     title: dataPost?.getPostByID?.data?.title,
  //   },
  // });
  const [initialValues, setInitialValues] = useState({
    title: dataPost?.getPostByID?.data?.title,
  });
  const [content, setContent] = useState(dataPost?.getPostByID?.data?.content);
  const [imgPublicIDs, setImgPublicIDs] = useState(dataPost?.getPostByID?.data?.images);
  const [imgMsg, setImgMsg] = useState(null);
  const [deleteImages, { loading: loadingDeleteImages }] = useMutation(Mutation_deleteImages);
  const [imgCoverFile, setImgCoverFile] = useState(null);
  const [imgCover, setImgCover] = useState(dataPost?.getPostByID?.data?.imageCover);

  useEffect(() => {
    if (!dataPost?.getPostByID?.data?.imageCover) return;
    setInitialValues({
      title: dataPost?.getPostByID?.data?.title,
    });
    setImgCover(dataPost?.getPostByID?.data?.imageCover);
    setContent(dataPost?.getPostByID?.data?.content);
    setImgPublicIDs(dataPost?.getPostByID?.data?.images);
  }, [dataPost?.getPostByID?.data]);

  const imgCoverFileRef = useRef(null);
  const titleRef = useRef(null);

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
  //form
  const [submitMsg, setSubmitMsg] = useState({
    code: null,
    message: null,
  });
  const quillHandleChange = (e) => {
    setContent(e);
  };

  const handleChangeImgCover = async (e) => {
    if (loadingEditPost || loadingDeleteImages) return;
    const file = e.target.files[0];
    const err = checkImageUpload(file);
    if (err) {
      imgCoverFileRef.current.value = '';
      return setImgMsg(err);
    }
    setImgCoverFile(file);
    return;
  };

  const handleSubmit = async (values, { setErrors }) => {
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
    if (loadingEditPost || loadingDeleteImages) return;
    let publicIDs_toDelete;
    let publicIDs;
    if (imgPublicIDs.length > 0) {
      publicIDs_toDelete = imgPublicIDs.filter((each) => !content.includes(each.toString()));
      publicIDs = imgPublicIDs.filter((each) => content.includes(each.toString()));
      await deleteImages({
        variables: { publicIDs: publicIDs_toDelete },
      });
    }
    await updatePost({
      variables: {
        id: dataPost?.getPostByID?.data._id.toString(),
        title: values.title.toString(),
        content: content ? content.toString() : null,
        publicIDs: publicIDs ? publicIDs : [],
        imgCoverFile: imgCoverFile ? imgCoverFile : null,
      },
      update(cache, { data }) {
        if (!data.updatePost.network.success) {
          refetchMe();
          setSubmitMsg({
            code: data.updatePost.network.code,
            message: data.updatePost.network.errors[0].message,
          });
          setTimeout(() => setSubmitMsg(null), 3000);
          return;
        }
        if (data.updatePost.network.success) {
          setSubmitMsg({
            code: data.updatePost.network.code,
            message: data.updatePost.network.message,
          });

          refetchMe();
          setInitialValues({
            initialValues: {
              title: '',
            },
          });
          imgCoverFileRef?.current?.value = '';
          titleRef?.current?.value = '';
          setContent(null);
          setImgPublicIDs([]);
          setImgCoverFile(null);
          setImgCover(null);
          setImgMsg(null);
          return true;
        }
      },
    });
  };
  if (loading) return <LinearProgress />;
  return (
    <CreatePostResponsive>
      <Box className='editPostQuillContainer'>
        <h3 style={{ padding: '.5em' }}> Edit post </h3>
        <Formik enctype='multipart/form-data' initialValues={initialValues} onSubmit={handleSubmit}>
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
                  defaultValue={dataPost?.getPostByID?.data.title}
                />
                {!imgCover && !imgCoverFile && (
                  <>
                    Add new post cover
                    <input
                      ref={imgCoverFileRef}
                      sx={{ width: '100%', marginTop: '.2em' }}
                      type='file'
                      name='file'
                      accept='image/*'
                      onChange={handleChangeImgCover}
                    />
                  </>
                )}
                {(imgCover || imgCoverFile) && (
                  <Box
                    sx={{
                      padding: '1em',
                    }}
                  >
                    <h4> Your current image Cover</h4>
                    <input
                      ref={imgCoverFileRef}
                      sx={{ width: '100%', marginTop: '.2em' }}
                      type='file'
                      name='file'
                      accept='image/*'
                      onChange={handleChangeImgCover}
                    />
                    <>
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: '300px',
                        }}
                      >
                        <Image
                          src={
                            imgCoverFile
                              ? URL.createObjectURL(imgCoverFile)
                              : `https://res.cloudinary.com/cloudinarystore/image/upload/v1649384498/${imgCover}.jpg`
                          }
                          width={'300px'}
                          height={'300px'}
                          objectFit='contain'
                        />
                        <Tooltip title='remove Cover '>
                          <CancelIcon
                            onClick={() => {
                              setImgCoverFile(null);
                              setImgCover(null);
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
                  </Box>
                )}
                <ReactQuill
                  onChange={quillHandleChange}
                  value={content || ''}
                  modules={modules}
                  formats={formats}
                  forwardedRef={quillRef}
                  placeholder='Text (optional)'
                />
                {imgMsg && <Alert severity='error'>{imgMsg}</Alert>}
                {!loadingEditPost && !isSubmitting && !loadingDeleteImages &&  <LoadingButton
                  type='submit'
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
                  Edit Post
                </LoadingButton>}
                {submitMsg.message && (
                  <Alert severity={submitMsg.code == 200 ? 'success' : 'error'}>
                    {submitMsg.message}
                  </Alert>
                )}
                   
              </Box>
            </Form>
          )}
        </Formik>
        {(loadingEditPost || loadingDeleteImages )&& <LinearProgress />}
      </Box>
    </CreatePostResponsive>
  );
};

export default EditPost;
