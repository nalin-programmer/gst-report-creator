import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './ExcelProcessor.css';

const MONTH_OPTIONS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

function PivotTablePage() {
    const [rows, setRows] = useState([{ id: Date.now(), month: '', data: [] }]);
    const [allRowsData, setAllRowsData] = useState([]);

    const handleAddRow = () => {
        setRows((prev) => [...prev, { id: Date.now() + prev.length, month: '', data: [] }]);
    };

    const handleMonthChange = (id, month) => {
        setRows((prev) =>
            prev.map((row) => (row.id === id ? { ...row, month } : row))
        );
    };

    const handleFileUpload = (id, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = new Uint8Array(event.target.result);
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const sheetRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const parsed = sheetRows
                .slice(1)
                .filter((row) => row[0] !== undefined && row[1] !== undefined && row[2] !== undefined)
                .map((row) => ({
                    state: row[0],
                    gst: row[1],
                    monthFromFile: row[2]
                }));

            setRows((prev) =>
                prev.map((row) => (row.id === id ? { ...row, data: parsed } : row))
            );
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        const combined = rows.flatMap((row) =>
            row.data.map((entry) => [
                entry.state,
                entry.gst,
                entry.monthFromFile,
                row.month
            ])
        );
        setAllRowsData(combined);
    }, [rows]);

    const handleDisplay = () => {
        console.log('Combined pivot data:', allRowsData);
    };

    return (
        <div className="container">
            <h1>Pivot Table Upload</h1>

            {rows.map((row, index) => (
                <div
                    key={row.id}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        marginBottom: '12px',
                        padding: '12px'
                    }}
                >
                    <h4 style={{ marginTop: 0 }}>File Row {index + 1}</h4>
                    <div className="form-group">
                        <label>Month (for this upload):</label>
                        <select
                            value={row.month}
                            onChange={(e) => handleMonthChange(row.id, e.target.value)}
                        >
                            <option value="">Select Month</option>
                            {MONTH_OPTIONS.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Upload Excel File:</label>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={(e) => handleFileUpload(row.id, e.target.files?.[0])}
                        />
                    </div>
                </div>
            ))}

            <button
                onClick={handleAddRow}
                style={{
                    background: '#2ecc71',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    marginRight: '8px'
                }}
            >
                Add Row
            </button>

            <button
                onClick={handleDisplay}
                style={{
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    cursor: 'pointer'
                }}
            >
                Display
            </button>
        </div>
    );
}

export default PivotTablePage;
