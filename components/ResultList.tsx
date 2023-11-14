// components/ResultList.tsx
import React, { useState, useEffect } from 'react';

const getSeverity = (result: any): string => {
  if (result.runs && result.runs.length > 0 && result.runs[0].results) {
    const ruleId = result.ruleId;

    // Find the rule with the matching ID
    const rule = result.runs[0].rules.find((r: any) => r.id === ruleId);

    // Check if the rule and its default configuration exist
    if (rule && rule.defaultConfiguration) {
      return rule.defaultConfiguration.level || 'Unknown';
    }
  }

  return 'Unknown';
};

const ResultItem: React.FC<{ result: any; onClick: () => void }> = ({ result, onClick }) => {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid #ddd' }}>
      <p>
        <strong>Rule ID:</strong> {result.ruleId}
      </p>
      <p>
        <strong>Severity:</strong> {getSeverity(result)}
      </p>
      <p>
        <strong>Message:</strong> {result.message.text}
      </p>
    </div>
  );
};

const ResultList: React.FC<{ results: any[]; onResultClick: (resultIndex: number) => void }> = ({ results, onResultClick }) => {
  return (
    <div>
      {results.map((result, index) => (
        <ResultItem key={index} result={result} onClick={() => onResultClick(index)} />
      ))}
    </div>
  );
};

export default ResultList;
