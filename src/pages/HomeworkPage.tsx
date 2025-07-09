import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';

interface Question {
  id: number;
  type: 'representation' | 'composition' | 'boolean-product';
  question: string;
  given: any;
  solution: any;
}

const HomeworkPage: React.FC = () => {
  const [expandedSolutions, setExpandedSolutions] = useState<Set<number>>(new Set());
  const [, setCurrentQuestionSet] = useState(0);

  const toggleSolution = (questionId: number) => {
    setExpandedSolutions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const generateNewQuestions = () => {
    setCurrentQuestionSet(prev => prev + 1);
    setExpandedSolutions(new Set());
  };

  // Generate different question sets
  const getQuestions = (): Question[] => {

    return [
      // Questions 1-5: Single relation representations
      {
        id: 1,
        type: 'representation',
        question: 'Given the set A = {1, 2, 3, 4} and relation R = {(1,2), (2,3), (3,4), (1,4)}, draw the directed graph representation.',
        given: { set: [1, 2, 3, 4], relation: [[1, 2], [2, 3], [3, 4], [1, 4]] },
        solution: {
          type: 'graph',
          relations: [[1, 2], [2, 3], [3, 4], [1, 4]],
          setSize: 4,
          description: 'Nodes: 1, 2, 3, 4. Arrows: 1→2, 2→3, 3→4, 1→4',
          visualization: 'Four nodes arranged in a circle. Arrow from 1 to 2, 2 to 3, 3 to 4, and 1 to 4 (creating a path and a shortcut).'
        }
      },
      {
        id: 2,
        type: 'representation',
        question: 'Given A = {1, 2, 3, 4} and R = {(1,1), (2,2), (3,1), (4,3)}, write the matrix representation.',
        given: { set: [1, 2, 3, 4], relation: [[1, 1], [2, 2], [3, 1], [4, 3]] },
        solution: {
          type: 'matrix',
          matrix: [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [1, 0, 0, 0],
            [0, 0, 1, 0]
          ]
        }
      },
      {
        id: 3,
        type: 'representation',
        question: 'Given A = {1, 2, 3} and the matrix below, write the relation in set notation.',
        given: { 
          set: [1, 2, 3], 
          matrix: [
            [0, 1, 1],
            [1, 0, 1],
            [0, 1, 0]
          ]
        },
        solution: {
          type: 'set',
          relation: [[1, 2], [1, 3], [2, 1], [2, 3], [3, 2]]
        }
      },
      {
        id: 4,
        type: 'representation',
        question: 'Given A = {1, 2, 3, 4} and R = {(1,3), (2,1), (3,2), (4,4)}, create the Cartesian coordinate representation.',
        given: { set: [1, 2, 3, 4], relation: [[1, 3], [2, 1], [3, 2], [4, 4]] },
        solution: {
          type: 'cartesian',
          points: [[1, 3], [2, 1], [3, 2], [4, 4]],
          description: 'Plot points (1,3), (2,1), (3,2), (4,4) on a 4×4 grid.'
        }
      },
      {
        id: 5,
        type: 'representation',
        question: 'Given A = {1, 2, 3} and the directed graph below, write the matrix representation.',
        given: { 
          set: [1, 2, 3], 
          relation: [[1, 2], [2, 3], [3, 1], [1, 3]],
          showGraph: true
        },
        solution: {
          type: 'matrix',
          matrix: [
            [0, 1, 1],
            [0, 0, 1],
            [1, 0, 0]
          ],
          description: 'Convert arrows to matrix: 1→2, 2→3, 3→1, 1→3 become 1s in corresponding positions'
        }
      },

      // Questions 6-10: Composition problems
      {
        id: 6,
        type: 'composition',
        question: 'Given A = {1, 2, 3}, R = {(1,2), (2,3), (3,1)} and S = {(1,3), (2,1), (3,2)}, find R ∘ S.',
        given: { 
          set: [1, 2, 3], 
          relationR: [[1, 2], [2, 3], [3, 1]], 
          relationS: [[1, 3], [2, 1], [3, 2]] 
        },
        solution: {
          type: 'composition',
          result: [[1, 1], [2, 2], [3, 3]],
          explanation: 'R ∘ S = {(a,c) | ∃b: (a,b) ∈ R ∧ (b,c) ∈ S}. Paths: 1→2→1, 2→3→2, 3→1→3.'
        }
      },
      {
        id: 7,
        type: 'composition',
        question: 'Given A = {1, 2, 3, 4}, R = {(1,2), (2,4), (3,1)} and S = {(1,3), (2,2), (4,1)}, draw the directed graph of R ∘ S.',
        given: { 
          set: [1, 2, 3, 4], 
          relationR: [[1, 2], [2, 4], [3, 1]], 
          relationS: [[1, 3], [2, 2], [4, 1]] 
        },
        solution: {
          type: 'composition-graph',
          result: [[1, 2], [2, 1], [3, 3]],
          description: 'Arrows: 1→2 (via 1→2→2), 2→1 (via 2→4→1), 3→3 (via 3→1→3)'
        }
      },
      {
        id: 8,
        type: 'composition',
        question: 'Find the matrix representation of R ∘ S where R and S are given by their matrices.',
        given: {
          set: [1, 2, 3],
          matrixR: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 0]
          ],
          matrixS: [
            [0, 1, 0],
            [1, 0, 1],
            [0, 1, 1]
          ]
        },
        solution: {
          type: 'matrix-composition',
          result: [
            [0, 2, 1],
            [1, 0, 1],
            [0, 1, 0]
          ],
          booleanResult: [
            [0, 1, 1],
            [1, 0, 1],
            [0, 1, 0]
          ]
        }
      },
      {
        id: 9,
        type: 'composition',
        question: 'Given R = {(1,1), (2,3), (3,2)} and S = {(1,2), (2,1), (3,3)} on A = {1, 2, 3}, find both R ∘ S and S ∘ R.',
        given: { 
          set: [1, 2, 3], 
          relationR: [[1, 1], [2, 3], [3, 2]], 
          relationS: [[1, 2], [2, 1], [3, 3]] 
        },
        solution: {
          type: 'double-composition',
          resultRS: [[1, 2], [2, 3], [3, 1]],
          resultSR: [[1, 1], [2, 2], [3, 3]],
          note: 'Composition is not commutative: R ∘ S ≠ S ∘ R'
        }
      },
      {
        id: 10,
        type: 'composition',
        question: 'Express R ∘ S in set notation, where R and S are defined by the Cartesian plots: R has points (1,2), (3,1), (4,3) and S has points (1,4), (2,3), (3,2).',
        given: { 
          set: [1, 2, 3, 4], 
          relationR: [[1, 2], [3, 1], [4, 3]], 
          relationS: [[1, 4], [2, 3], [3, 2]] 
        },
        solution: {
          type: 'composition-set',
          result: [[1, 3], [3, 4], [4, 2]],
          workings: 'Paths: 1→2→3, 3→1→4, 4→3→2'
        }
      },

      // Questions 11-15: Boolean matrix products
      {
        id: 11,
        type: 'boolean-product',
        question: 'Compute the Boolean product A ⊙ B.',
        given: {
          matrixA: [
            [1, 0, 1],
            [0, 1, 1],
            [1, 1, 0]
          ],
          matrixB: [
            [1, 1, 0],
            [0, 1, 1],
            [1, 0, 1]
          ]
        },
        solution: {
          type: 'boolean-product',
          result: [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
          ],
          workings: 'Each (i,j): OR of (A[i][k] AND B[k][j]) for all k'
        }
      },
      {
        id: 12,
        type: 'boolean-product',
        question: 'Calculate (A ⊙ B)[2,3] step by step.',
        given: {
          matrixA: [
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [1, 0, 1, 1]
          ],
          matrixB: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 1]
          ],
          focus: [1, 2] // 0-indexed
        },
        solution: {
          type: 'single-cell',
          calculation: '(1∧1) ∨ (0∧1) ∨ (0∧1) ∨ (1∧1) = 1 ∨ 0 ∨ 0 ∨ 1 = 1',
          result: 1
        }
      },
      {
        id: 13,
        type: 'boolean-product',
        question: 'Find the Boolean square A ⊙ A (A²).',
        given: {
          matrixA: [
            [0, 1, 0],
            [1, 0, 1],
            [0, 1, 0]
          ]
        },
        solution: {
          type: 'boolean-square',
          result: [
            [1, 0, 1],
            [0, 1, 0],
            [1, 0, 1]
          ],
          interpretation: 'A² shows 2-step connections in the original relation'
        }
      },
      {
        id: 14,
        type: 'boolean-product',
        question: 'Verify that (A ⊙ B) ⊙ C = A ⊙ (B ⊙ C) for the given 2×2 matrices.',
        given: {
          matrixA: [[1, 0], [1, 1]],
          matrixB: [[0, 1], [1, 0]],
          matrixC: [[1, 1], [0, 1]]
        },
        solution: {
          type: 'associativity',
          leftSide: [[0, 1], [1, 1]], // (A ⊙ B) ⊙ C
          rightSide: [[0, 1], [1, 1]], // A ⊙ (B ⊙ C)
          verified: true,
          note: 'Boolean matrix multiplication is associative'
        }
      },

    ];
  };

  const questions = getQuestions();

  const renderMatrix = (matrix: number[][]) => (
    <div className="inline-block border-2 border-gray-400 p-2 rounded">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
        {matrix.map((row, i) => 
          row.map((value, j) => (
            <div key={`${i}-${j}`} className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-white text-sm font-mono">
              {value}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCartesianPlot = (points: [number, number][], setSize: number = 4) => (
    <div className="inline-block border border-gray-300 bg-white">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="300" height="300" fill="url(#grid)" />
        
        {/* Axes */}
        <line x1="30" y1="270" x2="270" y2="270" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="30" y1="270" x2="30" y2="30" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
          </marker>
        </defs>
        
        {/* Axis labels */}
        {Array.from({ length: setSize }, (_, i) => (
          <g key={`labels-${i}`}>
            <text x={30 + (i + 1) * 60} y="290" textAnchor="middle" className="fill-gray-600 text-sm">{i + 1}</text>
            <text x="15" y={270 - (i + 1) * 60 + 5} textAnchor="middle" className="fill-gray-600 text-sm">{i + 1}</text>
          </g>
        ))}
        
        {/* Grid dots */}
        {Array.from({ length: setSize }, (_, i) => 
          Array.from({ length: setSize }, (_, j) => (
            <circle 
              key={`dot-${i}-${j}`}
              cx={30 + (i + 1) * 60} 
              cy={270 - (j + 1) * 60} 
              r="2" 
              fill="#d1d5db" 
            />
          ))
        )}
        
        {/* Relation points */}
        {points.map(([x, y], index) => (
          <circle
            key={`point-${index}`}
            cx={30 + x * 60}
            cy={270 - y * 60}
            r="6"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="2"
          />
        ))}
        
        {/* Axis titles */}
        <text x="150" y="320" textAnchor="middle" className="fill-gray-700 text-sm font-semibold">Domain</text>
        <text x="10" y="150" textAnchor="middle" className="fill-gray-700 text-sm font-semibold" transform="rotate(-90 10 150)">Range</text>
      </svg>
    </div>
  );

  const renderDirectedGraph = (relations: [number, number][], setSize: number = 4) => {
    const getNodePosition = (value: number) => {
      const angles = setSize === 3 
        ? [0, 2 * Math.PI / 3, 4 * Math.PI / 3]
        : [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
      const radius = 80;
      const centerX = 150;
      const centerY = 150;
      const angle = angles[value - 1];
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY - radius * Math.sin(angle)
      };
    };

    return (
      <div className="inline-block border border-gray-300 bg-white">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Arrow marker */}
          <defs>
            <marker id="graphArrow" markerWidth="10" markerHeight="8" 
                    refX="9" refY="4" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,8 L10,4 z" fill="#2563eb"/>
            </marker>
          </defs>
          
          {/* Draw edges */}
          {relations.map(([from, to], index) => {
            const fromPos = getNodePosition(from);
            const toPos = getNodePosition(to);
            
            if (from === to) {
              // Self-loop
              const loopRadius = 25;
              return (
                <path
                  key={`edge-${index}`}
                  d={`M ${fromPos.x + 15} ${fromPos.y} 
                      A ${loopRadius} ${loopRadius} 0 1 1 ${fromPos.x - 15} ${fromPos.y}`}
                  stroke="#2563eb"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#graphArrow)"
                />
              );
            } else {
              // Regular edge
              const dx = toPos.x - fromPos.x;
              const dy = toPos.y - fromPos.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const unitX = dx / length;
              const unitY = dy / length;
              
              return (
                <line
                  key={`edge-${index}`}
                  x1={fromPos.x + unitX * 20}
                  y1={fromPos.y + unitY * 20}
                  x2={toPos.x - unitX * 20}
                  y2={toPos.y - unitY * 20}
                  stroke="#2563eb"
                  strokeWidth="2"
                  markerEnd="url(#graphArrow)"
                />
              );
            }
          })}
          
          {/* Draw nodes */}
          {Array.from({ length: setSize }, (_, i) => {
            const pos = getNodePosition(i + 1);
            return (
              <g key={`node-${i + 1}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill="white"
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  className="fill-black font-serif text-lg font-bold"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderSolution = (question: Question) => {
    const { solution } = question;
    
    switch (solution.type) {
      case 'matrix':
        return (
          <div className="space-y-2">
            <p className="font-semibold">Matrix representation:</p>
            {renderMatrix(solution.matrix)}
          </div>
        );
      
      case 'set':
        return (
          <div className="space-y-2">
            <p className="font-semibold">Set notation:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              R = {'{' + solution.relation.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
          </div>
        );
      
      case 'cartesian':
        return (
          <div className="space-y-4">
            <p className="font-semibold">Cartesian coordinate plot:</p>
            {renderCartesianPlot(solution.points)}
            <p className="text-sm text-gray-600">{solution.description}</p>
            <p className="font-mono text-sm">Points: {solution.points.map(([x, y]: [number, number]) => `(${x},${y})`).join(', ')}</p>
          </div>
        );
      
      case 'graph':
        return (
          <div className="space-y-4">
            <p className="font-semibold">Directed graph:</p>
            {renderDirectedGraph(solution.relations || [], solution.setSize || 4)}
            <p className="text-sm text-gray-600">{solution.description}</p>
          </div>
        );
      
      case 'composition':
        return (
          <div className="space-y-2">
            <p className="font-semibold">R ∘ S:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              {'{' + solution.result.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
            <p className="text-sm text-gray-600">{solution.explanation}</p>
          </div>
        );
      
      case 'composition-graph':
        return (
          <div className="space-y-4">
            <p className="font-semibold">Directed graph of R ∘ S:</p>
            {renderDirectedGraph(solution.result, 4)}
            <p className="font-mono bg-gray-100 p-2 rounded text-sm">
              {'{' + solution.result.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
            <p className="text-sm text-gray-600">{solution.description}</p>
          </div>
        );
      
      case 'matrix-composition':
        return (
          <div className="space-y-2">
            <p className="font-semibold">Boolean product R ⊙ S:</p>
            {renderMatrix(solution.booleanResult)}
            <p className="text-sm text-gray-600">After applying Boolean OR to eliminate values {'>'}1</p>
          </div>
        );
      
      case 'double-composition':
        return (
          <div className="space-y-2">
            <p className="font-semibold">R ∘ S:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              {'{' + solution.resultRS.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
            <p className="font-semibold mt-3">S ∘ R:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              {'{' + solution.resultSR.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
            <p className="text-sm text-gray-600 italic">{solution.note}</p>
          </div>
        );
      
      case 'composition-set':
        return (
          <div className="space-y-2">
            <p className="font-semibold">R ∘ S:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">
              {'{' + solution.result.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
            <p className="text-sm text-gray-600"><strong>Working:</strong> {solution.workings}</p>
          </div>
        );
      
      case 'boolean-product':
        return (
          <div className="space-y-2">
            <p className="font-semibold">A ⊙ B:</p>
            {renderMatrix(solution.result)}
            <p className="text-sm text-gray-600">{solution.workings}</p>
          </div>
        );
      
      case 'single-cell':
        return (
          <div className="space-y-2">
            <p className="font-semibold">Step-by-step calculation:</p>
            <p className="font-mono bg-gray-100 p-2 rounded">{solution.calculation}</p>
            <p className="font-semibold">Result: {solution.result}</p>
          </div>
        );
      
      case 'boolean-square':
        return (
          <div className="space-y-2">
            <p className="font-semibold">A²:</p>
            {renderMatrix(solution.result)}
            <p className="text-sm text-gray-600 italic">{solution.interpretation}</p>
          </div>
        );
      
      case 'associativity':
        return (
          <div className="space-y-2">
            <p className="font-semibold">(A ⊙ B) ⊙ C:</p>
            {renderMatrix(solution.leftSide)}
            <p className="font-semibold mt-3">A ⊙ (B ⊙ C):</p>
            {renderMatrix(solution.rightSide)}
            <p className="text-green-600 font-semibold">✓ {solution.note}</p>
          </div>
        );
      
      case 'conceptual':
        return (
          <div className="space-y-2">
            <p className="font-semibold">M ⊙ M:</p>
            {renderMatrix(solution.result)}
            <p className="text-sm text-gray-700"><strong>Meaning:</strong> {solution.meaning}</p>
            <p className="text-sm text-gray-600">{solution.interpretation}</p>
          </div>
        );
      
      default:
        return <p>Solution not available</p>;
    }
  };

  const renderGiven = (question: Question) => {
    const { given } = question;
    
    // Special case for problem 10 - show Cartesian plots for R and S
    if (question.id === 10 && given.relationR && given.relationS) {
      return (
        <div className="mt-4 space-y-6">
          <div>
            <p className="font-semibold mb-2">Relation R - Cartesian Plot:</p>
            {renderCartesianPlot(given.relationR, given.set ? given.set.length : 4)}
            <p className="text-sm text-gray-600 mt-2">
              R = {'{' + given.relationR.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Relation S - Cartesian Plot:</p>
            {renderCartesianPlot(given.relationS, given.set ? given.set.length : 4)}
            <p className="text-sm text-gray-600 mt-2">
              S = {'{' + given.relationS.map(([a, b]: [number, number]) => `(${a},${b})`).join(', ') + '}'}
            </p>
          </div>
        </div>
      );
    }
    
    if (given.showGraph && given.relation) {
      return (
        <div className="mt-2">
          <p className="font-semibold mb-2">Directed Graph:</p>
          {renderDirectedGraph(given.relation, given.set ? given.set.length : 3)}
        </div>
      );
    }
    
    if (given.matrix) {
      return (
        <div className="mt-2">
          {renderMatrix(given.matrix)}
        </div>
      );
    }
    
    if (given.matrixA || given.matrixR) {
      return (
        <div className="mt-2 space-y-4">
          {given.matrixA && (
            <div>
              <p className="font-semibold">Matrix A:</p>
              {renderMatrix(given.matrixA)}
            </div>
          )}
          {given.matrixB && (
            <div>
              <p className="font-semibold">Matrix B:</p>
              {renderMatrix(given.matrixB)}
            </div>
          )}
          {given.matrixC && (
            <div>
              <p className="font-semibold">Matrix C:</p>
              {renderMatrix(given.matrixC)}
            </div>
          )}
          {given.matrixR && (
            <div>
              <p className="font-semibold">Matrix R:</p>
              {renderMatrix(given.matrixR)}
            </div>
          )}
          {given.matrixS && (
            <div>
              <p className="font-semibold">Matrix S:</p>
              {renderMatrix(given.matrixS)}
            </div>
          )}
          {given.matrixM && (
            <div>
              <p className="font-semibold">Matrix M:</p>
              {renderMatrix(given.matrixM)}
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Practice Problems</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg text-gray-600 mb-2">
            Practice problems covering relation representations, composition, and Boolean matrix operations
          </p>
          <p className="text-sm text-gray-500">
            Click "Show Solution" to reveal the answer for each problem
          </p>
        </div>
      </div>

      {/* Generate New Questions Button */}
      <div className="flex justify-center">
        <button
          onClick={generateNewQuestions}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={20} className="mr-2" />
          Generate New Question Set
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Problem {question.id}
              </h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                question.type === 'representation' ? 'bg-blue-100 text-blue-800' :
                question.type === 'composition' ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {question.type === 'representation' ? 'Representation' :
                 question.type === 'composition' ? 'Composition' :
                 'Boolean Product'}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{question.question}</p>
            
            {renderGiven(question)}
            
            <button
              onClick={() => toggleSolution(question.id)}
              className="inline-flex items-center mt-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              {expandedSolutions.has(question.id) ? (
                <>
                  <ChevronDown size={16} className="mr-1" />
                  Hide Solution
                </>
              ) : (
                <>
                  <ChevronRight size={16} className="mr-1" />
                  Show Solution
                </>
              )}
            </button>
            
            {expandedSolutions.has(question.id) && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                {renderSolution(question)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">
          Complete all problems to master relations, composition, and Boolean matrix operations!
        </p>
      </div>
    </div>
  );
};

export default HomeworkPage;
