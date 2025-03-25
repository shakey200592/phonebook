import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:3001/api/persons";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setPersons(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "name") {
      setNewName(value);
    } else if (name === "number") {
      setNewPhoneNumber(value);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${Number(id)}`);
      setPersons(persons.filter((person) => person.id !== id));
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  };

  const addPerson = async (event) => {
    event.preventDefault();

    try {
      // Check if name or number is empty
      if (!newName.trim() || !newPhoneNumber.trim()) {
        alert("Name and number cannot be empty");
        return;
      }

      // Create the new person object
      const newPersonObject = {
        name: newName,
        number: newPhoneNumber,
      };

      // Send POST request to add the new person
      const response = await axios.post(BASE_URL, newPersonObject);

      // Update the state with the new person returned from the server
      // This ensures we have the full object with an ID
      setPersons([...persons, response.data]);

      // Clear the input fields
      setNewName("");
      setNewPhoneNumber("");
    } catch (error) {
      console.error("Error adding person:", error);
      alert("Failed to add person. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input
            name="name"
            value={newName}
            onChange={handleInputChange}
            placeholder="Enter name"
          />
        </div>
        <div>
          number:{" "}
          <input
            name="number"
            value={newPhoneNumber}
            onChange={handleInputChange}
            placeholder="Enter phone number"
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.length > 0 ? (
        persons.map((person) => (
          <p className="person" key={person.id}>
            {person.name}: {person.number}
            <button onClick={() => handleDelete(person.id)}>DELETE</button>
          </p>
        ))
      ) : (
        <p>No Results Found</p>
      )}
    </>
  );
}

export default App;
