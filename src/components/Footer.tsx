import React from 'react';
import { rhythm } from '../utils/typography';

const Footer: React.FC = () => (
  <footer
    style={{
      marginTop: rhythm(2.5),
      paddingTop: rhythm(1),
    }}
  >
    <a
      href="https://docs.qq.com/pdf/DZEZ6b25DY1RNaFN2"
      target="_blank"
      rel="noopener noreferrer"
    >
      简历
    </a>{' '}
    &bull;{' '}
    <a
      href="https://github.com/cloudups"
      target="_blank"
      rel="noopener noreferrer"
    >
      github
    </a>{' '}
    &bull;{' '}
    <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
      rss
    </a>
  </footer>
);

export default Footer;
