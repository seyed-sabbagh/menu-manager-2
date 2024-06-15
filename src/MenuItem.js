// MenuItem.js
import React, { useState } from 'react';

const MenuItem = ({ item, onEdit }) => {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);

  const handleSave = () => {
    onEdit({ name, description, price });
  };

  return (
    <div>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
      <input type="text" value={price} onChange={e => setPrice(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default MenuItem;
