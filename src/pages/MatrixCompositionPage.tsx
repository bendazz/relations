import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';

type Relation = [number, number][];

const MatrixCompositionPage: React.FC = () => {
  const setA = [1, 2, 3, 4];
  
  // Generate random relations
  const generateRandomRelation = useCallback((): Relation => {
    const relation: Relation = [];
    const numPairs = Math.floor(Math.random() * 4) + 3; // 3-6 pairs
    
    for (let i = 0; i < numPairs; i++) {
      const from = setA[Math.floor(Math.random() * setA.length)];
      const to = setA[Math.floor(Math.random() * setA.length)];
      
      // Avoid duplicates
      if (!relation.some(([a, b]) => a === from && b === to)) {
        relation.push([from, to]);
      }
    }
    
    return relation.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }, [setA]);

  // Convert relation to Boolean matrix
  const relationToMatrix = useCallback((relation: Relation) => {
    const matrix: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
    relation.forEach(([from, to]) => {
      matrix[from - 1][to - 1] = 1;
    });
    return matrix;
  }, []);

  // Calculate Boolean matrix product
  const calculateMatrixProduct = useCallback((matrixA: number[][], matrixB: number[][]) => {
    const result: number[][] = Array(4).fill(null).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          if (matrixA[i][k] && matrixB[k][j]) {
            result[i][j] = 1;
            break; // OR operation - if any path exists, result is 1
          }
        }
      }
    }
    return result;
  }, []);

  const [relationR, setRelationR] = useState<Relation>(() => generateRandomRelation());
  const [relationS, setRelationS] = useState<Relation>(() => generateRandomRelation());
  const [matrixR, setMatrixR] = useState<number[][]>([]);
  const [matrixS, setMatrixS] = useState<number[][]>([]);
  const [productMatrix, setProductMatrix] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());

  // Update matrices when relations change
  useEffect(() => {
    const newMatrixR = relationToMatrix(relationR);
    const newMatrixS = relationToMatrix(relationS);
    const newProduct = calculateMatrixProduct(newMatrixR, newMatrixS);
    
    setMatrixR(newMatrixR);
    setMatrixS(newMatrixS);
    setProductMatrix(newProduct);
  }, [relationR, relationS, relationToMatrix, calculateMatrixProduct]);

  const handleGenerateNew = () => {
    const newR = generateRandomRelation();
    const newS = generateRandomRelation();
    setRelationR(newR);
    setRelationS(newS);
    setSelectedCell(null);
    setRevealedCells(new Set());
  };

  const handleReset = () => {
    setSelectedCell(null);
    setRevealedCells(new Set());
  };

  const handleCellClick = (i: number, j: number) => {
    setSelectedCell([i, j]);
    const cellKey = `${i}-${j}`;
    setRevealedCells(prev => new Set([...prev, cellKey]));
  };

  // Get node positions
  const getNodePosition = (column: number, value: number) => {
    const x = 150 + column * 250;
    const y = 80 + (value - 1) * 80;
    return { x, y };
  };

  // Check if an edge should be highlighted for the selected cell
  const shouldHighlightEdge = (from: number, to: number, isRRelation: boolean): 'solid' | 'dotted' | 'none' => {
    if (!selectedCell) return 'none';
    
    const [selectedI, selectedJ] = selectedCell;
    
    if (isRRelation) {
      // For R relation, check if edge starts from selected row
      if (from === selectedI + 1) {
        return relationR.some(([a, b]) => a === from && b === to) ? 'solid' : 'dotted';
      }
    } else {
      // For S relation, check if edge ends at selected column
      if (to === selectedJ + 1) {
        return relationS.some(([a, b]) => a === from && b === to) ? 'solid' : 'dotted';
      }
    }
    
    return 'none';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Matrix Composition</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg font-serif mb-2">Let A = {'{1, 2, 3, 4}'}</p>
          <p className="text-gray-600 mb-2">
            Boolean Matrix Multiplication: (R ⊙ S)[i][j] = ∨ₖ (R[i][k] ∧ S[k][j])
          </p>
          <p className="text-sm text-gray-500">
            Click on a placeholder in the product matrix to see the corresponding paths
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleGenerateNew}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} className="mr-2" />
          Generate New Relations
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={20} className="mr-2" />
          Reset Selection
        </button>
      </div>

      {/* Graph Visualization */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center">
          <svg width="800" height="400" viewBox="0 0 800 400" className="border border-gray-300">
            {/* Background */}
            <rect width="800" height="400" fill="white"/>
            
            {/* Column labels */}
            <text x="150" y="40" textAnchor="middle" className="fill-gray-700 font-serif text-lg font-semibold">
              A
            </text>
            <text x="400" y="40" textAnchor="middle" className="fill-gray-700 font-serif text-lg font-semibold">
              A
            </text>
            <text x="650" y="40" textAnchor="middle" className="fill-gray-700 font-serif text-lg font-semibold">
              A
            </text>

            {/* Relation labels */}
            <text x="275" y="30" textAnchor="middle" className="fill-blue-600 font-serif text-lg font-semibold">
              R
            </text>
            <text x="525" y="30" textAnchor="middle" className="fill-green-600 font-serif text-lg font-semibold">
              S
            </text>

            {/* Draw nodes */}
            {setA.map((value) => {
              const leftPos = getNodePosition(0, value);
              const middlePos = getNodePosition(1, value);
              const rightPos = getNodePosition(2, value);
              
              return (
                <g key={`nodes-${value}`}>
                  {/* Left column node */}
                  <circle
                    cx={leftPos.x}
                    cy={leftPos.y}
                    r="20"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <text
                    x={leftPos.x}
                    y={leftPos.y + 6}
                    textAnchor="middle"
                    className="fill-black font-serif text-lg font-bold"
                  >
                    {value}
                  </text>

                  {/* Middle column node */}
                  <circle
                    cx={middlePos.x}
                    cy={middlePos.y}
                    r="20"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <text
                    x={middlePos.x}
                    y={middlePos.y + 6}
                    textAnchor="middle"
                    className="fill-black font-serif text-lg font-bold"
                  >
                    {value}
                  </text>

                  {/* Right column node */}
                  <circle
                    cx={rightPos.x}
                    cy={rightPos.y}
                    r="20"
                    fill="white"
                    stroke="black"
                    strokeWidth="2"
                  />
                  <text
                    x={rightPos.x}
                    y={rightPos.y + 6}
                    textAnchor="middle"
                    className="fill-black font-serif text-lg font-bold"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Draw potential R edges (left to middle) when cell is selected */}
            {selectedCell && setA.map((from) => 
              setA.map((to) => {
                const fromPos = getNodePosition(0, from);
                const toPos = getNodePosition(1, to);
                const highlightType = shouldHighlightEdge(from, to, true);
                
                if (highlightType === 'none') return null;
                
                return (
                  <line
                    key={`r-potential-${from}-${to}`}
                    x1={fromPos.x + 20}
                    y1={fromPos.y}
                    x2={toPos.x - 20}
                    y2={toPos.y}
                    stroke="#2563eb"
                    strokeWidth="2"
                    strokeDasharray={highlightType === 'dotted' ? '5,5' : 'none'}
                    opacity={highlightType === 'dotted' ? 0.5 : 1}
                  />
                );
              })
            )}

            {/* Draw potential S edges (middle to right) when cell is selected */}
            {selectedCell && setA.map((from) => 
              setA.map((to) => {
                const fromPos = getNodePosition(1, from);
                const toPos = getNodePosition(2, to);
                const highlightType = shouldHighlightEdge(from, to, false);
                
                if (highlightType === 'none') return null;
                
                return (
                  <line
                    key={`s-potential-${from}-${to}`}
                    x1={fromPos.x + 20}
                    y1={fromPos.y}
                    x2={toPos.x - 20}
                    y2={toPos.y}
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeDasharray={highlightType === 'dotted' ? '5,5' : 'none'}
                    opacity={highlightType === 'dotted' ? 0.5 : 1}
                  />
                );
              })
            )}
          </svg>
        </div>
      </div>

      {/* Matrix Multiplication Display */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center space-x-8">
          {/* Matrix R */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Matrix R</h3>
            <div className="grid grid-cols-4 gap-1 border-2 border-gray-300 p-2 rounded">
              {matrixR.map((row, i) => 
                row.map((value, j) => (
                  <div
                    key={`r-${i}-${j}`}
                    className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-sm font-mono
                      ${selectedCell && selectedCell[0] === i ? 'bg-blue-100' : 'bg-white'}`}
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Multiplication symbol */}
          <div className="text-2xl font-bold">⊙</div>

          {/* Matrix S */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Matrix S</h3>
            <div className="grid grid-cols-4 gap-1 border-2 border-gray-300 p-2 rounded">
              {matrixS.map((row, i) => 
                row.map((value, j) => (
                  <div
                    key={`s-${i}-${j}`}
                    className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-sm font-mono
                      ${selectedCell && selectedCell[1] === j ? 'bg-green-100' : 'bg-white'}`}
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Equals symbol */}
          <div className="text-2xl font-bold">=</div>

          {/* Product Matrix */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-purple-600">R ⊙ S</h3>
            <div className="grid grid-cols-4 gap-1 border-2 border-gray-300 p-2 rounded">
              {productMatrix.map((row, i) => 
                row.map((value, j) => {
                  const cellKey = `${i}-${j}`;
                  const isRevealed = revealedCells.has(cellKey);
                  const isSelected = selectedCell && selectedCell[0] === i && selectedCell[1] === j;
                  
                  return (
                    <button
                      key={`product-${i}-${j}`}
                      onClick={() => handleCellClick(i, j)}
                      className={`w-8 h-8 flex items-center justify-center border border-gray-200 text-sm font-mono
                        transition-colors hover:bg-gray-100
                        ${isSelected ? 'bg-purple-200 ring-2 ring-purple-400' : 
                          isRevealed ? 'bg-purple-50' : 'bg-gray-50'}
                        ${!isRevealed ? 'text-gray-400' : 'text-black'}`}
                    >
                      {isRevealed ? value : '?'}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Explanation */}
        {selectedCell && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Computing (R ⊙ S)[{selectedCell[0] + 1}][{selectedCell[1] + 1}]:</strong>
              {' '}Looking for paths from node {selectedCell[0] + 1} to node {selectedCell[1] + 1}.
              {' '}Solid lines show existing edges, dotted lines show missing edges.
              {' '}Result is 1 if there's at least one complete solid path, 0 otherwise.
            </p>
          </div>
        )}
      </div>

      {/* Set Notation Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">Relation R</h3>
          <div className="bg-gray-50 rounded p-3 font-mono text-sm">
            R = {'{' + relationR.map(([a, b]) => `(${a},${b})`).join(', ') + '}'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2 text-green-600">Relation S</h3>
          <div className="bg-gray-50 rounded p-3 font-mono text-sm">
            S = {'{' + relationS.map(([a, b]) => `(${a},${b})`).join(', ') + '}'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixCompositionPage;
