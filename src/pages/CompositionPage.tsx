import React, { useState, useCallback, useEffect } from 'react';
import { RefreshCw, Play, RotateCcw } from 'lucide-react';

type Relation = [number, number][];

const CompositionPage: React.FC = () => {
  const setA = [1, 2, 3, 4, 5];
  
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

  // Calculate composition R ∘ S = {(a,c) | ∃b: (a,b) ∈ R ∧ (b,c) ∈ S}
  const calculateComposition = useCallback((relationR: Relation, relationS: Relation): Relation => {
    const composition: Relation = [];
    
    for (const [a, b] of relationR) {
      for (const [bPrime, c] of relationS) {
        if (b === bPrime) {
          // Found a path a → b → c
          if (!composition.some(([x, y]) => x === a && y === c)) {
            composition.push([a, c]);
          }
        }
      }
    }
    
    return composition.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }, []);

  const [relationR, setRelationR] = useState<Relation>(() => generateRandomRelation());
  const [relationS, setRelationS] = useState<Relation>(() => generateRandomRelation());
  const [compositionRS, setCompositionRS] = useState<Relation>([]);
  const [animationProgress, setAnimationProgress] = useState(0); // 0 = initial, 1 = fully morphed
  const [isAnimating, setIsAnimating] = useState(false);

  // Update composition when relations change
  useEffect(() => {
    setCompositionRS(calculateComposition(relationR, relationS));
  }, [relationR, relationS, calculateComposition]);

  const handleGenerateNew = () => {
    const newR = generateRandomRelation();
    const newS = generateRandomRelation();
    setRelationR(newR);
    setRelationS(newS);
    setAnimationProgress(0);
    setIsAnimating(false);
  };

  const handleAnimate = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationProgress(0);
    
    // Animation: Phase 1 (1s) + Pause (1.5s) + Phase 2 (2s) + Pause (1s) + Phase 3 (1.5s) = 7s total
    const phase1Duration = 1000;   // 1 second for phase 1 (edge removal)
    const pause1Duration = 1500;   // 1.5 second pause
    const phase2Duration = 2000;   // 2 seconds for phase 2 (connect & shrink)
    const pause2Duration = 1000;   // 1 second pause
    const phase3Duration = 1500;   // 1.5 seconds for phase 3 (straighten lines)
    const totalDuration = phase1Duration + pause1Duration + phase2Duration + pause2Duration + phase3Duration;
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      let progress;
      
      if (elapsed <= phase1Duration) {
        // Phase 1: 0 to 0.33 (edge removal)
        progress = (elapsed / phase1Duration) * 0.33;
      } else if (elapsed <= phase1Duration + pause1Duration) {
        // Pause 1: stay at 0.33
        progress = 0.33;
      } else if (elapsed <= phase1Duration + pause1Duration + phase2Duration) {
        // Phase 2: 0.33 to 0.67 (connect & shrink)
        const phase2Elapsed = elapsed - phase1Duration - pause1Duration;
        progress = 0.33 + (phase2Elapsed / phase2Duration) * 0.34;
      } else if (elapsed <= phase1Duration + pause1Duration + phase2Duration + pause2Duration) {
        // Pause 2: stay at 0.67
        progress = 0.67;
      } else if (elapsed <= totalDuration) {
        // Phase 3: 0.67 to 1.0 (straighten lines)
        const phase3Elapsed = elapsed - phase1Duration - pause1Duration - phase2Duration - pause2Duration;
        progress = 0.67 + (phase3Elapsed / phase3Duration) * 0.33;
      } else {
        // Animation complete
        progress = 1;
      }
      
      setAnimationProgress(progress);
      
      if (elapsed < totalDuration) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    requestAnimationFrame(animate);
  };

  const handleReset = () => {
    setAnimationProgress(0);
    setIsAnimating(false);
  };

  // Get node positions
  const getNodePosition = (column: number, value: number) => {
    const x = 150 + column * 250;
    const y = 80 + (value - 1) * 80;
    return { x, y };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Composition of Relations</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="text-lg font-serif mb-2">Let A = {'{1, 2, 3, 4, 5}'}</p>
          <p className="text-gray-600 mb-2">
            The composition R ∘ S = {'{(a,c) | ∃b: (a,b) ∈ R ∧ (b,c) ∈ S}'}
          </p>
          <p className="text-sm text-gray-500">
            Click "Animate Composition" to see how paths combine into direct relations
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
          onClick={handleAnimate}
          disabled={isAnimating}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          <Play size={20} className="mr-2" />
          {isAnimating ? 'Animating...' : 'Animate Composition'}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={20} className="mr-2" />
          Reset View
        </button>
      </div>

      {/* Main Visualization */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-center">
          <svg width="800" height="500" viewBox="0 0 800 500" className="border border-gray-300">
            {/* Background */}
            <rect width="800" height="500" fill="white"/>
            
            {/* Column labels */}
            <text x="150" y="40" textAnchor="middle" className="fill-gray-700 font-serif text-lg font-semibold">
              A
            </text>
            <text 
              x="400" 
              y="40" 
              textAnchor="middle" 
              className="fill-gray-700 font-serif text-lg font-semibold"
              opacity={1 - animationProgress}
            >
              A
            </text>
            <text x="650" y="40" textAnchor="middle" className="fill-gray-700 font-serif text-lg font-semibold">
              A
            </text>

            {/* Relation labels */}
            <text 
              x="275" 
              y="30" 
              textAnchor="middle" 
              className="fill-blue-600 font-serif text-lg font-semibold"
              opacity={1 - animationProgress}
            >
              R
            </text>
            <text 
              x="525" 
              y="30" 
              textAnchor="middle" 
              className="fill-green-600 font-serif text-lg font-semibold"
              opacity={1 - animationProgress}
            >
              S
            </text>
            <text 
              x="400" 
              y="30" 
              textAnchor="middle" 
              className="fill-purple-600 font-serif text-lg font-semibold"
              opacity={animationProgress}
            >
              R ∘ S
            </text>

            {/* Arrow marker definitions */}
            <defs>
              <marker id="blueArrow" markerWidth="12" markerHeight="8" 
                      refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L12,4 z" fill="#2563eb"/>
              </marker>
              <marker id="greenArrow" markerWidth="12" markerHeight="8" 
                      refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L12,4 z" fill="#16a34a"/>
              </marker>
              <marker id="purpleArrow" markerWidth="12" markerHeight="8" 
                      refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L12,4 z" fill="#9333ea"/>
              </marker>
              <marker id="pathArrow" markerWidth="12" markerHeight="8" 
                      refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L12,4 z" fill="#dc2626"/>
              </marker>
            </defs>

            {/* Draw nodes */}
            {setA.map((value) => {
              // Left column (always visible)
              const leftPos = getNodePosition(0, value);
              
              // Middle column (shrinks and fades out during second phase)
              const middlePos = getNodePosition(1, value);
              
              // Right column (always visible)
              const rightPos = getNodePosition(2, value);
              
              // Animation phases: 0-0.33 = fade edges, 0.33-0.67 = shrink middle nodes, 0.67-1 = straighten
              const middlePhaseProgress = animationProgress > 0.33 && animationProgress <= 0.67 
                ? (animationProgress - 0.33) / 0.34 
                : animationProgress > 0.67 ? 1 : 0;
              const middleOpacity = Math.max(0, 1 - middlePhaseProgress * 2);
              const middleScale = Math.max(0.1, 1 - middlePhaseProgress);
              
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

                  {/* Middle column node (shrinks and fades out during second phase) */}
                  <g 
                    transform={`translate(${middlePos.x}, ${middlePos.y}) scale(${middleScale}) translate(${-middlePos.x}, ${-middlePos.y})`}
                    opacity={middleOpacity}
                    style={{ transition: 'opacity 0.2s ease-out, transform 0.2s ease-out' }}
                  >
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
                  </g>

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

            {/* Draw relation R (left to middle) - three-phase animation */}
            {relationR.map(([from, to], index) => {
              const fromPos = getNodePosition(0, from);
              const toPos = getNodePosition(1, to);
              
              // Check if this edge is part of a composition path
              // An edge (from, to) in R is part of composition if there exists some c 
              // such that (to, c) is in S and (from, c) is in the composition
              const isPartOfComposition = relationS.some(([sFrom, sTo]) => 
                sFrom === to && compositionRS.some(([compFrom, compTo]) => 
                  compFrom === from && compTo === sTo
                )
              );
              
              // Phase 1 (0-0.33): Single edges fade out, composition edges stay
              // Phase 2 (0.33-0.67): Composition edges turn red
              // Phase 3 (0.67-1): Lines start to straighten (but R edges will be replaced by straight lines)
              let opacity, color, strokeWidth;
              
              if (isPartOfComposition) {
                // Show only until phase 3, then will be replaced by straight composition lines
                if (animationProgress >= 0.67) {
                  opacity = Math.max(0, 1 - ((animationProgress - 0.67) / 0.33));
                } else {
                  opacity = 1;
                  const phase2Progress = animationProgress > 0.33 ? (animationProgress - 0.33) / 0.34 : 0;
                  color = `rgb(${37 + (220 - 37) * phase2Progress}, ${99 + (38 - 99) * phase2Progress}, ${235 + (38 - 235) * phase2Progress})`;
                  strokeWidth = 2 + phase2Progress;
                }
              } else {
                // Single edges fade out in phase 1
                const phase1Progress = Math.min(animationProgress / 0.33, 1);
                opacity = Math.max(0, 1 - phase1Progress);
                color = "#2563eb";
                strokeWidth = 2;
              }
              
              if (opacity > 0) {
                return (
                  <line
                    key={`r-${index}`}
                    x1={fromPos.x + 20}
                    y1={fromPos.y}
                    x2={toPos.x - 20}
                    y2={toPos.y}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    style={{ transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out, stroke-width 0.2s ease-out' }}
                  />
                );
              }
              return null;
            })}

            {/* Draw relation S (middle to right) - three-phase animation */}
            {relationS.map(([from, to], index) => {
              const fromPos = getNodePosition(1, from);
              const toPos = getNodePosition(2, to);
              
              // Check if this edge is part of a composition path
              // An edge (from, to) in S is part of composition if there exists some a
              // such that (a, from) is in R and (a, to) is in the composition
              const isPartOfComposition = relationR.some(([rFrom, rTo]) => 
                rTo === from && compositionRS.some(([compFrom, compTo]) => 
                  compFrom === rFrom && compTo === to
                )
              );
              
              // Phase 1 (0-0.33): Single edges fade out, composition edges stay
              // Phase 2 (0.33-0.67): Composition edges turn red
              // Phase 3 (0.67-1): Lines start to straighten (but S edges will be replaced by straight lines)
              let opacity, color, strokeWidth;
              
              if (isPartOfComposition) {
                // Show only until phase 3, then will be replaced by straight composition lines
                if (animationProgress >= 0.67) {
                  opacity = Math.max(0, 1 - ((animationProgress - 0.67) / 0.33));
                } else {
                  opacity = 1;
                  const phase2Progress = animationProgress > 0.33 ? (animationProgress - 0.33) / 0.34 : 0;
                  color = `rgb(${22 + (220 - 22) * phase2Progress}, ${163 + (38 - 163) * phase2Progress}, ${74 + (38 - 74) * phase2Progress})`;
                  strokeWidth = 2 + phase2Progress;
                }
              } else {
                // Single edges fade out in phase 1
                const phase1Progress = Math.min(animationProgress / 0.33, 1);
                opacity = Math.max(0, 1 - phase1Progress);
                color = "#16a34a";
                strokeWidth = 2;
              }
              
              if (opacity > 0) {
                return (
                  <line
                    key={`s-${index}`}
                    x1={fromPos.x + 20}
                    y1={fromPos.y}
                    x2={toPos.x - 20}
                    y2={toPos.y}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    style={{ transition: 'opacity 0.2s ease-out, stroke 0.2s ease-out, stroke-width 0.2s ease-out' }}
                  />
                );
              }
              return null;
            })}

            {/* Visual connection effect - appears during phase 2, morphs to straight in phase 3 */}
            {animationProgress > 0.33 && compositionRS.map(([from, to], index) => {
              // Find all intermediate nodes for this composition
              const intermediates = relationR
                .filter(([a, _]) => a === from)
                .map(([_, b]) => b)
                .filter(b => relationS.some(([bPrime, c]) => bPrime === b && c === to));
              
              return intermediates.map((intermediate, i) => {
                const fromPos = getNodePosition(0, from);
                const intermediatePos = getNodePosition(1, intermediate);
                const toPos = getNodePosition(2, to);
                
                let opacity, pathD, strokeWidth;
                
                if (animationProgress <= 0.67) {
                  // Phase 2: Show connecting bridge segments
                  const phase2Progress = (animationProgress - 0.33) / 0.34;
                  opacity = Math.min(1, phase2Progress * 2);
                  
                  // Draw the two connected segments
                  return (
                    <g key={`connection-${index}-${i}`}>
                      {/* Left segment (from → intermediate) */}
                      <line
                        x1={fromPos.x + 20}
                        y1={fromPos.y}
                        x2={intermediatePos.x - 20}
                        y2={intermediatePos.y}
                        stroke="#dc2626"
                        strokeWidth="3"
                        opacity={opacity}
                        style={{ transition: 'opacity 0.2s ease-out' }}
                      />
                      {/* Right segment (intermediate → to) */}
                      <line
                        x1={intermediatePos.x + 20}
                        y1={intermediatePos.y}
                        x2={toPos.x - 20}
                        y2={toPos.y}
                        stroke="#dc2626"
                        strokeWidth="3"
                        opacity={opacity}
                        style={{ transition: 'opacity 0.2s ease-out' }}
                      />
                      {/* Bridge segment */}
                      <line
                        x1={intermediatePos.x - 20}
                        y1={intermediatePos.y}
                        x2={intermediatePos.x + 20}
                        y2={intermediatePos.y}
                        stroke="#dc2626"
                        strokeWidth="3"
                        opacity={opacity}
                        style={{ transition: 'opacity 0.2s ease-out' }}
                      />
                    </g>
                  );
                } else {
                  // Phase 3: Morph from connected segments to straight line
                  const phase3Progress = (animationProgress - 0.67) / 0.33;
                  opacity = 1;
                  strokeWidth = 3 + phase3Progress; // Get slightly thicker
                  
                  // Calculate morphing path from connected segments to straight line
                  const straightMidX = (fromPos.x + toPos.x) / 2;
                  const straightMidY = (fromPos.y + toPos.y) / 2;
                  
                  // Interpolate between intermediate position and straight line midpoint
                  const morphMidX = intermediatePos.x * (1 - phase3Progress) + straightMidX * phase3Progress;
                  const morphMidY = intermediatePos.y * (1 - phase3Progress) + straightMidY * phase3Progress;
                  
                  // Use a quadratic curve that morphs from bent to straight
                  pathD = `M ${fromPos.x + 20} ${fromPos.y} Q ${morphMidX} ${morphMidY} ${toPos.x - 20} ${toPos.y}`;
                  
                  return (
                    <path
                      key={`morphing-${index}-${i}`}
                      d={pathD}
                      stroke="#dc2626"
                      strokeWidth={strokeWidth}
                      fill="none"
                      opacity={opacity}
                      style={{ transition: 'stroke-width 0.1s ease-out' }}
                    />
                  );
                }
              });
            })}
          </svg>
        </div>

        {/* Step indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex space-x-4 text-sm">
            <span className={`px-3 py-1 rounded ${animationProgress === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
              1. All Relations
            </span>
            <span className={`px-3 py-1 rounded ${animationProgress > 0 && animationProgress <= 0.33 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
              2. Remove Single Edges
            </span>
            <span className={`px-3 py-1 rounded ${animationProgress > 0.33 && animationProgress <= 0.67 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
              3. Connect & Shrink
            </span>
            <span className={`px-3 py-1 rounded ${animationProgress > 0.67 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
              4. Straighten Lines
            </span>
          </div>
          <div className="mt-2">
            <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-500 via-yellow-500 via-red-500 to-purple-500 h-2 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Set Notation Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2 text-purple-600">Composition R ∘ S</h3>
          <div className="bg-gray-50 rounded p-3 font-mono text-sm">
            R ∘ S = {'{' + compositionRS.map(([a, b]) => `(${a},${b})`).join(', ') + '}'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompositionPage;
