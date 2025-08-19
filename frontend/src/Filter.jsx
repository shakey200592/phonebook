export const Filter = ({ onchange, name }) => {
  return (
    <>
      Filter shown with <input name={name} onChange={onchange}></input>
    </>
  );
};
