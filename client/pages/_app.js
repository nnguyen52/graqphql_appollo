import '../styles/globals.css';
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

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  // const apolloClient = useApollo(pageProps);
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
              margin: 'auto',
              width: '80%',
              height: '100vh',
            }}
          >
            <Navbar />
            <Component {...pageProps} />
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}

export default MyApp;
