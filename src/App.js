import React, { useState } from 'react';
import axios from 'axios';
import menuData from './data/menuData.ts'; // Assuming you have the initial data stored in a JSON file

const categoriesList = ["pizza", "fried", "hot_dog", "feed", "burgers","sandwiches","snacks","salad","persian_food","pish_ghaza","seafood","Customـfood","Lunchـdinner","sini_majlesi","day_food","cofee","icecream","koktel","damnosh","shake","smothi","majon","cold_bar","glasse","hot_bar"]; // Example list of categories

function EditableMenu() {
  const [menu, setMenu] = useState(menuData);
  const [newItem, setNewItem] = useState({ category: "", name: "", description: "", price: "" });

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

  return (
    <div style={{ fontFamily: 'IRANSans, Arial, sans-serif', maxWidth: '800px', margin: 'auto', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '32px', color: '#333' }}>ویرایش منو</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', gap: '10px', alignItems: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <select
          value={newItem.category}
          onChange={(e) => handleNewItemChange("category", e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', textAlign: 'right' }}
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
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', textAlign: 'right' }}
        />
        <input
          type="text"
          placeholder="توضیحات"
          value={newItem.description}
          onChange={(e) => handleNewItemChange("description", e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', textAlign: 'right' }}
        />
        <input
          type="text"
          placeholder="قیمت"
          value={newItem.price}
          onChange={(e) => handleNewItemChange("price", e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', textAlign: 'right' }}
        />
        <button onClick={addItem} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>افزودن آیتم</button>
        <button onClick={saveMenu} style={{ padding: '8px 16px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>ذخیره منو</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        {Object.keys(menu).map(category => (
          <div key={category} style={{ marginBottom: '20px', borderRadius: '4px', backgroundColor: '#fff', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px', fontSize: '18px', color: '#333', textAlign: 'right' }}>{category}</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '8px 0' }}>نام</th>
                  <th style={{ padding: '8px 0' }}>توضیحات</th>
                  <th style={{ padding: '8px 0' }}>قیمت</th>
                </tr>
              </thead>
              <tbody>
                {menu[category].map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0' }}>{item.name}</td>
                    <td style={{ padding: '8px 0' }}>{item.description}</td>
                    <td style={{ padding: '8px 0' }}>{item.price}</td>
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
