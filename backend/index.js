require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Routes
app.get("/api/persons", async (req, res) => {
  try {
    const people = await Person.find({});
    res.json(people);
  } catch (error) {
    console.error("Error fetching persons:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/info", async (req, res) => {
  try {
    const count = await Person.countDocuments({});
    const date = new Date();
    res.send(`Phonebook has info for ${count} people<br>${date}`);
  } catch (error) {
    console.error("Error fetching info:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/persons/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  } catch (error) {
    console.error("Error fetching person:", error);
    res.status(400).json({ error: "Malformed ID" });
  }
});

app.post("/api/persons", async (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Name or number is missing" });
  }

  try {
    const existingPerson = await Person.findOne({ name });
    if (existingPerson) {
      return res.status(400).json({ error: "Entry already exists" });
    }

    const newPerson = new Person({ name, number });
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    console.error("Error saving person:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  try {
    const result = await Person.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  } catch (error) {
    console.error("Error deleting person:", error);
    res.status(400).json({ error: "Malformed ID" });
  }
});

app.put("/api/persons/:id", async (req, res) => {
  const { number } = req.body;

  if (!number) {
    return res.status(400).json({ error: "Number is missing" });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { number },
      { new: true, runValidators: true, context: "query" }
    );
    if (updatedPerson) {
      res.json(updatedPerson);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  } catch (error) {
    console.error("Error updating person:", error);
    res.status(400).json({ error: "Malformed ID or validation error" });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
