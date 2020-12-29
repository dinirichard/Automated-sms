const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// const types = mongoose.;

const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    name: String,
    photoUrl: String,
    contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
  },
  {
    collection: "User",
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
