import React, { useState } from 'react'; 
import Toolbar from './Components/ToolBar/ToolBar'; // Toolbar component for file upload, clear, and save actions
import LeftMenu from './Components/LeftMenu/LeftMenu'; // LeftMenu component for adding shapes
import ShapeViewport from './Components/ShapeViewer/ShapeViewer'; // ShapeViewport component to display the shapes
import './App.css'; // Importing CSS for the app

const App = () => {
  // State to hold the list of shapes
  const [shapes, setShapes] = useState([]); 
  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState(""); 
  // State to manage whether the delete mode is active
  const [deleteMode, setDeleteMode] = useState(false); 

  // Function to add a new shape to the shapes array
  const addShape = (newShape) => {
    setShapes((prevShapes) => [...prevShapes, newShape]);
  };

  // Function to handle file upload and parse the contents of the file
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the file from the input
    if (file) {
      const reader = new FileReader(); // Create a new file reader
      reader.onload = (e) => {
        try {
          const fileContents = e.target.result; // Get the file content

          // Parsing the file content line by line
          const parsedShapes = fileContents
            .split("\n") // Split file contents by new lines
            .map((line) => line.trim()) // Trim each line
            .filter((line) => line && !line.startsWith("//")) // Remove empty lines and comments
            .map((line) => {
              // Parsing different shape types and extracting their attributes
              const [type, x, y, zIndex, ...rest] = line
                .replace(";", "") // Remove semicolons at the end
                .split(",") // Split each part by commas
                .map((value) => value.trim()); // Trim each value

              if (type === "Polygon") {
                const color = rest.pop(); // Extract color from rest of the array
                const vertices = rest.join(",").split(" ").map((pair) => {
                  const [vx, vy] = pair.split(",").map(Number); // Convert vertex values to numbers
                  return { x: vx, y: vy }; // Create an object for each vertex
                });

                return {
                  type,
                  x: parseInt(x, 10), // Convert x, y, zIndex to integers
                  y: parseInt(y, 10),
                  zIndex: parseInt(zIndex, 10),
                  vertices, // Store the vertices for Polygon
                  color: `#${color}`, // Set the color for Polygon
                };
              }

              if (["Rectangle", "Triangle"].includes(type)) {
                const [size1, size2, color] = rest; // Extract size and color for rectangle/triangle
                return {
                  type,
                  x: parseInt(x, 10),
                  y: parseInt(y, 10),
                  zIndex: parseInt(zIndex, 10),
                  size1: parseInt(size1, 10) || 50, // Default size 50 if undefined
                  size2: parseInt(size2, 10) || 50, // Default size 50 if undefined
                  color: `#${color}`, // Set color
                };
              }

              if (type === "Circle") {
                const [radius, color] = rest; // Extract radius and color for Circle
                return {
                  type,
                  x: parseInt(x, 10),
                  y: parseInt(y, 10),
                  radius: parseInt(radius, 10) || 50, // Default radius 50 if undefined
                  color: `#${color}`, // Set color
                  cx: parseInt(x, 10), // Initialize cx (center x)
                  cy: parseInt(y, 10), // Initialize cy (center y)
                };
              }

              // If an unknown shape type is encountered, throw an error
              throw new Error(`Unknown shape type: ${type}`);
            });

          setShapes(parsedShapes); // Update state with parsed shapes
          setErrorMessage(""); // Clear any previous errors
        } catch (error) {
          console.error("Error parsing file:", error.message); // Log error if parsing fails
          setErrorMessage(`Error parsing file: ${error.message}`); // Set error message to state
        }
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  // Function to clear all shapes
  const clearShapes = () => {
    setShapes([]); // Clear shapes state
    setErrorMessage(""); // Clear any error message when clearing shapes
  };

  // Function to save shapes to a file
  const saveToFile = () => {
    // Generate file content from shapes array
    const fileContent = shapes
      .map((shape) => {
        if (shape.type === "Polygon") {
          // For Polygon, format the vertices and other attributes
          const vertices = shape.vertices
            .map((v) => `${v.x},${v.y}`)
            .join(" ");
          return `${shape.type},${shape.x},${shape.y},${shape.zIndex},${vertices},${shape.color.replace(
            "#",
            ""
          )};`;
        } else if (shape.type === "Circle") {
          // For Circle, format it with the necessary attributes
          return `${shape.type},${shape.x},${shape.y},undefined,${shape.radius || 50},undefined,${shape.color.replace("#", "")};`;
        } else {
          // For other shapes like Rectangle or Triangle, format them with appropriate attributes
          return `${shape.type},${shape.x},${shape.y},${shape.zIndex},${shape.size1 || 50},${shape.size2 || 50},${shape.color.replace(
            "#",
            ""
          )};`;
        }
      })
      .join("\n"); // Join all shapes as a string with new lines

    const blob = new Blob([fileContent], { type: "text/plain" }); // Create a Blob from the file content
    const link = document.createElement("a"); // Create a download link
    link.href = URL.createObjectURL(blob); // Create a URL for the Blob
    link.download = "shapes.shapefile"; // Set the download filename
    link.click(); // Trigger the download
  };

  // Function to toggle delete mode on and off
  const toggleDeleteMode = () => {
    setDeleteMode((prevState) => !prevState); // Toggle delete mode state
  };

  return (
    <div className="app-wrapper">
      <Toolbar
        onFileUpload={handleFileUpload} // Pass the file upload handler to Toolbar
        onClear={clearShapes} // Pass the clear function to Toolbar
        onSave={saveToFile} // Pass the save function to Toolbar
        toggleDeleteMode={toggleDeleteMode} // Pass the toggleDeleteMode function to Toolbar
        deleteMode={deleteMode} // Pass the deleteMode state to Toolbar
      />
      <LeftMenu addShape={addShape} /> {/* Pass addShape function to LeftMenu */}
      <ShapeViewport 
        shapes={shapes} // Pass shapes to ShapeViewport for display
        setShapes={setShapes} // Pass setShapes to allow updates in ShapeViewport
        deleteMode={deleteMode} // Pass deleteMode to ShapeViewport for delete functionality
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display error message if there's any */}
    </div>
  );
};

export default App; // Export the App component for use in other files
