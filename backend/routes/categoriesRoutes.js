const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - categories
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 */
 router.get("/", async (req, res) => {
  const db = req.app.locals.db;
  const Categories = new (require("../models/categoriesModel"))(db);
  res.json(await Categories.getAll());
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     tags:
 *       - categories
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Not found
 */
router.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const Categories = new (require("../models/categoriesModel"))(db);
  const category = await Categories.getById(req.params.id);
  if (!category) return res.status(404).json({ error: "Not found" });
  res.json(category);
});

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - categories
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Missing name
 */
router.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const Categories = new (require("../models/categoriesModel"))(db);
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Missing name" });
  const result = await Categories.create({ name, description });
  res.status(201).json(result);
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags:
 *       - categories
 *     summary: Update a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const Categories = new (require("../models/categoriesModel"))(db);
  const result = await Categories.update(req.params.id, req.body);
  res.json(result);
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - categories
 *     summary: Delete a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const Categories = new (require("../models/categoriesModel"))(db);
  const result = await Categories.delete(req.params.id);
  res.json(result);
});

module.exports = router;
