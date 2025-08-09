const mongoose = require("mongoose");

module.exports = (err, req, res, next) => {
  const error = {
    success: false,
    error: {
      type: err.name || "ServerError",
      message: err.message || "Internal server error",
      details: err.details || [],
      statusCode: err.statusCode || 500,
    },
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error.error.type = "ValidationError";
    error.error.statusCode = 400;
    error.error.details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    error.error.type = "DuplicateKeyError";
    error.error.statusCode = 409;
    error.error.message = "Duplicate field value entered";
    error.error.details = Object.keys(err.keyPattern).map((field) => ({
      field,
      message: `'${field}' must be unique`,
    }));
  }

  // Invalid ObjectId
  if (
    err.kind === "ObjectId" ||
    (err.name === "CastError" && err instanceof mongoose.Error.CastError)
  ) {
    error.error.type = "InvalidIdError";
    error.error.statusCode = 400;
    error.error.message = "Invalid resource ID format";
  }

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.error(err);
    error.error.stack = err.stack;
  }

  res.status(error.error.statusCode).json(error);
};
