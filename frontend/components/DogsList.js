import React, { useEffect, useState } from 'react';

export default function DogsList() {
  const [dogs, setDogs] = useState([]);

  const fetchDogs = async () => {
    const response = await fetch('http://localhost:3003/api/dogs');
    const data = await response.json();
    setDogs(data);
  };

  const deleteDog = async (id) => {
    await fetch(`http://localhost:3003/api/dogs/${id}`, {
      method: 'DELETE',
    });
    fetchDogs(); // Refresh the dog list after deletion
  };

  useEffect(() => {
    fetchDogs();
  }, []);

  return (
    <div>
      <h2>Dogs Shelter</h2>
      <ul>
        {dogs.map(dog => (
          <li key={dog.id}>
            {dog.name}, {dog.breed}, {dog.adopted ? 'Adopted' : 'NOT adopted'}
            <div>
              <button>Edit</button>
              <button onClick={() => deleteDog(dog.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}