// components/ResultList.tsx
import React from 'react';

interface ResultListProps {
  results: any[];
  onResultClick: (resultIndex: number) => void;
}

const ResultList: React.FC<ResultListProps> = ({ results, onResultClick }) => {
  // Aggregate results by ruleId and count occurrences
  const aggregatedResults: { [ruleId: string]: { count: number; results: any[] } } = {};

  results.forEach((result, index) => {
    const ruleId = result.ruleId || 'N/A';

    if (!aggregatedResults[ruleId]) {
      aggregatedResults[ruleId] = { count: 0, results: [] };
    }

    aggregatedResults[ruleId].count++;
    aggregatedResults[ruleId].results.push(result);
  });

  const sortedRuleIds = Object.keys(aggregatedResults).sort();

  return (
    <div>
      <h2>High-Level Dashboard</h2>
      {sortedRuleIds.map((ruleId) => (
        <div
          key={ruleId}
          style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => onResultClick(results.findIndex((result) => result.ruleId === ruleId))}
        >
          <p>
            <strong>Rule ID:</strong> {ruleId}
          </p>
          <p>
            <strong>Occurrences:</strong> {aggregatedResults[ruleId].count}
          </p>
          <p>
            <strong>Severity:</strong> {aggregatedResults[ruleId].results[0].level || 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ResultList;
