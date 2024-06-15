import React, { useState } from 'react';
import axios from 'axios';
import menuData from './data/menuData.ts'; // Assuming you have the initial data stored in a JSON file

function EditableMenu() {
  const [menu, setMenu] = useState(menuData);
  const [newItem, setNewItem] = useState({ category: "", name: "", description: "", price: "" });

  const addItem = () => {
    if (newItem.category && newItem.name && newItem.description && newItem.price) {
      const newMenu = { ...menu };

      // Check if the category exists in the menu; if not, initialize it as an empty array
      if (!newMenu[newItem.category]) {
        newMenu[newItem.category] = [];
      }

      newMenu[newItem.category] = [
        ...newMenu[newItem.category],
        {
          id: newMenu[newItem.category].length + 1,
          name: newItem.name,
          description: newItem.description,
          price: newItem.price
        }
      ];

      setMenu(newMenu);
      setNewItem({ category: "", name: "", description: "", price: "" });
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prevNewItem => ({
      ...prevNewItem,
      [field]: value
    }));
  };

  const saveMenu = () => {
    axios.post('http://185.128.40.41:3001/save-menu', menu) // Assuming backend is running on localhost port 3001
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error saving menu:", error);
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Menu</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Category" 
          value={newItem.category} 
          onChange={(e) => handleNewItemChange("category", e.target.value)} 
          style={{ flex: 1, marginRight: '10px', padding: '8px' }} 
        />
        <input 
          type="text" 
          placeholder="Name" 
          value={newItem.name} 
          onChange={(e) => handleNewItemChange("name", e.target.value)} 
          style={{ flex: 1, marginRight: '10px', padding: '8px' }} 
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={newItem.description} 
          onChange={(e) => handleNewItemChange("description", e.target.value)} 
          style={{ flex: 1, marginRight: '10px', padding: '8px' }} 
        />
        <input 
          type="text" 
          placeholder="Price" 
          value={newItem.price} 
          onChange={(e) => handleNewItemChange("price", e.target.value)} 
          style={{ flex: 1, marginRight: '10px', padding: '8px' }} 
        />
        <button onClick={addItem} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>Add Item</button>
        <button onClick={saveMenu} style={{ padding: '8px 16px', backgroundColor: '#008CBA', color: 'white', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>Save Menu</button>
      </div>
      {Object.keys(menu).map(category => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>{category}</h2>
          <ul>
            {menu[category].map(item => (
              <li key={item.id}>
                <strong>{item.name}</strong> - {item.description} - {item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default EditableMenu;
