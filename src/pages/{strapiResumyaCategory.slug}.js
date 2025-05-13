import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const Category = ({ data }) => {
  const category = data.strapiResumyaCategory
  const posts = category.resumya_posts || []

  return (
    <Layout pageTitle={category.name}>
      <ul className="postlist">
        {posts.map(post => {
          const authors = post.resumya_authors || []

          // Prepara la imagen de portada
          const coverImage = getImage(post.cover.localFile)

          return (
            <li key={post.id}>
              <Link className="postlink" to={`/${post.slug}`}>
                <h3>{post.title}</h3>
              </Link>

              <div className="image-wrap">
                {/* Portada optimizada */}
                {coverImage && (
                  <GatsbyImage
                    className="cover"
                    image={coverImage}
                    alt={`Cover for ${post.title}`}
                  />
                )}

                {/* Avatares optimizados */}
                {authors.map((author, idx) => {
                  const avatarImage = getImage(author.avatar.localFile)
                  return (
                    avatarImage && (
                      <GatsbyImage
                        key={idx}
                        className="avatar"
                        image={avatarImage}
                        alt={`Avatar for ${author.name}`}
                      />
                    )
                  )
                })}
              </div>

              <p className="date">{post.date}</p>

              <div className="postauthors">
                {authors.map((author, idx) => (
                  <p key={idx} className="name">
                    Written by {author.name}
                  </p>
                ))}
              </div>

              <p className="description">{post.excerpt}</p>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query CategoryById($id: String!) {
    strapiResumyaCategory(id: { eq: $id }) {
      name
      resumya_posts {
        id
        slug
        title
        date(formatString: "MMMM D, YYYY")
        excerpt

        # Portada: pedimos localFile.childImageSharp
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

        # Autores: avatar como localFile.childImageSharp
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
      }
    }
  }
`

export const Head = ({ data }) => (
  <title>
    {data.strapiResumyaCategory.name} – Strapi Gatsby Blog Site
  </title>
)

export default Category
