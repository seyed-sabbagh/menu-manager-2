// src/components/MenuList.js
import React from 'react';
import { Table } from 'react-bootstrap';

const MenuList = ({ menuData }) => {
  return (
    <div>
      {Object.keys(menuData).map(category => (
        <div key={category}>
          <h2>{category}</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {menuData[category].map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default MenuList;
