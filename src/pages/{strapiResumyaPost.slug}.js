import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'

const BlogPost = ({ data }) => {
  const post = data.strapiResumyaPost
  const authors = post.resumya_authors || []
  const categories = post.resumya_categories || []

  return (
    <Layout pageTitle={post.title}>
      <img
        className="postcover"
        src={post.cover.url}
        alt={`Cover for ${post.title}`}
      />

      <p className="postdate">{post.date}</p>

      {/* Render multiple authors */}
      <div className="postauthors">
        {authors.map((author, idx) => (
          <div key={idx} className="postauthor">
            <img
              className="postavatar"
              src={author.avatar.url}
              alt={`Avatar for ${author.name}`}
            />
            <p>Written by {author.name}</p>
          </div>
        ))}
      </div>

      {/* Render multiple categories */}
      <div className="postcategories">
        {categories.map((cat) => (
          <p key={cat.slug} className="postcategory">
            <Link to={`/${cat.slug}`}>Category: {cat.name}</Link>
          </p>
        ))}
      </div>

      <div className="postcontent">
        {post.content.map((block, i) =>
          block.children.map((child, j) =>
            child.text ? <p key={`${i}-${j}`}>{child.text}</p> : null
          )
        )}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    strapiResumyaPost(id: { eq: $id }) {
      title
      date(formatString: "MMMM D, YYYY")
      cover {
        url
      }
      resumya_authors {
        name
        avatar {
          url
        }
      }
      resumya_categories {
        name
        slug
      }
      content {
        children {
          text
        }
      }
    }
  }
`

export const Head = ({ data }) => (
  <title>{data.strapiResumyaPost.title} - Strapi Gatsby Blog Site</title>
)

export default BlogPost
