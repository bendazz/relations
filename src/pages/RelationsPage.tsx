import React, { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const RelationsPage: React.FC = () => {
  const setA = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const [activeTab, setActiveTab] = useState<'cartesian' | 'set' | 'matrix' | 'graph'>('cartesian');
  
  // Generate a random relation
  const generateRandomRelation = useCallback(() => {
    const relation: [number, number][] = [];
    const numPairs = Math.floor(Math.random() * 6) + 5; // 5-10 pairs
    
    for (let i = 0; i < numPairs; i++) {
      const x = setA[Math.floor(Math.random() * setA.length)];
      const y = setA[Math.floor(Math.random() * setA.length)];
      
      // Avoid duplicates
      if (!relation.some(([a, b]) => a === x && b === y)) {
        relation.push([x, y]);
      }
    }
    
    return relation.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }, [setA]);

  const [relation, setRelation] = useState<[number, number][]>(() => generateRandomRelation());

  const handleGenerateNew = () => {
    setRelation(generateRandomRelation());
  };

  // Format relation as set notation
  const formatRelationSet = (rel: [number, number][]) => {
    const pairs = rel.map(([x, y]) => `(${x},${y})`).join(', ');
    return `R = {${pairs}}`;
  };

  // Generate matrix representation
  const generateMatrix = (rel: [number, number][]) => {
    const matrix = Array(9).fill(null).map(() => Array(9).fill(0));
    rel.forEach(([x, y]) => {
      matrix[x-1][y-1] = 1;
    });
    return matrix;
  };

  const matrix = generateMatrix(relation);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Relations</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg font-serif mb-2">Let A = {'{1, 2, 3, 4, 5, 6, 7, 8, 9}'}</p>
          <p className="text-gray-600">A relation R on A is a subset of A × A</p>
        </div>
      </div>

      {/* Generate New Relation Button */}
      <div className="text-center">
        <button
          onClick={handleGenerateNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} className="mr-2" />
          Generate New Relation
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('cartesian')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'cartesian'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Cartesian Plot
          </button>
          <button
            onClick={() => setActiveTab('set')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'set'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Set Notation
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Matrix
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'graph'
                ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Directed Graph
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Cartesian Coordinate Plot */}
          {activeTab === 'cartesian' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Cartesian Representation</h2>
              <div className="flex justify-center">
                <svg width="500" height="500" viewBox="0 0 500 500" className="border border-gray-300">
                  {/* Background */}
                  <rect width="500" height="500" fill="white"/>
                  
                  {/* Grid lines */}
                  {setA.map((i) => (
                    <g key={`grid-${i}`}>
                      {/* Vertical grid lines */}
                      <line 
                        x1={50 + (i-1) * 45} 
                        y1={50} 
                        x2={50 + (i-1) * 45} 
                        y2={410} 
                        stroke="#e5e7eb" 
                        strokeWidth="1"
                      />
                      {/* Horizontal grid lines */}
                      <line 
                        x1={50} 
                        y1={50 + (i-1) * 45} 
                        x2={410} 
                        y2={50 + (i-1) * 45} 
                        stroke="#e5e7eb" 
                        strokeWidth="1"
                      />
                    </g>
                  ))}
                  
                  {/* Axes */}
                  <line x1="50" y1="410" x2="410" y2="410" stroke="black" strokeWidth="2"/>
                  <line x1="50" y1="410" x2="50" y2="50" stroke="black" strokeWidth="2"/>
                  
                  {/* Axis labels */}
                  {setA.map((num) => (
                    <g key={`label-${num}`}>
                      {/* X-axis labels */}
                      <text 
                        x={50 + (num-1) * 45} 
                        y={435} 
                        textAnchor="middle" 
                        className="fill-black font-serif text-sm"
                      >
                        {num}
                      </text>
                      {/* Y-axis labels */}
                      <text 
                        x={35} 
                        y={415 - (num-1) * 45} 
                        textAnchor="middle" 
                        className="fill-black font-serif text-sm"
                      >
                        {num}
                      </text>
                    </g>
                  ))}
                  
                  {/* Axis titles */}
                  <text x="230" y="470" textAnchor="middle" className="fill-black font-serif text-lg">x</text>
                  <text x="20" y="235" textAnchor="middle" className="fill-black font-serif text-lg" transform="rotate(-90, 20, 235)">y</text>
                  
                  {/* Plot relation points */}
                  {relation.map(([x, y], index) => (
                    <circle
                      key={`point-${index}`}
                      cx={50 + (x-1) * 45}
                      cy={410 - (y-1) * 45}
                      r="6"
                      fill="#3b82f6"
                      stroke="#1e40af"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                  ))}
                  
                  {/* All possible points (light gray) */}
                  {setA.map((x) =>
                    setA.map((y) => {
                      const isInRelation = relation.some(([rx, ry]) => rx === x && ry === y);
                      if (!isInRelation) {
                        return (
                          <circle
                            key={`empty-${x}-${y}`}
                            cx={50 + (x-1) * 45}
                            cy={410 - (y-1) * 45}
                            r="2"
                            fill="#d1d5db"
                            opacity="0.5"
                          />
                        );
                      }
                      return null;
                    })
                  )}
                </svg>
              </div>
            </div>
          )}

          {/* Set Notation Display */}
          {activeTab === 'set' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Set Notation</h2>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-lg text-center border">
                {formatRelationSet(relation)}
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                This relation contains {relation.length} ordered pairs from A × A
              </p>
            </div>
          )}

          {/* Matrix Representation */}
          {activeTab === 'matrix' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Matrix Representation</h2>
              <div className="flex justify-center">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="grid grid-cols-10 gap-1 font-mono text-sm">
                    {/* Header row with column labels */}
                    <div className="w-8 h-8 flex items-center justify-center font-semibold"></div>
                    {setA.map((j) => (
                      <div key={`col-${j}`} className="w-8 h-8 flex items-center justify-center font-semibold text-blue-600">
                        {j}
                      </div>
                    ))}
                    
                    {/* Matrix rows */}
                    {matrix.map((row, i) => (
                      <React.Fragment key={`row-${i}`}>
                        {/* Row label */}
                        <div className="w-8 h-8 flex items-center justify-center font-semibold text-blue-600">
                          {i + 1}
                        </div>
                        {/* Matrix entries */}
                        {row.map((value, j) => (
                          <div
                            key={`cell-${i}-${j}`}
                            className={`w-8 h-8 flex items-center justify-center border border-gray-300 ${
                              value === 1 
                                ? 'bg-blue-100 text-blue-800 font-bold' 
                                : 'bg-white text-gray-400'
                            }`}
                          >
                            {value}
                          </div>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-3 text-center max-w-md">
                    Entry (i,j) = 1 if (i,j) ∈ R, otherwise 0. 
                    Rows represent first elements, columns represent second elements.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Directed Graph Representation */}
          {activeTab === 'graph' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-center">Directed Graph Representation</h2>
              <div className="flex justify-center">
                <svg width="600" height="400" viewBox="0 0 600 400" className="border border-gray-300">
                  {/* Background */}
                  <rect width="600" height="400" fill="white"/>
                  
                  {/* Node positions in a 3x3 grid */}
                  {setA.map((num) => {
                    const row = Math.floor((num - 1) / 3);
                    const col = (num - 1) % 3;
                    const x = 150 + col * 150;
                    const y = 100 + row * 100;
                    
                    return (
                      <g key={`node-${num}`}>
                        {/* Node circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r="25"
                          fill="white"
                          stroke="black"
                          strokeWidth="2"
                        />
                        {/* Node label */}
                        <text
                          x={x}
                          y={y + 6}
                          textAnchor="middle"
                          className="fill-black font-serif text-lg font-bold"
                        >
                          {num}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Arrow marker */}
                  <defs>
                    <marker id="graphArrow" markerWidth="12" markerHeight="8" 
                            refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,8 L12,4 z" fill="black"/>
                    </marker>
                  </defs>
                  
                  {/* Draw edges for the relation */}
                  {relation.map(([from, to], index) => {
                    const fromRow = Math.floor((from - 1) / 3);
                    const fromCol = (from - 1) % 3;
                    const fromX = 150 + fromCol * 150;
                    const fromY = 100 + fromRow * 100;
                    
                    const toRow = Math.floor((to - 1) / 3);
                    const toCol = (to - 1) % 3;
                    const toX = 150 + toCol * 150;
                    const toY = 100 + toRow * 100;
                    
                    // Self-loop
                    if (from === to) {
                      const loopRadius = 35;
                      return (
                        <path
                          key={`edge-${index}`}
                          d={`M ${fromX} ${fromY - 25} Q ${fromX + loopRadius} ${fromY - loopRadius} ${fromX + 25} ${fromY} Q ${fromX + loopRadius} ${fromY + loopRadius} ${fromX} ${fromY + 25}`}
                          stroke="blue"
                          strokeWidth="2"
                          fill="none"
                          markerEnd="url(#graphArrow)"
                        />
                      );
                    }
                    
                    // Calculate edge start and end points on circle boundaries
                    const dx = toX - fromX;
                    const dy = toY - fromY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const unitX = dx / distance;
                    const unitY = dy / distance;
                    
                    const startX = fromX + unitX * 25;
                    const startY = fromY + unitY * 25;
                    const endX = toX - unitX * 25;
                    const endY = toY - unitY * 25;
                    
                    return (
                      <line
                        key={`edge-${index}`}
                        x1={startX}
                        y1={startY}
                        x2={endX}
                        y2={endY}
                        stroke="blue"
                        strokeWidth="2"
                        markerEnd="url(#graphArrow)"
                      />
                    );
                  })}
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">
                Each arrow represents an ordered pair in the relation. Self-loops indicate reflexive pairs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationsPage;
