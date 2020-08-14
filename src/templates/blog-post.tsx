import React from 'react';
import { Link, graphql } from 'gatsby';
import get from 'lodash/get';

import '../fonts/fonts-post.css';
import Bio from '../components/Bio';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Signup from '../components/Signup';
import Panel from '../components/Panel';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';
import {
  codeToLanguage,
  createLanguageLink,
  loadFontsForCode,
  replaceAnchorLinksByLanguage,
} from '../utils/i18n';
import { PageProps } from 'gatsby';

const GITHUB_USERNAME = 'gaearon';
const GITHUB_REPO_NAME = 'overreacted.io';
const systemFont = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif`;

type BlogPostQueryProps = {};
type LocaleLookUpInfo = { translationStrings: any } & {
  langKey: string;
  slug: string;
} & {
  slug: any;
  previous: any;
  next: any;
  translations: any;
  translatedLinks: any;
};
type BlogPostTemplateProps = PageProps<BlogPostQueryProps, LocaleLookUpInfo>;

const BlogPostTemplate: React.FC<BlogPostTemplateProps> = props => {
  const post = get(props, 'data.markdownRemark');
  const siteTitle = get(props, 'data.site.siteMetadata.title');
  let {
    previous,
    next,
    slug,
    translations,
    translatedLinks,
  } = props.pageContext;
  const lang = post.fields.langKey;

  // Replace original links with translated when available.
  let html = post.html;

  // Replace original anchor links by lang when available in whitelist
  // see utils/whitelist.js
  html = replaceAnchorLinksByLanguage(html, lang);

  translatedLinks.forEach(link => {
    // jeez
    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    let translatedLink = '/' + lang + link;
    html = html.replace(
      new RegExp('"' + escapeRegExp(link) + '"', 'g'),
      '"' + translatedLink + '"'
    );
  });

  translations = translations.slice();
  translations.sort((a, b) => {
    return codeToLanguage(a) < codeToLanguage(b) ? -1 : 1;
  });

  loadFontsForCode(lang);
  // TODO: this curried function is annoying
  const languageLink = createLanguageLink(slug, lang);
  const enSlug = languageLink('en');
  const editUrl = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/master/src/pages/${enSlug.slice(
    1,
    enSlug.length - 1
  )}/index${lang === 'en' ? '' : '.' + lang}.md`;
  const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `https://overreacted.io${enSlug}`
  )}`;

  return (
    <Layout location={props.location} title={siteTitle}>
      <SEO
        lang={lang}
        title={post.frontmatter.title}
        description={post.frontmatter.spoiler}
        slug={post.fields.slug}
      />
      <main>
        <article>
          <header>
            <h1 style={{ color: 'var(--textTitle)' }}>
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
                marginTop: rhythm(-4 / 5),
              }}
            >
              {formatPostDate(post.frontmatter.date, lang)}
              {` • ${formatReadingTime(post.timeToRead)}`}
            </p>
          </header>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
      <aside>
        <div
          style={{
            margin: '60px 0 40px 0',
            fontFamily: systemFont,
          }}
        ></div>
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: rhythm(0.25),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'var(--pink)',
            }}
            to={'/'}
          >
            shifeiqi.top
          </Link>
        </h3>
        <Bio />
        <nav>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link
                  to={previous.fields.slug}
                  rel="prev"
                  style={{ marginRight: 20 }}
                >
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        spoiler
        cta
      }
      fields {
        slug
        langKey
      }
    }
  }
`;
