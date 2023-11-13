// pages/index.tsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ChartComponent from '../components/ChartComponent';

const Dashboard: React.FC = () => {
  const [sarifData, setSarifData] = useState<any>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);

          // Check if 'results' property is present and is an array
          if (parsedData.runs && parsedData.runs.length > 0 && parsedData.runs[0].results) {
            setSarifData(parsedData);
          } else {
            console.error('SARIF file does not contain expected results data.');
          }
        } catch (error) {
          console.error('Error parsing SARIF file:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleReset = () => {
    setSarifData(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ marginBottom: '20px' }}>SARIF Dashboard</h1>
      {sarifData ? (
        <div>
          <button onClick={handleReset} style={{ marginBottom: '10px' }}>
            Upload Another File
          </button>
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ marginBottom: '10px' }}>Visualization</h2>
            <ChartComponent data={sarifData} />
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            backgroundColor: '#f7f7f7',
            cursor: 'pointer',
          }}
        >
          <input {...getInputProps()} />
          <p style={{ fontSize: '16px', color: '#555' }}>Drag & drop a SARIF file here, or click to select one</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
