const { ObjectId } = require("mongodb");

// --- User Handlers ---
async function getAllUsers(req, res) {
  try {
    const db = req.app.locals.db;
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
async function getUserById(req, res) {
  try {
    const db = req.app.locals.db;
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// --- Entry Handlers ---
async function getAllEntries(req, res) {
  try {
    const db = req.app.locals.db;
    const entries = await db.collection("entries").find({}).toArray();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
async function getEntryById(req, res) {
  try {
    const db = req.app.locals.db;
    const entry = await db
      .collection("entries")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// --- Comment Handlers ---
async function getAllComments(req, res) {
  try {
    const db = req.app.locals.db;
    const comments = await db.collection("comments").find({}).toArray();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
async function getCommentById(req, res) {
  try {
    const db = req.app.locals.db;
    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// --- Category Handlers ---
async function getAllCategories(req, res) {
  try {
    const db = req.app.locals.db;
    const categories = await db.collection("categories").find({}).toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
async function getCategoryById(req, res) {
  try {
    const db = req.app.locals.db;
    const category = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// --- User Tests ---
describe("User Routes Unit Tests", () => {
  it("should return all users", async () => {
    const mockUsers = [{ name: "John" }, { name: "Jane" }];
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockUsers),
              }),
            }),
          },
        },
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should return a user by id", async () => {
    const mockUser = { name: "John", _id: "507f1f77bcf86cd799439011" };
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(mockUser),
            }),
          },
        },
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it("should return 404 if user not found", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439099" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(null),
            }),
          },
        },
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should handle errors gracefully in getAllUsers", async () => {
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockImplementation(() => {
              throw new Error("DB error");
            }),
          },
        },
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

// --- Entry Tests ---
describe("Entry Routes Unit Tests", () => {
  it("should return all entries", async () => {
    const mockEntries = [{ title: "Entry1" }, { title: "Entry2" }];
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockEntries),
              }),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getAllEntries(req, res);
    expect(res.json).toHaveBeenCalledWith(mockEntries);
  });

  it("should return an entry by id", async () => {
    const mockEntry = { title: "Entry1", _id: "507f1f77bcf86cd799439011" };
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(mockEntry),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getEntryById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockEntry);
  });

  it("should return 404 if entry not found", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439099" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(null),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getEntryById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Entry not found" });
  });

  it("should handle errors gracefully in getAllEntries", async () => {
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockImplementation(() => {
              throw new Error("DB error");
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getAllEntries(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

// --- Comment Tests ---
describe("Comment Routes Unit Tests", () => {
  it("should return all comments", async () => {
    const mockComments = [{ text: "Nice!" }, { text: "Great!" }];
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockComments),
              }),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getAllComments(req, res);
    expect(res.json).toHaveBeenCalledWith(mockComments);
  });

  it("should return a comment by id", async () => {
    const mockComment = { text: "Nice!", _id: "507f1f77bcf86cd799439011" };
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(mockComment),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getCommentById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockComment);
  });

  it("should return 404 if comment not found", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439099" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(null),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getCommentById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Comment not found" });
  });

  it("should handle errors gracefully in getAllComments", async () => {
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockImplementation(() => {
              throw new Error("DB error");
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getAllComments(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});

// --- Category Tests ---
describe("Categories Routes Unit Tests", () => {
  it("should return all categories", async () => {
    const mockCategories = [{ name: "Prayer" }, { name: "Meditation" }];
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockCategories),
              }),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getAllCategories(req, res);
    expect(res.json).toHaveBeenCalledWith(mockCategories);
  });

  it("should return a category by id", async () => {
    const mockCategory = { name: "Prayer", _id: "507f1f77bcf86cd799439011" };
    const req = {
      params: { id: "507f1f77bcf86cd799439011" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(mockCategory),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getCategoryById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  it("should return 404 if category not found", async () => {
    const req = {
      params: { id: "507f1f77bcf86cd799439099" },
      app: {
        locals: {
          db: {
            collection: jest.fn().mockReturnValue({
              findOne: jest.fn().mockResolvedValue(null),
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getCategoryById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
  });

  it("should handle errors gracefully in getAllCategories", async () => {
    const req = {
      app: {
        locals: {
          db: {
            collection: jest.fn().mockImplementation(() => {
              throw new Error("DB error");
            }),
          },
        },
      },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await getAllCategories(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
