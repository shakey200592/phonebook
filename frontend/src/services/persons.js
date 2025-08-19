import axios from "axios";

const baseUrl = "http://localhost:5000/api/persons";

export const getAll = () => {
  return axios.get(baseUrl);
};

export const create = (newPerson) => {
  return axios.post(baseUrl, newPerson);
};

export const update = (id, person, newNumber) => {
  return axios.put(`${baseUrl}/${id}`, {
    ...person,
    number: newNumber,
  });
};

export const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};
