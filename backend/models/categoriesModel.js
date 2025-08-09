const { ObjectId } = require("mongodb");

class CategoriesModel {
  constructor(db) {
    this.collection = db.collection("categories");
  }

  async getAll() {
    return this.collection.find().toArray();
  }

  async getById(id) {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(category) {
    return this.collection.insertOne(category);
  }

  async update(id, update) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
  }

  async delete(id) {
    return this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = CategoriesModel;
