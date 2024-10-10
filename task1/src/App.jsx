import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const FileUpload = () => {
  const [excelData, setExcelData] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('Drag & Drop your file here or click to upload');
  const [totalThanhTien, setTotalThanhTien] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFileUpload = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
      setExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
    alert('Uploaded to successfully')
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleTotalCalculation = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
  
    setTotalThanhTien(0);
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    let matchFound = false;
  
    excelData.slice(5).forEach((item) => {
      const cols = Object.values(item);
  
      const [day, month, year] = cols[1].split("/");
      const time = cols[2];
      const targetDate = new Date(`${year}-${month}-${day}T${time}`);
  
      if (targetDate >= start && targetDate <= end) {
        setTotalThanhTien((prev) => prev + Number(cols[8]));
        matchFound = true;
      }
    });
  
    if (!matchFound) {
      alert(`No data found between ${start.toLocaleString()} and ${end.toLocaleString()}.`);
    }
  };

  return (
    <div className='container'>
      <h1 style={{display: "flex",justifyContent: "center"}}>TASK 01</h1>
      <div className="upload-container">
        <input type="file" accept=".xlsx" onChange={handleInputChange} style={{ display: 'none' }} id="fileInput" />
        <label
          htmlFor="fileInput"
          className={`upload-area ${dragActive ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <h4 style={{color: 'red'}}>{fileName}</h4>
        </label>
      </div>

      <div className="date-filters">
        <div className="date-input">
          <label>
            Start Date:
          </label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>
            End Date:
          </label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className='total-price'>
          <button onClick={handleTotalCalculation}>
            Calculate
          </button>
          <h3>Total Amount: {totalThanhTien} VND</h3>
        </div>
      </div>

      <div>
        {excelData.length > 0 && (
          <table>
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default FileUpload;
