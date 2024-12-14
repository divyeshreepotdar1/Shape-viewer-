import React, { useState } from 'react';
import './LeftMenu.css';

const LeftMenu = ({ addShape }) => {
  // State to track the shape type, color, size, and position
  const [shapeType, setShapeType] = useState(''); // Shape type (Rectangle, Circle, Triangle)
  const [shapeColor, setShapeColor] = useState('#000000'); // Shape color
  const [shapeSize1, setShapeSize1] = useState(50); // Width for Rectangle and Base for Triangle
  const [shapeSize2, setShapeSize2] = useState(50); // Height for Rectangle and Triangle
  const [shapePosition, setShapePosition] = useState({ x: 0, y: 0 }); // Position of the shape (X, Y)

  // Handler functions for updating state based on user input
  const handleShapeTypeChange = (event) => setShapeType(event.target.value); // Shape type selection
  const handleShapeColorChange = (event) => setShapeColor(event.target.value); // Shape color selection
  const handleShapeSize1Change = (event) => setShapeSize1(event.target.value); // Size 1 input (width/base)
  const handleShapeSize2Change = (event) => setShapeSize2(event.target.value); // Size 2 input (height)
  const handleShapePositionChange = (axis, value) => setShapePosition({ ...shapePosition, [axis]: value }); // Position update

  // Form submit handler to create a new shape and pass it to the parent component
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload on form submit

    let shapeDetails;

    // Shape creation based on the selected type
    if (shapeType === 'Triangle') {
      // For Triangle, calculate the vertices
      const vertices = [
        { x: parseInt(shapePosition.x, 10), y: parseInt(shapePosition.y, 10) },
        { x: parseInt(shapePosition.x, 10) + parseInt(shapeSize1, 10), y: parseInt(shapePosition.y, 10) },
        { x: parseInt(shapePosition.x, 10) + parseInt(shapeSize1, 10) / 2, y: parseInt(shapePosition.y, 10) - parseInt(shapeSize2, 10) },
      ];

      shapeDetails = {
        type: shapeType, // Shape type
        x: shapePosition.x, // X position
        y: shapePosition.y, // Y position
        color: shapeColor, // Color
        vertices, // Triangle vertices
      };
    } else if (shapeType === 'Circle') {
      // For Circle, set the center (cx, cy) and radius
      shapeDetails = {
        type: shapeType,
        cx: shapePosition.x,
        cy: shapePosition.y,
        radius: shapeSize1 / 2, // Radius is half of the width (size1)
        color: shapeColor,
      };
    } else {
      // For Rectangle (default case), set the position and size
      shapeDetails = {
        type: shapeType,
        x: shapePosition.x,
        y: shapePosition.y,
        size1: shapeSize1, // Width
        size2: shapeSize2, // Height
        color: shapeColor,
      };
    }

    // Pass the created shape details to the parent component (addShape function)
    addShape(shapeDetails);
    console.log('Shape Created:', shapeDetails); // Log the shape for debugging purposes
  };

  return (
    <div className="left-menu">
      <h2>Create Shape</h2>
      <form onSubmit={handleSubmit}>
        {/* Shape type selection dropdown */}
        <label htmlFor="shapeType">Shape Type</label>
        <select id="shapeType" value={shapeType} onChange={handleShapeTypeChange}>
          <option value="">Select Shape</option>
          <option value="Rectangle">Rectangle</option>
          <option value="Circle">Circle</option>
          <option value="Triangle">Triangle</option>
        </select>

        {/* Shape color picker */}
        <label htmlFor="shapeColor">Shape Color</label>
        <input type="color" id="shapeColor" value={shapeColor} onChange={handleShapeColorChange} />

        {/* Shape size input (Width or Base for Triangle) */}
        <label htmlFor="shapeSize1">Width (or Base for Triangle)</label>
        <input type="number" id="shapeSize1" value={shapeSize1} onChange={handleShapeSize1Change} />

        {/* Conditionally render height input for Triangle */}
        {shapeType === 'Triangle' && (
          <>
            <label htmlFor="shapeSize2">Height</label>
            <input type="number" id="shapeSize2" value={shapeSize2} onChange={handleShapeSize2Change} />
          </>
        )}

        {/* Position X input */}
        <label htmlFor="shapePositionX">Position X</label>
        <input
          type="number"
          id="shapePositionX"
          value={shapePosition.x}
          onChange={(e) => handleShapePositionChange('x', e.target.value)}
        />

        {/* Position Y input */}
        <label htmlFor="shapePositionY">Position Y</label>
        <input
          type="number"
          id="shapePositionY"
          value={shapePosition.y}
          onChange={(e) => handleShapePositionChange('y', e.target.value)}
        />

        {/* Submit button to create the shape */}
        <button type="submit">Create Shape</button>
      </form>
    </div>
  );
};

export default LeftMenu;
