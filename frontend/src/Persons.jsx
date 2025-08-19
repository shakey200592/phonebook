export const Persons = ({ filtered, handleDelete }) => {
  return (
    <>
      {filtered.map((person, index) => (
        <div key={index}>
          <p>
            {person.name}: {person.number}{" "}
            <button onClick={() => handleDelete(person.id, person.name)}>
              Delete
            </button>
          </p>
        </div>
      ))}
    </>
  );
};
