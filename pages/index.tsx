// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import ResultList from '../components/ResultList';
import { useRouter } from 'next/router';

const ResultDetail: React.FC<{ result: any }> = ({ result }) => {
  if (!result) {
    return <p>No result data available</p>;
  }
  const ruleId = result.ruleId || 'N/A';
  const message = result.message?.text || 'N/A';
  const location = result.locations?.[0]?.physicalLocation?.region?.startLine || 'N/A';
  const severity = result.level || 'N/A';

  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
      <p>
        <strong>Rule ID:</strong> {ruleId}
      </p>
      <p>
        <strong>Message:</strong> {message}
      </p>
      <p>
        <strong>Locations:</strong>
        {result.locations?.map((location, index) => (
          <span key={index}>
            {location.physicalLocation?.artifactLocation?.uri}:{' '}
            {location.physicalLocation?.region?.startLine || 'N/A'}
            {index < result.locations.length - 1 && ','}
          </span>
        ))}
      </p>
      <p>
        <strong>Severity:</strong> {severity}
      </p>
      {/* Add more details as needed */}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [sarifData, setSarifData] = useState<any>(null);
  const [cachedSarifData, setCachedSarifData] = useState<any>(null);
  const [cacheResults, setCacheResults] = useState<boolean>(true); // Added cacheResults state
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  useEffect(() => {
    // Load cached results when the component mounts
    if (cacheResults) {
      const cachedDataString = localStorage.getItem('cachedSarifData');
      if (cachedDataString) {
        const parsedData = JSON.parse(cachedDataString);
        setCachedSarifData(parsedData);
        setSarifData(parsedData);
      }
    }
  }, [cacheResults]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (parsedData.runs && parsedData.runs.length > 0 && parsedData.runs[0].results) {
            setSarifData(parsedData);
            setCachedSarifData(cacheResults ? parsedData : null);
            setSelectedResult(null);
            setShowDetails(false);
            // Cache the results in local storage if cacheResults is true
            if (cacheResults) {
              localStorage.setItem('cachedSarifData', JSON.stringify(parsedData));
            }
          } else {
            console.error('SARIF file does not contain expected results data:', parsedData);
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
    setSelectedResult(null);
    setShowDetails(false);

    // Reset the input element by changing its key
    setFileInputKey((prevKey) => prevKey + 1);

    // Navigate to the load SARIF page
    //router.push('/load-sarif');
    //onDrop();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file change if needed
    // For example, you can read the selected file using event.target.files
  };

  const handleResultClick = (resultIndex: number) => {
    setSelectedResult(resultIndex);
    setShowDetails(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const deleteCachedResults = () => {
    setCachedSarifData(null);
    // Remove cached results from local storage
    localStorage.removeItem('cachedSarifData');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#333',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>SARIF Dashboard</h1>
        <label style={{ marginBottom: '10px' }}>
          Dark Mode
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} style={{ marginLeft: '5px' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Cache Results
          <input type="checkbox" checked={cacheResults} onChange={() => setCacheResults(!cacheResults)} style={{ marginLeft: '5px' }} />
        </label>
      </div>
      {sarifData || cachedSarifData ? (
        <div style={{ padding: '20px' }}>
          <button onClick={handleReset} style={{ marginBottom: '10px' }}>
            Upload Another File
          </button>
          <button onClick={deleteCachedResults} style={{ marginLeft: '10px', marginBottom: '10px' }}>
            Delete Cached Results
          </button>
          {showDetails ? (
            <div>
              <button onClick={() => setShowDetails(false)} style={{ marginBottom: '10px' }}>
                Back to High-Level Dashboard
              </button>
              <h2>Detailed Result View</h2>
              {selectedResult !== null && sarifData.runs && sarifData.runs[0].results ? (
                <ResultDetail result={sarifData.runs[0].results[selectedResult]} />
              ) : (
                <p style={{ marginTop: '20px', fontSize: '16px' }}>Select a result to view details</p>
              )}
            </div>
          ) : (
            <div style={{ backgroundColor: darkMode ? '#444' : '#fff', padding: '10px', borderRadius: '5px' }}>
            <ResultList
              results={sarifData ? sarifData.runs[0].results : cachedSarifData.runs[0].results}
              onResultClick={handleResultClick}
            />
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          style={{
            border: darkMode ? '2px dashed #777' : '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            backgroundColor: darkMode ? '#555' : '#f7f7f7',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <input {...getInputProps()} 
          type="file"
          key={fileInputKey}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          ref={(input) => input && input.setAttribute('accept', '.sarif')}
          />
          <p style={{ fontSize: '16px', color: darkMode ? '#fff' : '#555' }}>
            Drag & drop a SARIF file here, or click to select one
          </p>
        </div>
      )}
    </div>
  );
        }

  export default Dashboard;
