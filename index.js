import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status: :res[content-length] - :response-time ms :body",
  ),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.status(200).json({ success: true, data: person });
  } else {
    res.status(404).json({ success: false, error: "Person not found" });
  }
});
app.get("/api/info", (req, res) => {
  const today = new Date();
  res.send(`Phonebook has info for ${persons.length} people<br><br> ${today}`);
});
app.post("/api/persons", (req, res) => {
  const data = req.body;
  const personExists = persons.find((person) => person.name === data.name);

  if (!data.name || !data.number) {
    return res.status(400).json({ error: "All fields must contain data" }); //
  } else if (personExists) {
    return res.status(400).json({ error: "Name already exists" });
  }

  //const maxId = persons.length > 0 ? Math.max()
  const maxId = Math.max(...persons.map((person) => person.id));
  const newPerson = { id: maxId + 1, name: data.name, number: data.number };
  persons = [...persons, newPerson];

  res
    .status(201)
    .json({ message: "Succesfully created new user", data: newPerson });
});
app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  persons = persons.filter((person) => person.id !== id);
  res.status(200).json({
    message: "person deleted succesfully",
  });
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
