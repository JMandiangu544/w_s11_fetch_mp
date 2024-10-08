import React, { useState, useEffect } from 'react';

// Initial form state
const initialForm = { name: '', breed: '', adopted: false };

export default function DogForm({ dogToEdit }) {
  const [values, setValues] = useState(initialForm);
  const [breeds, setBreeds] = useState([]);

  // Fetch breeds for dropdown
  const fetchBreeds = async () => {
    const response = await fetch('http://localhost:3003/api/dogs/breeds');
    const data = await response.json();
    setBreeds(data);
  };

  const fetchDog = async (id) => {
    const response = await fetch(`http://localhost:3003/api/dogs/${id}`);
    const data = await response.json();
    setValues(data);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (dogToEdit) {
      // PUT request if editing an existing dog
      await fetch(`http://localhost:3003/api/dogs/${dogToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    } else {
      // POST request for new dog
      await fetch('http://localhost:3003/api/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
    }
    // Reset form after submission (you can handle this differently as needed)
    setValues(initialForm);
  };

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect(() => {
    fetchBreeds();
    if (dogToEdit) fetchDog(dogToEdit.id);
  }, [dogToEdit]);

  return (
    <div>
      <h2>{dogToEdit ? 'Edit Dog' : 'Create Dog'}</h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Name"
          aria-label="Dog's name"
        />
        <select
          name="breed"
          value={values.breed}
          onChange={onChange}
          aria-label="Dog's breed"
        >
          <option value="">---Select Breed---</option>
          {breeds.map(breed => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>
        <label>
          Adopted: <input
            type="checkbox"
            name="adopted"
            checked={values.adopted}
            onChange={onChange}
            aria-label="Is the dog adopted?"
          />
        </label>
        <div>
          <button type="submit">
            {dogToEdit ? 'Update Dog' : 'Create Dog'}
          </button>
          <button type="button" onClick={() => setValues(initialForm)} aria-label="Reset form">Reset</button>
        </div>
      </form>
    </div>
  );
}