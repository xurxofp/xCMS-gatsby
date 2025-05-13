require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

const strapiConfig = {
    // apiURL: `http://${process.env.STRAPI_URL}` || "http://strapi:1337",
    apiURL: "http://xCMS-strapi:1337",
    collectionTypes: ["resumya_post", "resumya_category", "resumya_author"],
};


module.exports = {
    siteMetadata: {
        title: `Gatsby Default Starter`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
        author: `@gatsbyjs`,
    },
    plugins: [{
            resolve: "gatsby-source-strapi",
            options: {
                version: 5,
                apiURL: 'http://xCMS-strapi:1337',
                collectionTypes: [{
                        singularName: "resumya-post",
                        queryParams: {
                            populate: "*" // Ojo: comillas, no objeto vacío
                        }
                        // queryParams: {
                        //     populate: {
                        //         cover: "*"
                        //     },
                        // },
                    },
                    {
                        singularName: "resumya-category",
                        queryParams: {
                            populate: "*" // Ojo: comillas, no objeto vacío
                        }
                    },
                    {
                        singularName: "resumya-author",
                        queryParams: {
                            populate: "*" // Ojo: comillas, no objeto vacío
                        }
                        // queryParams: {
                        //     populate: {
                        //         avatar: "*",
                        //     },
                        // },
                    },
                ],
                singleTypes: [],
                // skipFileDownloads: true,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `/home/gatsby-app/src/images`, // <- esto debe existir en disco
            },
        },
        // {
        //     resolve: `gatsby-plugin-remote-images`,
        //     options: {
        //         // el tipo de nodo que genera Strapi para tus posts
        //         nodeType: "STRAPI_RESUMYA_POST",
        //         // ruta al string con HTML
        //         imagePath: "content.data.content",
        //         // nombre del campo que aparecerá en GraphQL
        //         name: "remoteImages",
        //         // hay varias imágenes por post
        //         type: "multiple",
        //         // busca URLs donde sea dentro del string
        //         strict: false,
        //     },
        // },
        "gatsby-transformer-remark",
        `gatsby-plugin-image`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
    ],
}