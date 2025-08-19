import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import Person from "./models/Person.js";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status: :res[content-length] - :response-time ms :body",
  ),
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});
app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  Person.findById(id).then((person) => {
    res.json(person);
  });
});
app.get("/api/info", (req, res) => {
  const today = new Date();
  res.send(`Phonebook has info for ${persons.length} people<br><br> ${today}`);
});
app.post("/api/persons", (req, res) => {
  const data = req.body;

  if (!data.name || !data.number) {
    return res.status(400).json({ error: "All fields must contain data" }); //
  }

  Person.findOne({ name: data.name })
    .then((person) => {
      if (person) {
        res.status(400).json({ message: "Person already exists" });
      }
      const newPerson = new Person(data);
      return newPerson.save();
    })
    .then((savedPerson) => {
      return res
        .status(201)
        .json({ message: "succesfully created new person", data: savedPerson });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Something went wrong", error: err });
    });
});
app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  Person.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: "Person Deleted" }))
    .catch((err) =>
      res.status(500).json({ message: "Something went wrong", error: err }),
    );
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
