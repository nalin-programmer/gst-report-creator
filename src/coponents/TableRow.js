import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './ExcelProcessor.css';

const formatStateName = (state) => {
    return state.toUpperCase() === "JAMMU & KASHMIR" ? "JAMMU AND KASHMIR" : state.toUpperCase();
};

function TableRow({details, setDetails, position}) {
    const [outputCSV, setOutputCSV] = useState('');
    const [company, setCompany] = useState('Default');
    const [totalAmount, setTotalAmount] = useState(0);
    const [display, setDisplay] = useState([]);
    const [fileName, setFileName] = useState('');

    const processExcelData = (data) => {
        let columns=[1,2,3];
        let total = 0;
        let displayTable = []

        if (company === 'Meesho') {
            columns = [12, 7, 8]; // Assuming state, gst, amount are the first three columns
        } else if (company === 'Default') {
            columns = [0, 1, 2];
        }else if (company === 'Reverse') {
            columns = [12, 7, 8];
        }else if (company === 'Flipkart'){
            columns = [49,30,34,32,23]
        }else if (company === 'Cashback'){
            columns = [24,11,13,15,8]
        }else if(company === 'City Mall'){
            columns = [12,27,25]
        }else if(company === 'JioMart'){
            columns = [27,36,35]
        }else if(company === 'Glowroad'){
            columns = [18,20,21]
        }

        const aggregatedData = {};
        data.slice(1).forEach(row => {
            let state =row[columns[0]], gst=parseInt(row[columns[1]]), amount=row[columns[2]];
            if(company === 'Flipkart'||company === 'Cashback' ){
                gst=parseInt(row[columns[1]])+parseInt(row[columns[2]])+parseInt(row[columns[3]])
                amount=amount=parseFloat(row[columns[4]])
            }
            if (!aggregatedData[state]) {
                aggregatedData[state] = {};
            }
            if (!aggregatedData[state][gst]) {
                aggregatedData[state][gst] = 0;
            }
            if(company === 'Reverse'){
                aggregatedData[state][gst] += parseFloat(amount)*-1;
                total+=parseFloat(amount)*-1;
            }else{
                aggregatedData[state][gst] += parseFloat(amount);
                total+=parseFloat(amount);
            }


        });

        setTotalAmount(total);
        let csvContent = "State,GST,Total Amount\n";
        let globalContent = [];
        for (const state in aggregatedData) {
            for (const gst in aggregatedData[state]) {
                if (state === "state") continue;
                const totalAmount = aggregatedData[state][gst];
                csvContent += `${formatStateName(state.toUpperCase())},${gst},${totalAmount}\n`;
                displayTable.push([state.toUpperCase(),gst,totalAmount]);
                globalContent.push({
                    state: formatStateName(state.toUpperCase()),
                    gst: gst,
                    totalAmount: totalAmount
                });
            }
        }
        setDisplay(displayTable);
        let newDetails = details;
        newDetails[position] = globalContent;
        setDetails(newDetails);
        return csvContent;
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFileName(file.name.split('.').slice(0, -1).join('.'));
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName =(company==="Flipkart")?workbook.SheetNames[1]: (company==="Cashback")?workbook.SheetNames[2]:workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const tableData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const csvContent = processExcelData(tableData);
            setOutputCSV(csvContent);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="container">
            <div className="form-group">
                <label htmlFor="company-select">Select Company:</label>
                <select
                    id="company-select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                >
                    <option value="Default">Default</option>
                    <option value="Meesho">Meesho</option>
                    <option value="Reverse">Meesho Reverse</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Cashback">Flipkart Cashback</option>
                    <option value="City Mall">City Mall</option>
                    <option value="JioMart">JioMart</option>
                    <option value="Glowroad">Glowroad</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="file-upload">Upload Excel File:</label>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                />
            </div>
            {outputCSV && (
                <div className="output-section">
                    <h3>Aggregated Data</h3>
                    {/* <textarea rows="10" cols="50" value={outputCSV} readOnly /><br/> */}
                    <table>
                        <thead>
                        <tr>
                            <th>State</th>
                            <th>GST</th>
                            <th>Total Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {display.map((row) => (
                            <tr >
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[2]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <table>

                    </table>
                    {totalAmount !== 0 && (
                        <div className="total-amount">
                            <h3>Total Amount: {totalAmount.toFixed(2)}</h3>
                        </div>
                    )}<br/>
                    <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(outputCSV)}`} download={`${fileName}_gst.csv`}>Download CSV</a>
                </div>
            )}

        </div>
    );
}

export default TableRow;
