// src/components/AddMenuItem.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const AddMenuItem = ({ addMenuItem }) => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(), // simple unique id generator
      name,
      description,
      price,
      pictureUrl,
    };
    addMenuItem(category, newItem);
    setCategory('');
    setName('');
    setDescription('');
    setPrice('');
    setPictureUrl('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Price</Form.Label>
        <Form.Control type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Picture URL</Form.Label>
        <Form.Control type="text" value={pictureUrl} onChange={(e) => setPictureUrl(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Add Item
      </Button>
    </Form>
  );
};

export default AddMenuItem;
