// src/App.tsx
import React, { useState } from "react";
import JsonView from "./JsonView";
import "./App.css";

function App() {
  const [inputVal, setInputVal] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>(null);

  const [filter, setFilter] = useState<string>("");

  const handleDecode = () => {
    try {
      const jsonString = atob(inputVal);
      setJsonOutput(JSON.parse(jsonString));
    } catch {
      alert("Invalid base64 or JSON.");
    }
  };

  const handleEncodeToClipboard = () => {
    try {
      const jsonString = JSON.stringify(jsonOutput);
      const base64 = btoa(jsonString);
      navigator.clipboard.writeText(base64);
      alert("Encoded JSON copied to clipboard.");
    } catch {
      alert("Failed to encode JSON.");
    }
  };

  let filterRegex: RegExp | undefined;
  try {
    filterRegex = new RegExp(filter, "i"); // case-insensitive search
  } catch {
    // Invalid regex; keep it as undefined
  }

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Filter fields (regex allowed)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <textarea
        style={{ width: "100%", height: "100px" }}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      ></textarea>
      <button onClick={handleDecode}>Decode</button>
      <button onClick={handleEncodeToClipboard}>Encode & Export</button>
      {jsonOutput && (
        <div className="json-container">
          <JsonView
            data={jsonOutput}
            onChange={(updatedData) => setJsonOutput(updatedData)}
            filterRegex={filterRegex}
            setFilter={setFilter}
          />
        </div>
      )}
    </div>
  );
}

export default App;
