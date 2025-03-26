import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "/api/persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setPersons(response.data);
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    };
    fetchPersons();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") setNewName(value);
    if (name === "number") setNewPhoneNumber(value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        setPersons(persons.filter((person) => person.id !== id));
      } catch (error) {
        console.error("Error deleting person:", error);
      }
    }
  };

  const addOrUpdatePerson = async (event) => {
    event.preventDefault();

    if (!newName.trim() || !newPhoneNumber.trim()) {
      alert("Name and number cannot be empty");
      return;
    }

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook. Replace the old number with the new one?`
      );

      if (confirmUpdate) {
        try {
          const updatedPerson = { ...existingPerson, number: newPhoneNumber };
          const response = await axios.put(
            `${BASE_URL}/${existingPerson.id}`,
            updatedPerson
          );
          setPersons(
            persons.map((person) =>
              person.id === existingPerson.id ? response.data : person
            )
          );
          setNewName("");
          setNewPhoneNumber("");
        } catch (error) {
          console.error("Error updating person:", error);
        }
      }
    } else {
      try {
        const newPerson = { name: newName, number: newPhoneNumber };
        const response = await axios.post(BASE_URL, newPerson);
        setPersons([...persons, response.data]);
        setNewName("");
        setNewPhoneNumber("");
      } catch (error) {
        console.error("Error adding person:", error);
      }
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <form onSubmit={addOrUpdatePerson}>
        <div>
          Name:{" "}
          <input
            name="name"
            value={newName}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
        </div>
        <div>
          Number:{" "}
          <input
            name="number"
            value={newPhoneNumber}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </div>
        <button type="submit">Add</button>
      </form>

      <h2>Numbers</h2>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name}: {person.number}{" "}
          <button onClick={() => handleDelete(person.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;
