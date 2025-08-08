// backend/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Spiritual Journal API',
      version: '1.0.0',
      description: 'API for managing spiritual journal entries and users',
    },
    servers: [
      { url: 'http://localhost:3001', description: 'Local (dev)' },
      { url: 'https://spiritual-journal-api.onrender.com', description: 'Production (Render)' },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ObjectId', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            githubId: { type: 'string', example: '1234567' }
          }
        },
        Entry: {
          type: 'object',
          required: ['title', 'content'],
          properties: {
            _id: { type: 'string', description: 'ObjectId', example: '64ff1f77bcf86cd7994390aa' },
            title: { type: 'string', example: 'Reflection on Faith' },
            content: { type: 'string', example: 'Today I prayed about...' },
            userId: { type: 'string', description: 'User ObjectId', example: '507f1f77bcf86cd799439011' },
            tags: { type: 'array', items: { type: 'string' }, example: ['gratitude', 'faith'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'ValidationError' },
            message: { type: 'string', example: 'Title and content are required' },
            statusCode: { type: 'integer', example: 400 },
            path: { type: 'string', example: '/api/entries' }
          }
        }
      }
    },
    paths: {
      // ===== ENTRIES =====
      '/api/entries': {
        get: {
          summary: 'List all entries',
          tags: ['Entries'],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/Entry' } }
                }
              }
            },
            500: { description: 'Server error' }
          }
        },
        post: {
          summary: 'Create a new entry',
          tags: ['Entries'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'content'],
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } },
                    userId: { type: 'string' }
                  }
                },
                example: { title: 'My Day', content: 'Grateful for...', tags: ['gratitude'] }
              }
            }
          },
          responses: {
            201: {
              description: 'Created',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/Entry' } } }
            },
            400: { description: 'Bad Request (validation failed or invalid id)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/entries/{id}': {
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'Entry ObjectId' }
        ],
        get: {
          summary: 'Get a single entry by id',
          tags: ['Entries'],
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Entry' } } } },
            400: { description: 'Invalid id', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Not found' }
          }
        },
        put: {
          summary: 'Update an existing entry',
          tags: ['Entries'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    tags: { type: 'array', items: { type: 'string' } }
                  }
                },
                example: { title: 'Updated Title', content: 'Updated content', tags: ['peace'] }
              }
            }
          },
          responses: {
            200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Entry' } } } },
            400: { description: 'Bad Request (validation failed or invalid id)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Not found' }
          }
        },
        delete: {
          summary: 'Delete an entry',
          tags: ['Entries'],
          responses: {
            204: { description: 'No Content' },
            400: { description: 'Invalid id', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Not found' }
          }
        }
      },

      // ===== USERS =====
      '/api/users': {
        get: {
          summary: 'List all users',
          tags: ['Users'],
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                }
              }
            },
            500: { description: 'Server error' }
          }
        }
      },
      '/api/users/{id}': {
        parameters: [
          { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'User ObjectId' }
        ],
        get: {
          summary: 'Get a single user by id',
          tags: ['Users'],
          responses: {
            200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            400: { description: 'Invalid id', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Not found' }
          }
        },
        put: {
          summary: 'Update an existing user',
          tags: ['Users'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                  }
                },
                example: { name: 'Jane Doe', email: 'jane@example.com' }
              }
            }
          },
          responses: {
            200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
            400: { description: 'Bad Request (validation failed or invalid id)', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Not found' }
          }
        },
        delete: {
          summary: 'Delete a user',
          tags: ['Users'],
          responses: {
            204: { description: 'No Content' },
            400: { description: 'Invalid id', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Not found' }
          }
        }
      }
    }
  },
  // If you prefer JSDoc-in-routes, keep this to scan them too:
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};
