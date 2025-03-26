const mongoose = require("mongoose");

const password = encodeURIComponent(process.argv[2]);

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((result) => console.log("Connected to mongoDB"))
  .catch((error) => console.log("Error connecting to mongoDB", error));

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

phoneBookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", phoneBookSchema);
