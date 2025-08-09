const express = require("express");
const router = express.Router();
const entriesController = require("../controllers/entriesController");
const validators = require("../middleware/validators");

// Define routes for entries
router.get("/", entriesController.getAllEntries);
router.get("/:id", validators.validateObjectId, entriesController.getEntryById);
router.post("/", validators.validateEntryData, entriesController.createEntry);
router.put(
  "/:id",
  validators.validateObjectId,
  validators.validateEntryData,
  entriesController.updateEntry
);
router.delete(
  "/:id",
  validators.validateObjectId,
  entriesController.deleteEntry
);

module.exports = router;
