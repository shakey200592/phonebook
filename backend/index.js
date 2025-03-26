require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const Person = require("./models/person");

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();
  Person.countDocuments({}).then((count) =>
    res.send(`Phonebook has info for ${count} people`)
  );
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: "maformed id" });
    });
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "Name is missing" });
  }

  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        // Stop execution by returning the response
        return res.status(400).json({ error: "Entry already exists" });
      }

      const addperson = new Person({
        name: body.name,
        number: body.number,
      });

      addperson.save().then((savedPerson) => res.json(savedPerson));
    })
    .catch((error) => {
      console.error("Error saving person:", error);
      res.status(500).json({ error: "Server error" });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "person does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: "malformed id" });
    });
});

app.put("/api/persons/:id", (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "number is missing" });
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).json({ error: "person not found" });
      }
    })
    .catch((error) => {
      console.error("Error updating person", error);
      res.status(400).json({ error: "malformed id or validation error" });
    });
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server Listening on Port ${PORT}`);
