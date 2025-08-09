const Entry = require("../models/entry");

// POST /entries
exports.createEntry = async (req, res, next) => {
  try {
    const entry = await Entry.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

// DELETE /entries/:id
exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry)
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    res.json({ success: true, message: "Entry deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /entries
exports.getAllEntries = async (req, res, next) => {
  try {
    const entries = await Entry.find();
    res.json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
};

// GET /entries/:id
exports.getEntryById = async (req, res, next) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry)
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

// PUT /entries/:id
exports.updateEntry = async (req, res, next) => {
  try {
    const entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry)
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    res.json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};
