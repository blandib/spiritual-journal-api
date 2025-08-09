const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const validators = require("../middleware/validators");

// User routes
router.get("/", usersController.getAllUsers);
router.get("/:id", validators.validateObjectId, usersController.getUserById);
router.post("/", validators.validateUserData, usersController.createUser);
router.put(
  "/:id",
  validators.validateObjectId,
  validators.validateUserData,
  usersController.updateUser
);
router.delete("/:id", validators.validateObjectId, usersController.deleteUser);

module.exports = router;
