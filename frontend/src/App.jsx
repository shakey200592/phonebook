import { useEffect, useState } from "react";
import { Filter } from "./Filter";
import { PersonForm } from "./PersonForm.jsx";
import { Persons } from "./Persons.jsx";
import { create, getAll, remove, update } from "./services/persons.js";

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      getAll().then((res) => {
        setPersons(res.data);
        setLoading(false);
      });
    }, 3000);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "search") setSearch(value);
    if (name === "newName") setNewName(value);
    if (name === "newNumber") setNewNumber(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);

    if (!existingPerson) {
      const updatedPerson = { name: newName, number: newNumber };
      create(updatedPerson).then((res) => {
        setPersons([...persons, res.data.data]);
      });
    } else {
      if (
        window.confirm(
          `Do you want to update number for ${existingPerson.name}`,
        )
      ) {
        update(existingPerson.id, existingPerson, newNumber).then((res) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : res.data,
            ),
          );
        });
      }
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const filterPersons = persons.filter(
    (person) =>
      person.name && person.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Filter name={"search"} onchange={handleInputChange}></Filter>
        </div>
        <h2>Add New</h2>
        <PersonForm
          handleNameInput={handleInputChange}
          handleNumberInput={handleInputChange}
        ></PersonForm>
      </form>
      <h2>Numbers</h2>
      {loading ? (
        <>
          <p>Loading...</p>
        </>
      ) : (
        <Persons filtered={filterPersons} handleDelete={deletePerson}></Persons>
      )}
    </>
  );
}

export default App;
