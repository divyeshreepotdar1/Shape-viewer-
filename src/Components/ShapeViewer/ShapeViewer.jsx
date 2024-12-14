import React, { useState } from 'react'; // Importing React and useState for component state management
import './ShapeViewer.css'; // Importing the CSS for styling the ShapeViewer component

const ShapeViewport = ({ shapes, setShapes, deleteMode }) => {
  const [draggingShapeIndex, setDraggingShapeIndex] = useState(null); // State to track the currently dragged shape index
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // State to track the mouse offset when dragging a shape

  // Function to handle mouse down event when a shape is clicked
  const handleMouseDown = (e, index) => {
    if (deleteMode) {
      // In delete mode, remove the shape from the array
      setShapes((prevShapes) => {
        const updatedShapes = prevShapes.filter((_, i) => i !== index); // Remove the shape at the clicked index
        return updatedShapes;
      });
      return;
    }

    const shape = shapes[index]; // Get the shape based on the clicked index
    let offsetX, offsetY;

    // For Triangle: Calculate the center of the triangle for drag reference
    if (shape.type === 'Triangle') {
      const centerX = (shape.vertices[0].x + shape.vertices[1].x + shape.vertices[2].x) / 3;
      const centerY = (shape.vertices[0].y + shape.vertices[1].y + shape.vertices[2].y) / 3;
      offsetX = e.clientX - centerX;
      offsetY = e.clientY - centerY;
    } else if (shape.type === 'Circle') {
      // For Circle: Get the center of the circle (cx, cy)
      offsetX = e.clientX - shape.cx;
      offsetY = e.clientY - shape.cy;
    } else if (shape.type === 'Polygon') {
      // For Polygon: Calculate the center as average of all vertices
      const centerX = shape.vertices.reduce((sum, v) => sum + v.x, 0) / shape.vertices.length;
      const centerY = shape.vertices.reduce((sum, v) => sum + v.y, 0) / shape.vertices.length;
      offsetX = e.clientX - centerX;
      offsetY = e.clientY - centerY;
    } else {
      // For other shapes (Rectangle), calculate from the top-left corner
      offsetX = e.clientX - shape.x;
      offsetY = e.clientY - shape.y;
    }

    setDragOffset({ x: offsetX, y: offsetY }); // Save the mouse offset for accurate dragging
    setDraggingShapeIndex(index); // Set the index of the shape being dragged
  };

  // Function to handle mouse move event while dragging a shape
  const handleMouseMove = (e) => {
    if (draggingShapeIndex !== null) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      setShapes((prevShapes) => {
        const updatedShapes = [...prevShapes]; // Create a copy of the shapes array
        const currentShape = updatedShapes[draggingShapeIndex]; // Get the shape being dragged

        // For Rectangle or Circle, update the position of the shape
        if (currentShape.type === 'Rectangle' || currentShape.type === 'Circle') {
          // For Circle, update the center position (cx, cy)
          if (currentShape.type === 'Circle') {
            currentShape.cx = newX;
            currentShape.cy = newY;
          } else {
            // For Rectangle, update the top-left corner (x, y)
            currentShape.x = newX;
            currentShape.y = newY;
          }
        }
        // For Triangle and Polygon, apply the same delta to all vertices
        else if (currentShape.type === 'Triangle') {
          const deltaX = newX - (currentShape.vertices[0].x + currentShape.vertices[1].x + currentShape.vertices[2].x) / 3;
          const deltaY = newY - (currentShape.vertices[0].y + currentShape.vertices[1].y + currentShape.vertices[2].y) / 3;

          currentShape.vertices = currentShape.vertices.map((vertex) => ({
            x: vertex.x + deltaX,
            y: vertex.y + deltaY,
          }));
        } else if (currentShape.type === 'Polygon') {
          const deltaX = newX - (currentShape.vertices[0].x + currentShape.vertices[1].x + currentShape.vertices[2].x) / 3;
          const deltaY = newY - (currentShape.vertices[0].y + currentShape.vertices[1].y + currentShape.vertices[2].y) / 3;

          currentShape.vertices = currentShape.vertices.map((vertex) => ({
            x: vertex.x + deltaX,
            y: vertex.y + deltaY,
          }));
        }

        return updatedShapes; // Return the updated shapes array
      });
    }
  };

  // Function to handle mouse up event when dragging ends
  const handleMouseUp = () => {
    setDraggingShapeIndex(null); // Reset the dragging state when mouse is released
  };

  return (
    <div
      className="shape-viewport"
      onMouseMove={handleMouseMove} // Attach the mouse move event for dragging
      onMouseUp={handleMouseUp} // Attach the mouse up event to stop dragging
      onMouseLeave={handleMouseUp} // Handle case when mouse leaves the viewport area
    >
      <svg width="100%" height="100%">
        {/* Render all shapes in the SVG canvas */}
        {shapes.map((shape, index) => {
          if (shape.type === 'Rectangle') {
            return (
              <rect
                key={index}
                x={shape.x}
                y={shape.y}
                width={shape.size1}
                height={shape.size2}
                fill={shape.color} // Set the rectangle color
                onMouseDown={(e) => handleMouseDown(e, index)} // Attach the mouse down event for dragging
              />
            );
          }

          if (shape.type === 'Triangle') {
            const points = shape.vertices
              .map((vertex) => `${vertex.x},${vertex.y}`)
              .join(' '); // Convert vertices to a points string for polygon
            return (
              <polygon
                key={index}
                points={points}
                fill={shape.color} // Set the triangle color
                onMouseDown={(e) => handleMouseDown(e, index)} // Attach the mouse down event for dragging
              />
            );
          }

          if (shape.type === 'Circle') {
            return (
              <circle
                key={index}
                cx={shape.cx} // Set the center x of the circle
                cy={shape.cy} // Set the center y of the circle
                r={shape.radius} // Set the radius of the circle
                fill={shape.color} // Set the circle color
                onMouseDown={(e) => handleMouseDown(e, index)} // Attach the mouse down event for dragging
              />
            );
          }

          if (shape.type === 'Polygon') {
            const points = shape.vertices
              .map((vertex) => `${vertex.x},${vertex.y}`)
              .join(' '); // Convert vertices to a points string for polygon
            return (
              <polygon
                key={index}
                points={points}
                fill={shape.color} // Set the polygon color
                onMouseDown={(e) => handleMouseDown(e, index)} // Attach the mouse down event for dragging
              />
            );
          }

          return null; // Return null if shape type is not recognized
        })}
      </svg>
    </div>
  );
};

export default ShapeViewport; // Exporting the ShapeViewport component for use in other files
