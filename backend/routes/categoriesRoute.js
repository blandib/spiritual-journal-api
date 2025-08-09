const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const validators = require("../middleware/validators");

// Route to get all categories
router.get("/", categoriesController.getAllCategories);

// Route to get a single category by ID
router.get(
  "/:id",
  validators.updateCategoryValidator,
  categoriesController.getCategoryById
);

// Route to create a new category
router.post(
  "/",
  validators.createCategoryValidator,
  categoriesController.createCategory
);

// Route to update a category by ID
router.put(
  "/:id",
  validators.updateCategoryValidator,
  categoriesController.updateCategory
);

// Route to delete a category by ID
router.delete(
  "/:id",
  validators.updateCategoryValidator,
  categoriesController.deleteCategory
);

module.exports = router;
