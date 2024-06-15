// MenuSection.js
import React from 'react';
import MenuItem from './MenuItem';

const MenuSection = ({ section, items, onEditItem }) => {
  return (
    <div>
      <h2>{section}</h2>
      {items.map(item => (
        <MenuItem key={item.id} item={item} onEdit={newData => onEditItem(section, item.id, newData)} />
      ))}
    </div>
  );
};

export default MenuSection;
