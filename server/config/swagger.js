const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Movie App API",
      version: "1.0.0",
      description: "API documentation for Movie Application",
      contact: {
        name: "Movie App Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.movieapp.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string" },
            role: { type: "string", enum: ["user", "admin"] },
            movieWatched: { type: "array", items: { type: "string" } },
            favourite: { type: "array", items: { type: "string" } },
          },
        },
        Movie: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            poster_url: { type: "string" },
            year: { type: "number" },
            rating: { type: "number" },
            views: { type: "number" },
            description: { type: "string" },
            actors: { type: "array", items: { type: "string" } },
            director: { type: "string" },
            categories: { type: "array", items: { type: "string" } },
          },
        },
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string" },
            content: { type: "string" },
            user: { type: "string" },
            movie: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
