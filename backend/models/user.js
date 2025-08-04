const mongodb = require('mongodb');

const userSchema = new mongodb.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  githubId: { type: String, unique: true },
  profilePic: String
}, { timestamps: true });

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {
  // ...
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         githubId:
 *           type: string
 *           description: The user's GitHub ID
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john@example.com
 *         githubId: 1234567
 */

module.exports = mongodb.model('user', userSchema);