import mongoose from "mongoose";
import { connectMongoDb } from "./util/connectDb.js";

connectMongoDb();

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{2,3}-\d{7,8}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);
export default Person;
