import React, { useState, useCallback } from 'react';
import { RefreshCw, Calculator } from 'lucide-react';

type Matrix = number[][];
type ClickedCell = { row: number; col: number } | null;

const BooleanProductsPage: React.FC = () => {
  
  // Generate a random Boolean matrix
  const generateRandomMatrix = useCallback((): Matrix => {
    const matrix = Array(4).fill(null).map(() => Array(4).fill(0));
    const numOnes = Math.floor(Math.random() * 6) + 4; // 4-9 ones
    
    for (let i = 0; i < numOnes; i++) {
      const row = Math.floor(Math.random() * 4);
      const col = Math.floor(Math.random() * 4);
      matrix[row][col] = 1;
    }
    
    return matrix;
  }, []);

  // Calculate Boolean product of two matrices
  const calculateBooleanProduct = useCallback((matrixA: Matrix, matrixB: Matrix): Matrix => {
    const result = Array(4).fill(null).map(() => Array(4).fill(0));
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          if (matrixA[i][k] === 1 && matrixB[k][j] === 1) {
            result[i][j] = 1;
            break; // Boolean OR - once we find one 1, we're done
          }
        }
      }
    }
    
    return result;
  }, []);

  const [matrixA, setMatrixA] = useState<Matrix>(() => generateRandomMatrix());
  const [matrixB, setMatrixB] = useState<Matrix>(() => generateRandomMatrix());
  const [productMatrix, setProductMatrix] = useState<Matrix>(() => Array(4).fill(null).map(() => Array(4).fill(-1))); // -1 means placeholder
  const [clickedCell, setClickedCell] = useState<ClickedCell>(null);

  const handleGenerateNew = () => {
    const newMatrixA = generateRandomMatrix();
    const newMatrixB = generateRandomMatrix();
    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
    setProductMatrix(Array(4).fill(null).map(() => Array(4).fill(-1))); // Reset product matrix
    setClickedCell(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (productMatrix[row][col] !== -1) return; // Already calculated
    
    setClickedCell({ row, col });
    
    // Calculate the Boolean product for this cell
    const correctProduct = calculateBooleanProduct(matrixA, matrixB);
    const result = correctProduct[row][col];
    
    // Update the product matrix
    const newProductMatrix = [...productMatrix];
    newProductMatrix[row][col] = result;
    setProductMatrix(newProductMatrix);
  };

  const resetProduct = () => {
    setProductMatrix(Array(4).fill(null).map(() => Array(4).fill(-1)));
    setClickedCell(null);
  };

  // Calculate the Boolean product for the currently clicked cell
  const calculateCellProduct = (row: number, col: number) => {
    const calculations = [];
    for (let k = 0; k < 4; k++) {
      calculations.push({
        aValue: matrixA[row][k],
        bValue: matrixB[k][col],
        product: matrixA[row][k] && matrixB[k][col] ? 1 : 0
      });
    }
    return calculations;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Boolean Products</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg font-serif mb-2">Computing Boolean Products of 4×4 Relation Matrices</p>
          <p className="text-gray-600">
            Click on any placeholder in the product matrix to see the calculation
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
          Generate New Matrices
        </button>
        <button
          onClick={resetProduct}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Calculator size={20} className="mr-2" />
          Reset Product
        </button>
      </div>

      {/* Matrices Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matrix A */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Matrix A</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-1 font-mono text-sm">
              {matrixA.map((row, i) =>
                row.map((value, j) => (
                  <div
                    key={`a-${i}-${j}`}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 ${
                      clickedCell && clickedCell.row === i
                        ? 'bg-yellow-200 font-bold'
                        : value === 1
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'bg-white text-gray-400'
                    }`}
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Matrix B */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Matrix B</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-1 font-mono text-sm">
              {matrixB.map((row, i) =>
                row.map((value, j) => (
                  <div
                    key={`b-${i}-${j}`}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 ${
                      clickedCell && clickedCell.col === j
                        ? 'bg-yellow-200 font-bold'
                        : value === 1
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'bg-white text-gray-400'
                    }`}
                  >
                    {value}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Product Matrix A ⊙ B */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Product A ⊙ B</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-1 font-mono text-sm">
              {productMatrix.map((row, i) =>
                row.map((value, j) => (
                  <div
                    key={`product-${i}-${j}`}
                    onClick={() => handleCellClick(i, j)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 cursor-pointer ${
                      value === -1
                        ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        : clickedCell && clickedCell.row === i && clickedCell.col === j
                        ? 'bg-green-200 font-bold text-green-800'
                        : value === 1
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'bg-white text-gray-400'
                    }`}
                  >
                    {value === -1 ? '?' : value}
                  </div>
                ))
              )}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">
            Click on '?' to calculate that cell
          </p>
        </div>
      </div>

      {/* Calculation Display */}
      {clickedCell && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Calculation for Cell ({clickedCell.row + 1}, {clickedCell.col + 1})
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center mb-4">
              <p className="font-mono text-lg">
                (A ⊙ B)[{clickedCell.row + 1}][{clickedCell.col + 1}] = (A[{clickedCell.row + 1}][1] ∧ B[1][{clickedCell.col + 1}]) ∨ 
                (A[{clickedCell.row + 1}][2] ∧ B[2][{clickedCell.col + 1}]) ∨ 
                (A[{clickedCell.row + 1}][3] ∧ B[3][{clickedCell.col + 1}]) ∨ 
                (A[{clickedCell.row + 1}][4] ∧ B[4][{clickedCell.col + 1}])
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {calculateCellProduct(clickedCell.row, clickedCell.col).map((calc, k) => (
                <div
                  key={k}
                  className={`text-center p-2 rounded ${
                    calc.product === 1 ? 'bg-green-100 border-2 border-green-400' : 'bg-white border'
                  }`}
                >
                  <span className="font-mono">
                    {calc.aValue} ∧ {calc.bValue} = {calc.product}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <p className="font-mono text-lg">
                Result = {calculateCellProduct(clickedCell.row, clickedCell.col).some(calc => calc.product === 1) ? '1' : '0'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                The result is 1 if any of the AND operations equals 1, otherwise 0
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooleanProductsPage;
