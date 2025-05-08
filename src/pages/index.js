// src/pages/index.js
import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/layout'
import SEO from "../components/seo"


const IndexPage = ({ data }) => {
  const posts = data.allStrapiResumyaPost.nodes || []

  return (
    <Layout pageTitle="Home Page">
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
      <ul className="postlist">
        {posts.map((node) => {
          const authors = node.resumya_authors || []
          const categories = node.resumya_categories || []

          return (
            <li key={node.id}>
              <Link className="postlink" to={`/${node.slug}`}>
                <h3>{node.title}</h3>
              </Link>

              <div className="image-wrap">
                <img
                  className="cover"
                  src={node.cover.url}
                  alt={`Cover for ${node.title}`}
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

              <p className="date">{node.date}</p>

              <div className="postauthors">
                {authors.map((author, idx) => (
                  <p key={idx} className="name">Written by {author.name}</p>
                ))}
              </div>

              <div className="postcategories">
                {categories.map((cat) => (
                  <p key={cat.slug} className="postcategory">
                    <Link to={`/${cat.slug}`}>Category: {cat.name}</Link>
                  </p>
                ))}
              </div>

              <p className="excerpt">{node.excerpt}</p>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export const query = graphql`
  query {
    allStrapiResumyaPost(sort: { date: DESC }) {
      nodes {
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
        resumya_categories {
          name
          slug
        }
      }
    }
  }
`

export const Head = () => <title>Home Page - Strapi Gatsby Blog</title>

export default IndexPage
