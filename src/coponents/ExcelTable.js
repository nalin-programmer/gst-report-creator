import React, {useEffect, useState} from 'react';
import './ExcelProcessor.css';
import TableRow from "./TableRow";

function ExcelProcessor() {
    const [rows, setRows] = useState([{id: 1, visible: true}]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [finalData, setFinalData] = useState([[]]);

    const handleAddRow = () => {
        setRows([...rows, {id: Date.now(), visible: true}]);
        setFinalData([...finalData, []]);
    };

    const toggleRowVisibility = (id) => {
        setRows(
            rows.map((row) =>
                row.id === id ? {...row, visible: !row.visible} : row
            )
        );
    };

    function mergeGSTReports(data) {
        const merged = {};

        for (const entry of data.flat()) {
            const key = `${entry.state}_${entry.gst}`;
            if (!merged[key]) {
                merged[key] = {state: entry.state, gst: entry.gst, totalAmount: 0};
            }
            merged[key].totalAmount += entry.totalAmount;
        }

        return Object.values(merged)
            .map((e) => ({...e, totalAmount: +e.totalAmount.toFixed(2)}))
            .sort((a, b) => a.state.localeCompare(b.state));
    }

    function downloadGSTCsv(data) {
        const fileName = "merged_gst_report.csv"
        if (!data || data.length === 0) return;

        // 1️⃣ CSV header
        const headers = ["State", "GST", "Total Amount"];
        const csvRows = [headers.join(",")];

        // 2️⃣ Add each row
        data.forEach((row) => {
            const csvRow = [row.state, row.gst, row.totalAmount].join(",");
            csvRows.push(csvRow);
        });

        // 3️⃣ Combine rows and encode
        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
        const url = URL.createObjectURL(blob);

        // 4️⃣ Create temporary link and click
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    function handelFinalDownload() {
        downloadGSTCsv(mergeGSTReports(finalData));
    }

    useEffect(() => {
        console.log(finalData);
    }, [finalData])

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
                <span style={{fontWeight: "bold"}}>Table Rows</span>
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
                                <h4 style={{margin: 0}}>Row {index + 1}</h4>
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

                            <div style={{marginTop: "10px", display: row.visible ? "block" : "none"}}>
                                <TableRow details={finalData} setDetails={setFinalData} position={index}/>
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
            <button onClick={handelFinalDownload}
                    style={{
                        background: "#2ecc71",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        cursor: "pointer",
                        marginTop: "5px",
                    }}>
                Download Final Excel
            </button>
        </div>
    );
}

export default ExcelProcessor;
