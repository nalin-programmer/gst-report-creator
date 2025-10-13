import React, {useState} from 'react';
import './ExcelProcessor.css';
import TableRow from "./TableRow";

function ExcelProcessor() {
  const [rows, setRows] = useState([{ id: 1, visible: true }]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), visible: true }]);
  };

  const toggleRowVisibility = (id) => {
    setRows(
        rows.map((row) =>
            row.id === id ? { ...row, visible: !row.visible } : row
        )
    );
  };

  return (
      <div className="container">
        <h1>GST Report Generator</h1>
        <div
            className="collapsible-header"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              cursor: "pointer",
              background: "#f0f0f0",
              padding: "10px",
              borderRadius: "6px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
        >
          <span style={{ fontWeight: "bold" }}>Table Rows</span>
          <span>{isCollapsed ? "▼" : "▲"}</span>
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
            <div
                className="table-list"
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                }}
            >
              {rows.map((row, index) => (
                  <div
                      key={row.id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        marginBottom: "10px",
                        padding: "10px",
                      }}
                  >
                    <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                    >
                      <h4 style={{ margin: 0 }}>Row {index + 1}</h4>
                      <button
                          onClick={() => toggleRowVisibility(row.id)}
                          style={{
                            background: row.visible ? "#e74c3c" : "#2ecc71",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            cursor: "pointer",
                          }}
                      >
                        {row.visible ? "−" : "+"}
                      </button>
                    </div>

                      <div style={{ marginTop: "10px", display: row.visible ? "block" : "none" }}>
                          <TableRow />
                      </div>
                  </div>
              ))}

              <button
                  onClick={handleAddRow}
                  style={{
                    background: "#2ecc71",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    marginTop: "5px",
                  }}
              >
                Add Row
              </button>
            </div>
        )}
      </div>
  );
}

export default ExcelProcessor;
