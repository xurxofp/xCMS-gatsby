require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const strapiConfig = {
  // apiURL: `http://${process.env.STRAPI_URL}` || "http://strapi:1337",
  apiURL: "http://172.19.0.1:1337",
  collectionTypes: ["resumya_post", "resumya_category", "resumya_author"],
};


module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    {
      resolve: "gatsby-source-strapi",
      options: {
        version: 5,
        apiURL: process.env.STRAPI_URL
          ? `http://${process.env.STRAPI_URL}`
          : "http://strapi:1337",
        collectionTypes: [
          {
            singularName: "resumya-post",
          },
          {
            singularName: "resumya-category",
          },
          {
            singularName: "resumya-author",
          },
        ],
        singleTypes: [],
        skipFileDownloads: true,
      },
    },
    "gatsby-transformer-remark",
    `gatsby-plugin-image`,
    `gatsby-plugin-react-helmet`,

  ],
}