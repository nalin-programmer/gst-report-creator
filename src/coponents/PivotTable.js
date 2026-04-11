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

const MONTH_ORDER = MONTH_OPTIONS.reduce((acc, month, index) => {
    acc[month] = index;
    return acc;
}, {});

function PivotTablePage() {
    const [rows, setRows] = useState([{ id: Date.now(), month: '', data: [] }]);
    const [allRowsData, setAllRowsData] = useState([]);
    const toNumberOrZero = (value) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    };
    const calculateTaxableValue = (price, gst) => {
        const denominator = 100 + gst;
        if (denominator === 0) return 0;
        return Math.round(((price * 100) / denominator) * 100) / 100;
    };

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
                    price: row[2]
                }));

            setRows((prev) =>
                prev.map((row) => (row.id === id ? { ...row, data: parsed } : row))
            );
        };

        reader.readAsArrayBuffer(file);
    };

    useEffect(() => {
        const combined = rows.flatMap((row) =>
            row.data
                .filter((entry) => row.month)
                .map((entry) => ({
                    state: String(entry.state).trim(),
                    month: row.month,
                    gst: toNumberOrZero(entry.gst),
                    price: toNumberOrZero(entry.price)
                }))
        );
        setAllRowsData(combined);
    }, [rows]);

    const handleDownload = () => {
        const sortedRows = [...allRowsData].sort((a, b) => {
            const stateCompare = a.state.localeCompare(b.state);
            if (stateCompare !== 0) return stateCompare;

            const monthCompare = (MONTH_ORDER[a.month] ?? 999) - (MONTH_ORDER[b.month] ?? 999);
            if (monthCompare !== 0) return monthCompare;

            return a.gst - b.gst;
        });

        const exportRows = sortedRows.map((entry) => ({
            State: entry.state,
            Month: entry.month,
            'GST %': entry.gst,
            Total: entry.price,
            'Taxable Value': calculateTaxableValue(entry.price, entry.gst)
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pivot Table');
        XLSX.writeFile(workbook, 'pivot_table_report.xlsx');
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
                onClick={handleDownload}
                style={{
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    cursor: 'pointer'
                }}
            >
                Download Excel
            </button>
        </div>
    );
}

export default PivotTablePage;
