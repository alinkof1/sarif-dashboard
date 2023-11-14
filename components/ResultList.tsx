// components/ResultList.tsx
import React, { useState, useEffect } from 'react';

const getSeverity = (result: any): string => {
  return result.runs && result.runs[0].rules && result.runs[0].rules[result.ruleId]
    ? result.runs[0].rules[result.ruleId].defaultConfiguration.level
    : 'Unknown';
};

const ResultItem: React.FC<{ result: any; onClick: () => void; severityMapping: Record<string, string> }> = ({ result, onClick, severityMapping }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>
      <p>
        <strong>Rule ID:</strong> {result.ruleId}
      </p>
      <p>
        <strong>Severity:</strong> {getSeverity(result.ruleId, severityMapping)}
      </p>
      {/* Add more details as needed */}
    </div>
  );
};

const ResultList: React.FC<{ results: any[]; onResultClick: (resultIndex: number) => void; severityMapping: Record<string, string> }> = ({ results, onResultClick, severityMapping }) => {
  return (
    <div>
      {results.map((result, index) => (
        <ResultItem key={index} result={result} onClick={() => onResultClick(index)} severityMapping={severityMapping} />
      ))}
    </div>
  );
};

export default ResultList;
