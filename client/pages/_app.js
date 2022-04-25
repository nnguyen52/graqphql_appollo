import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import Navbar from '../components/Navbar';
import { ApolloProvider } from '@apollo/client';
import { initializeApollo } from '../lib/apolloClient';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

const MainBodyResponsive = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    '.mainBody': {
      position: 'fixed',
      top: '8%',
      left: 0,
      width: '100%',
      height: '85vh',
      overflow: 'auto',
      padding: 0,
      margin: 0,
    },
    '.loginPage': {
      height: '100vh',
    },
  },
  [theme.breakpoints.up('md')]: {},
  [theme.breakpoints.up('lg')]: {
    // default is for desktop
  },
}));
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  const router = useRouter();
  const apolloClient = initializeApollo(pageProps);
  return (
    <ApolloProvider client={apolloClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              height: '100vh',
            }}
          >
            <Navbar />
            <MainBodyResponsive>
              <Box
                className={`mainBody ${
                  router.pathname == '/login' || router.pathname == '/register' ? 'loginPage' : null
                }`}
              >
                <Component {...pageProps} />
              </Box>
            </MainBodyResponsive>
          </Box>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

export default MyApp;
