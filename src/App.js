import React, { useState } from 'react';
import axios from 'axios';
import './EditableMenu.css'; // Import CSS file for styling
import config from './config.js'; // Import configuration file

const menuData = require('/Users/fapna/restaurant-manager/menu-manager-2/src/data/menuData.ts'); // Assuming menuData.ts contains initial menu data

const categoriesList = Object.keys(menuData); // Extracting categories from menuData keys

const EditableMenu = () => {
  const [menu, setMenu] = useState(menuData);
  const [newItem, setNewItem] = useState({ category: "", name: "", description: "", price: "", pictureUrl: "" });
  const [editItemId, setEditItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({ id: null, category: "", name: "", description: "", price: "", pictureUrl: "" });
  const [editItemPictureUrl, setEditItemPictureUrl] = useState("");
  const [editedItemImage, setEditedItemImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false); // State for image upload loading indicator
  const [savingMenu, setSavingMenu] = useState(false); // State for saving menu loading indicator
  const [step, setStep] = useState(1); // Step state for the multi-step process

  const addItem = () => {
    if (newItem.category && newItem.name && newItem.description && newItem.price && newItem.pictureUrl) {
      const newMenu = { ...menu };

      if (!newMenu[newItem.category]) {
        newMenu[newItem.category] = [];
      }

      const newItemObject = {
        id: generateUniqueId(),
        name: newItem.name,
        description: newItem.description,
        pictureUrl: newItem.pictureUrl, // Save the picture URL provided by the user
        price: newItem.price
      };

      newMenu[newItem.category] = [
        ...newMenu[newItem.category],
        newItemObject
      ];

      setMenu(newMenu);
      setNewItem({ category: "", name: "", description: "", price: "", pictureUrl: "" });
      setSelectedFile(null);
      setStep(1); // Reset to step 1
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleNewItemChange = (field, value) => {
    setNewItem(prevNewItem => ({
      ...prevNewItem,
      [field]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 100 * 1024) { // Check if the file size exceeds 150KB
      alert("Selected file size exceeds 100KB. Please choose another file.");
      setSelectedFile(null); // Reset the selected file
      return;
    }
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }
  
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    axios.post(`${config.apiBaseUrl}${config.uploadEndpoint}`, formData)
      .then((response) => {
        // Extracting the file name from the URL
        const pictureUrl = response.data.url.split('/').pop();
        setNewItem(prevNewItem => ({ ...prevNewItem, pictureUrl }));
        alert("Image uploaded successfully!");
        nextStep(); // Move to the next step after image upload
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      })
      .finally(() => {
        setUploading(false);
      });
  };
  
  const saveMenu = () => {
    setSavingMenu(true); // Start saving menu indicator

    axios.post(`${config.apiBaseUrl}${config.saveMenuEndpoint}`, menu)
      .then((response) => {
        console.log(response.data);
        alert("Menu saved successfully!");
      })
      .catch((error) => {
        console.error("Error saving menu:", error);
        alert("Error saving menu. Please try again.");
      })
      .finally(() => {
        setSavingMenu(false); // Stop saving menu indicator
      });
  };

  const handleEdit = (categoryId, itemId) => {
    const itemToEdit = menu[categoryId].find(item => item.id === itemId);
    if (itemToEdit) {
      setEditedItem({
        id: itemToEdit.id,
        category: categoryId,
        name: itemToEdit.name,
        description: itemToEdit.description,
        price: itemToEdit.price,
        pictureUrl: itemToEdit.pictureUrl
      });
      setEditItemPictureUrl(itemToEdit.pictureUrl); // Set initial picture URL for editing
      setEditItemId(itemId);
    } else {
      console.error(`Item with ID ${itemId} not found in category ${categoryId}`);
    }
  };

  const handleEditItemImageChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 150 * 1024) { // Check if the file size exceeds 150KB
      alert("Selected file size exceeds 150KB. Please choose another file.");
      setEditedItemImage(null); // Reset the selected file
      return;
    }
    setEditedItemImage(file);
  };

  const handleUploadEditedItemImage = () => {
    if (!editedItemImage) {
      alert("Please select a new image.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', editedItemImage);

    axios.post(`${config.apiBaseUrl}${config.uploadEndpoint}`, formData)
      .then((response) => {
        // Extracting the file name from the URL
        const pictureUrl = response.data.url.split('/').pop();
        setEditItemPictureUrl(pictureUrl);
        alert("New image uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
      })
      .finally(() => {
        setUploading(false);
      });
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
        item.id === editedItem.id ? { ...item, name: editedItem.name, description: editedItem.description, price: editedItem.price, pictureUrl: editItemPictureUrl } : item
      );
      updatedMenu[category] = updatedItems;
      setMenu(updatedMenu);
      setEditItemId(null);
    } else {
      console.error(`Category '${category}' does not exist in the menu.`);
    }
  };

  const cancelEdit = () => {
    setEditItemId(null);
    setEditedItem({ id: null, category: "", name: "", description: "", price: "", pictureUrl: "" });
  };

  const removeItem = (categoryId, itemId) => {
    const updatedMenu = { ...menu };
    updatedMenu[categoryId] = updatedMenu[categoryId].filter(item => item.id !== itemId);
    setMenu(updatedMenu);
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(prevStep => prevStep + 1);
    } else {
      addItem(); // If already on step 3, proceed to add item
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prevStep => prevStep - 1);
    }
  };

  return (
    <div className="editable-menu-container">
      <h1 className="editable-menu-heading">اضافه کردن آیتم</h1>
      {step === 1 && (
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
          <button onClick={nextStep} className="next-button">مرحله بعد</button>
        </div>
      )}
      {step === 2 && (
        <div className="menu-form">
          <label className="custom-file-upload">
          <input
            type="file"
            onChange={handleFileChange}
            className="input-field"
          />
          <i className="fa fa-cloud-upload"></i> برای انتخاب عکس کلیک کنید
        </label>
        {selectedFile && (
             <div className="file-preview">
               <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="preview-image" />
             </div>
           )}

          
          <button onClick={handleFileUpload} className="upload-button" disabled={uploading}>
            {uploading ? <div className="loading-spinner"></div> : 'ارسال عکس به سرور و رفتن به مرحله بعدی'}
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="menu-form">
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
            type="number"
            placeholder="قیمت"
            value={newItem.price}
            onChange={(e) => handleNewItemChange("price", e.target.value)}
            className="input-field"
          />
          <button onClick={addItem} className="add-button" disabled={uploading}>
            {savingMenu ? <div className="loading-spinner"></div> : 'افزودن غذا به لیست به صورت موقت'}
          </button>
        </div>
      )}
{/* Save menu button */}
<button onClick={saveMenu} className="save-button" disabled={savingMenu}>
        {savingMenu ? <div className="loading-spinner"></div> : 'ذخیره منو به صورت دائم'}
      </button>
      {/* Render menu items */}
      <div className="menu-list">
        {Object.keys(menu).map((category, index) => (
          <div key={index}>
            <h2 className="category-heading">{category}</h2>
            <table>
              <thead>
                <tr>
                  <th>تصویر</th>
                  <th>نام</th>
                  <th>توضیحات</th>
                  <th>قیمت</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {menu[category].map((item, itemIndex) => (
                  <tr key={item.id}>
                    <td>
                      {editItemId === item.id ? (
                        <label className="custom-file-upload">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="input-field"
                        />
                        <i className="fa fa-cloud-upload"></i> برای انتخاب عکس جدید کلیک کنید
                      </label>
                      ) : (
                        <img
                          src={`${config.apiBaseUrl}${config.uploaddir}${item.pictureUrl}`}
                          alt={item.name}
                          className="item-image"
                        />
                      )}
                    </td>
                    <td>
                      {editItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItem.name}
                          onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                          className="input-field"
                        />
                      ) : (
                        item.name
                      )}
                    </td>
                    <td>
                      {editItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItem.description}
                          onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                          className="input-field"
                        />
                      ) : (
                        item.description
                      )}
                    </td>
                    <td>
                      {editItemId === item.id ? (
                        <input
                          type="text"
                          value={editedItem.price}
                          onChange={(e) => setEditedItem({ ...editedItem, price: e.target.value })}
                          className="input-field"
                        />
                      ) : (
                        item.price
                      )}
                    </td>
                    <td>
                      {editItemId === item.id ? (
                        <>
                          <button onClick={saveEditedItem} className="save-button">ذخیره</button>
                          <button onClick={cancelEdit} className="cancel-button">لغو</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(category, item.id)} className="edit-button">ویرایش</button>
                          <button onClick={() => removeItem(category, item.id)} className="remove-button">حذف</button>
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
};

export default EditableMenu;
