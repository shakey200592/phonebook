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

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons/", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `<p>Phonebook has info for ${
      phonebook.length
    } people</p><p>${date.toString()}</p>`
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

  if (phonebook.some((person) => person.name === body.name)) {
    return res.status(400).json({ error: "Already exists" });
  }

  const addperson = new Person({
    name: body.name,
    number: body.number,
  });

  addperson.save().then((savedPerson) => res.json(savedPerson));
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personExists = phonebook.some((person) => person.id === id);

  if (!personExists) {
    return res.status(404).json({ error: "person does not exist" });
  }
  phonebook = phonebook.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server Listening on Port ${PORT}`);
