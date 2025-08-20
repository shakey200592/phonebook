import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import Person from "./models/Person.js";
dotenv.config();

const app = express();

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "MissingFieldsError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
const createError = (errorMessage, errorName, next) => {
  const error = new Error(errorMessage);
  error.name = errorName;
  next(error);
};

// Middlewares
app.use(express.static("dist"));
app.use(express.json());

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
app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ message: `Person with id ${id} not found` });
      }
    })
    .catch((error) => {
      console.log(error.name);
      next(error);
    });
});
app.get("/api/info", (req, res) => {
  const today = new Date();
  const phonebook = Person.find({}).then((persons) => {
    res.send(`${today}<br>Phonebook has ${persons.length} persons`);
  });
});
app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return createError(
      "All fields must contain data",
      "MissingFieldsError",
      next,
    );
  }

  Person.findOne({ name })
    .then((person) => {
      if (person) {
        res.status(400).json({ message: "Person already exists" });
      }
      const newPerson = new Person({ name, number });
      return newPerson.save();
    })
    .then((savedPerson) => {
      return res
        .status(201)
        .json({ message: "succesfully created new person", data: savedPerson });
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  Person.findByIdAndDelete(id)
    .then(() => res.status(200).json({ message: "Person Deleted" }))
    .catch((err) =>
      res.status(500).json({ message: "Something went wrong", error: err }),
    );
});
app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const number = req.body.number;
  Person.findByIdAndUpdate(
    id,
    { number: number },
    { new: true, runValidators: true },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res
          .status(200)
          .json({ message: "Succesfully updated Person", data: updatedPerson });
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
