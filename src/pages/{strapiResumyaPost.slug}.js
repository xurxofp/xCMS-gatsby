import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import parse from 'html-react-parser';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import SEO from '../components/seo';

const BlogPost = ({ data }) => {
  const post = data.strapiResumyaPost;
  const authors = post.resumya_authors || [];
  const categories = post.resumya_categories || [];

  // GatsbyImage para la portada
  const coverImg = getImage(post.cover.localFile);

  // Array de nodos File con childImageSharp para cada inlineImage
  const inlineImages = post.inlineImages || [];

  // Contador para emparejar cada <img> con su inlineImages[idx]
  let imgIndex = 0;

  // Parseamos el HTML y reemplazamos las <img> por <GatsbyImage>
  const contentTree = parse(post.content.data.content, {
    replace: domNode => {
      if (
        domNode.name === 'img' &&
        domNode.attribs &&
        inlineImages[imgIndex]
      ) {
        const fileNode = inlineImages[imgIndex++];
        const imageData = getImage(fileNode);
        return (
          <GatsbyImage
            image={imageData}
            alt={domNode.attribs.alt || ''}
            title={domNode.attribs.title || ''}
          />
        );
      }
    },
  });

  return (
    <Layout pageTitle={post.title}>
      <SEO title={post.title} />

      {/* Portada optimizada */}
      {coverImg && (
        <GatsbyImage
          image={coverImg}
          alt={`Cover for ${post.title}`}
          className="postcover"
        />
      )}

      <p className="postdate">{post.date}</p>

      {/* Autores con Avatar optimizado */}
      <div className="postauthors">
        {authors.map((author, idx) => {
          const avatarImg = getImage(author.avatar.localFile);
          return (
            <div key={idx} className="postauthor">
              {avatarImg && (
                <GatsbyImage
                  image={avatarImg}
                  alt={`Avatar for ${author.name}`}
                  className="postavatar"
                />
              )}
              <p>Written by {author.name}</p>
            </div>
          );
        })}
      </div>

      {/* Categorías */}
      <div className="postcategories">
        {categories.map(cat => (
          <p key={cat.slug} className="postcategory">
            <Link to={`/${cat.slug}`}>Category: {cat.name}</Link>
          </p>
        ))}
      </div>

      {/* Contenido parseado */}
      <div className="postcontent">
        {contentTree}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostById($id: String!) {
    strapiResumyaPost(id: { eq: $id }) {
      title
      slug
      date(formatString: "MMMM D, YYYY")
      cover {
        localFile {
          childImageSharp {
            gatsbyImageData(
              width: 800
              placeholder: BLURRED
              formats: [AUTO, AVIF]
            )
          }
        }
      }
      resumya_authors {
        name
        avatar {
          localFile {
            childImageSharp {
              gatsbyImageData(
                width: 40
                height: 40
                placeholder: DOMINANT_COLOR
                formats: [AUTO, AVIF]
              )
            }
          }
        }
      }
      resumya_categories {
        name
        slug
      }

      # ——— Aquí añadimos inlineImages ———
      inlineImages {
        childImageSharp {
          gatsbyImageData(
            width: 800
            placeholder: BLURRED
            formats: [AUTO, AVIF]
          )
        }
      }

      content {
        data {
          content
        }
      }
    }
  }
`;

export const Head = ({ data }) => (
  <title>{data.strapiResumyaPost.title} – Strapi Gatsby Blog Site</title>
);

export default BlogPost;
