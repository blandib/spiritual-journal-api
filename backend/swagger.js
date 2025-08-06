
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spiritual Journal API',
      version: '1.0.0',
      description: 'API for managing spiritual journal entries and users',
    },
    servers: [
      { 
        url: 'http://localhost:3000',
        description: 'Development server' 
      },
      {
        url: 'https://spiritual-journal-api.onrender.com',
        description: 'Production server' 
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' }
          }
        },
        Entry: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Reflection on Faith' },
            content: { type: 'string', example: 'Today I prayed about...' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  example: 'ValidationError'
                },
                message: {
                  type: 'string',
                  example: 'Title and content are required'
                },
                statusCode: {
                  type: 'integer',
                  example: 400
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
};