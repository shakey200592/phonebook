export const PersonForm = ({ handleNameInput, handleNumberInput }) => {
  return (
    <>
      <div>
        Name: <input name={"newName"} onChange={handleNameInput} />
      </div>
      <div>
        Number: <input name={"newNumber"} onChange={handleNumberInput} />
      </div>
      <div>
        <button type={"submit"}>Add</button>
      </div>
    </>
  );
};
