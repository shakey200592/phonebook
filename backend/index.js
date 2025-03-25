const express = require("express");
const app = express();
app.use(express.json());

const morgan = require("morgan");

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const cors = require("cors");
app.use(cors());

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
  res.json(phonebook);
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
  const id = Number(req.params.id);
  const person = phonebook.find((p) => p.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.post("/api/persons/", (req, res) => {
  const maxId =
    phonebook.length > 0
      ? Math.max(...phonebook.map((person) => Number(person.id)))
      : 0;

  const body = req.body;

  if (!body.name) {
    return res.status(400).json({ error: "Name is missing" });
  }

  if (phonebook.some((person) => person.name === body.name)) {
    return res.status(400).json({ error: "Already exists" });
  }

  const person = {
    id: maxId + 1,
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(person);
  res.json(person);
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

const PORT = 3001;
app.listen(PORT);
console.log(`Server Listening on Port ${PORT}`);
