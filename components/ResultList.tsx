// components/ResultList.tsx
import React, { useState, useEffect } from 'react';

const getSeverity = (result: any): string => {
  if (result.runs && result.runs.length > 0 && result.runs[0].results) {
    const ruleId = result.ruleId;
    const rule = result.runs[0].rules.find((r: any) => r.id === ruleId);
    if (rule && rule.defaultConfiguration) {
      return rule.defaultConfiguration.level || 'Unknown';
    }
  }
  return 'Unknown';
};

const ResultList: React.FC<{ results: any[]; onResultClick: (resultIndex: number) => void }> = ({ results, onResultClick }) => {
  const ruleOccurrences: Record<string, { occurrences: number; message: string }> = {};

  results.forEach((result) => {
    const ruleId = result.ruleId;
    ruleOccurrences[ruleId] = ruleOccurrences[ruleId] || { occurrences: 0, message: '' };
    ruleOccurrences[ruleId].occurrences += 1;
    ruleOccurrences[ruleId].message = result.message?.text || 'No message available';
  });

  return (
    <div>
      {Object.keys(ruleOccurrences).map((ruleId) => (
        <div key={ruleId} style={{ padding: '10px', borderBottom: '1px solid #ddd' }} onClick={() => onResultClick(-1)}>
          <p>
            <strong>Rule ID:</strong> {ruleId}
          </p>
          <p>
            <strong>Severity:</strong> {getSeverity(results.find((result) => result.ruleId === ruleId) || {})}
          </p>
          <p>
            <strong>Message:</strong> {ruleOccurrences[ruleId].message}
          </p>
          <p>
            <strong>Occurrences:</strong> {ruleOccurrences[ruleId].occurrences}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ResultList;
