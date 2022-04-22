import React, { useState } from 'react';
import {
  // buttons
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappShareButton,
  WeiboShareButton,
  //   icons
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  WeiboIcon,
  WhatsappIcon,
} from 'react-share';
import { Box } from '@mui/material';
const ShareButtons = ({ url }) => {
  const title = 'Reddis by Jerngn';
  const hashtag = '#Reddis';
  const hashtags = ['#Reddis', '#ReddisByJerngn'];
  //   mail body will be displaying picture of this app (maybe login screen?)
  const mailBody = ``;
  return (
    <Box
      sx={{
        display: 'flex ',
        flexWrap: 'wrap',
        width: '100%',
        gap: '.5em',
        padding: '1em',
      }}
    >
      {/* Email  */}
      <EmailShareButton url={url} subject={title} body={mailBody}>
        <EmailIcon size={32} round />
      </EmailShareButton>
      {/* facebook  */}
      <FacebookShareButton url={url} quote={title} hashtag={hashtag}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      {/* linkedin  */}
      <LinkedinShareButton url={url} title={title} summmary={''} source='Reddis'>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      {/* reddit  */}
      <RedditShareButton url={url} title={title} hashtag={hashtag}>
        <RedditIcon size={32} round />
      </RedditShareButton>
      {/* telegram */}
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
      {/* tumblr */}
      <TumblrShareButton url={url} title={title} hashtags={hashtags}>
        <TumblrIcon size={32} round />
      </TumblrShareButton>
      {/* Twitter */}
      <TwitterShareButton url={url} title={title} hashtags={hashtags}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      {/* viber  */}
      <ViberShareButton url={url} title={title}>
        <ViberIcon size={32} round />
      </ViberShareButton>
      {/* weibo */}
      <WeiboShareButton url={url} title={title}>
        <WeiboIcon size={32} round />
      </WeiboShareButton>
      {/* whatsapp */}
      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    </Box>
  );
};

export default ShareButtons;
