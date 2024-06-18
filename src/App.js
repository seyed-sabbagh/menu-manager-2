import React, { useState } from 'react';
import axios from 'axios';
import './EditableMenu.css'; // Import CSS file for styling
// Importing menuData directly
const menuData = require('./data/menuData.ts');

const categoriesList = Object.keys(menuData); // Extracting categories from menuData keys

function EditableMenu() {
  const [menu, setMenu] = useState(menuData);
  const [newItem, setNewItem] = useState({ category: "", name: "", description: "", price: "" });
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ id: null, category: "", name: "", description: "", price: "" });

  const addItem = () => {
    if (newItem.category && newItem.name && newItem.description && newItem.price) {
      const newMenu = { ...menu };

      if (!newMenu[newItem.category]) {
        newMenu[newItem.category] = [];
      }

      newMenu[newItem.category] = [
        ...newMenu[newItem.category],
        {
          id: generateUniqueId(),
          name: newItem.name,
          description: newItem.description,
          price: newItem.price
        }
      ];

      setMenu(newMenu);
      setNewItem({ category: "", name: "", description: "", price: "" });
    } else {
      alert("لطفا تمامی فیلدها را پر کنید.");
    }
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prevNewItem => ({
      ...prevNewItem,
      [field]: value
    }));
  };

  const saveMenu = () => {
    axios.post('http://185.128.40.41:3001/save-menu', menu)
      .then((response) => {
        console.log(response.data);
        alert("منو با موفقیت ذخیره شد!");
      })
      .catch((error) => {
        console.error("خطا در ذخیره سازی منو:", error);
        alert("خطا در ذخیره سازی منو. لطفا دوباره تلاش کنید.");
      });
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleEdit = (categoryId, itemId) => {
    const itemToEdit = menu[categoryId].find(item => item.id === itemId);
    if (itemToEdit) {
      setEditedItem({
        id: itemToEdit.id,
        category: categoryId,
        name: itemToEdit.name,
        description: itemToEdit.description,
        price: itemToEdit.price
      });
      setEditItemId(itemId);
    } else {
      console.error(`Item with ID ${itemId} not found in category ${categoryId}`);
    }
  };

  const saveEditedItem = () => {
    if (!editedItem.category) {
      console.error("Category is undefined in editedItem.");
      return;
    }

    const updatedMenu = { ...menu };
    const category = editedItem.category;

    if (updatedMenu.hasOwnProperty(category)) {
      const updatedItems = updatedMenu[category].map(item =>
        item.id === editedItem.id ? { ...item, name: editedItem.name, description: editedItem.description, price: editedItem.price } : item
      );
      updatedMenu[category] = updatedItems;
      setMenu(updatedMenu);
      setEditItemId(null);
    } else {
      console.error(`Category '${category}' does not exist in the menu.`);
      // Handle the error or notify the user appropriately
    }
  };

  const cancelEdit = () => {
    setEditItemId(null);
    setEditedItem({ id: null, category: "", name: "", description: "", price: "" });
  };

  const removeItem = (categoryId, itemId) => {
    const updatedMenu = { ...menu };
    updatedMenu[categoryId] = updatedMenu[categoryId].filter(item => item.id !== itemId);
    setMenu(updatedMenu);
  };

  return (
    <div className="editable-menu-container">
      <h1 className="editable-menu-heading">ویرایش منو</h1>
      <div className="menu-form">
        <select
          value={newItem.category}
          onChange={(e) => handleNewItemChange("category", e.target.value)}
          className="input-field"
        >
          <option value="">انتخاب دسته بندی</option>
          {categoriesList.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
                  <input
            type="text"
            placeholder="نام"
            value={newItem.name}
            onChange={(e) => handleNewItemChange("name", e.target.value)}
            className="input-field"
          />

        <input
          type="text"
          placeholder="توضیحات"
          value={newItem.description}
          onChange={(e) => handleNewItemChange("description", e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="قیمت"
          value={newItem.price}
          onChange={(e) => handleNewItemChange("price", e.target.value)}
          className="input-field"
        />
        <button onClick={addItem} className="add-item-button">افزودن آیتم</button>
        <button onClick={saveMenu} className="save-menu-button">ذخیره منو</button>
      </div>
      <div className="menu-list">
        {Object.keys(menu).map(category => (
          <div key={category} className="category-container">
            <h2 className="category-heading">{category}</h2>
            <table className="items-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>توضیحات</th>
                  <th>قیمت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {menu[category].map(item => (
                  <tr key={item.id}>
                    <td>{editItemId === item.id ? (
                      <input
                        type="text"
                        value={editedItem.name}
                        onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                      />
                    ) : item.name}</td>
                    <td>{editItemId === item.id ? (
                      <input
                        type="text"
                        value={editedItem.description}
                        onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                      />
                    ) : item.description}</td>
                    <td>{editItemId === item.id ? (
                      <input
                        type="text"
                        value={editedItem.price}
                        onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                      />
                    ) : item.price}</td>
                    <td>
                      {editItemId === item.id ? (
                        <>
                          <button onClick={saveEditedItem} className="save-button">ذخیره</button>
                          <button onClick={cancelEdit} className="cancel-button">لغو</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(category, item.id)} className="edit-button">ویرایش</button>
                          <button onClick={() => removeItem(category, item.id)} className="delete-button">حذف</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditableMenu;
