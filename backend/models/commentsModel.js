const { ObjectId } = require("mongodb");

class CommentsModel {
  constructor(db) {
    this.collection = db.collection("comments");
  }

  async getAll() {
    return this.collection.find().toArray();
  }

  async getById(id) {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(comment) {
    return this.collection.insertOne(comment);
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

module.exports = CommentsModel;
