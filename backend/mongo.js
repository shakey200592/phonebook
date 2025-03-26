const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

console.log(process.argv);

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://shakey1992jm:${password}@cluster0.bfviqdi.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", phoneBookSchema);

if (process.argv > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log("Note Saved");
  });
}

Person.find({}).then((result) => {
  console.log("Phonebook:");
  result.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
  mongoose.connection.close();
});
