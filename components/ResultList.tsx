// components/ResultList.tsx
import React from 'react';

interface ResultListProps {
  results: any[];
  onResultClick: (index: number) => void;
}

const ResultList: React.FC<ResultListProps> = ({ results, onResultClick }) => {
  return (
    <div>
      <h2>Results List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((result, index) => (
          <li
            key={index}
            onClick={() => onResultClick(index)}
            style={{
              cursor: 'pointer',
              border: '1px solid #ccc',
              padding: '10px',
              margin: '5px',
              borderRadius: '5px',
              backgroundColor: '#f7f7f7',
            }}
          >
            <strong>Rule ID:</strong> {result.ruleId}
            <br />
            <strong>Message:</strong> {result.message.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultList;
