import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

const Category = ({ data }) => {
  const category = data.strapiResumyaCategory
  const posts = category.resumya_posts || []

  return (
    <Layout pageTitle={category.name}>
      <ul className="postlist">
        {posts.map((post) => {
          const authors = post.resumya_authors || []
          return (
            <li key={post.id}>
              <Link className="postlink" to={`/${post.slug}`}>
                <h3>{post.title}</h3>
              </Link>

              <div className="image-wrap">
                <img
                  className="cover"
                  src={post.cover.url}
                  alt={`Cover for ${post.title}`}
                />
                {authors.map((author, idx) => (
                  <img
                    key={idx}
                    className="avatar"
                    src={author.avatar.url}
                    alt={`Avatar for ${author.name}`}
                  />
                ))}
              </div>

              <p className="date">{post.date}</p>

              <div className="postauthors">
                {authors.map((author, idx) => (
                  <p key={idx} className="name">Written by {author.name}</p>
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
  query ($id: String) {
    strapiResumyaCategory(id: { eq: $id }) {
      name
      resumya_posts {
        id
        slug
        title
        date(formatString: "MMMM D, YYYY")
        excerpt
        cover {
          url
        }
        resumya_authors {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`

export const Head = ({ data }) => (
  <title>{data.strapiResumyaCategory.name} - Strapi Gatsby Blog Site</title>
)

export default Category
