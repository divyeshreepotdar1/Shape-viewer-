import React, { useState } from 'react'; // Importing React and useState hook for managing state
import './ToolBar.css'; // Importing the CSS for styling the Toolbar

const Toolbar = ({ onFileUpload, onClear, onSave, toggleDeleteMode, deleteMode }) => {
  const [shapeFileName, setShapeFileName] = useState(''); // State to track the name of the opened shape file

  // Function to handle file upload and set the shape file name
  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setShapeFileName(file.name); // Set the shape file name in state
      onFileUpload(event); // Call the parent component's onFileUpload handler
    }
  };

  // Trigger file input click when the "Open shape file" button is clicked
  const triggerFileInput = () => {
    document.getElementById('file-input').click(); // Programmatically trigger the file input
  };

  return (
    <div className="toolbar"> {/* Toolbar container for all the buttons */}
      <div className="app-name">ShapeViewer</div> {/* Application name */}

      {/* Conditionally render either the shape file name or "Open shape file" button */}
      {shapeFileName ? (
        <span className="file-name">{shapeFileName}</span> // Display the shape file name if a file is opened
      ) : (
        <button onClick={triggerFileInput} className="open-file-button">
          Open Shape File {/* Button to trigger file input */}
        </button>
      )}

      <input
        type="file" // File input to upload a shapefile
        id="file-input" // ID to trigger file input click programmatically
        accept=".shapefile" // Restrict input to only .shapefile type
        onChange={handleFileUpload} // Trigger file upload handler when file is selected
        className="file-input" // CSS class for styling the file input
        style={{ display: 'none' }} // Hide the file input
      />

      <button onClick={onClear}>Clear Shape</button> {/* Button to clear all shapes */}
      <button onClick={onSave}>Save As</button> {/* Button to save the shapes to a file */}

      <button
        onClick={toggleDeleteMode} // Button to toggle delete mode on/off
        style={{ backgroundColor: deleteMode ? 'red' : '' }} // Change background color when delete mode is active
      >
        Delete Shape {/* Button text changes when delete mode is toggled */}
      </button>
    </div>
  );
};

export default Toolbar; // Exporting the Toolbar component for use in other files
