import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
          Relations
        </h1>
        
        {/* Directed Graph Illustration - LaTeX Style */}
        <div className="flex justify-center mb-8">
          <svg width="600" height="400" viewBox="0 0 600 400" className="border border-gray-300">
            {/* Clean white background */}
            <rect width="600" height="400" fill="white"/>
            
            {/* Nodes - LaTeX style circles */}
            <circle cx="150" cy="120" r="30" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="450" cy="120" r="30" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="150" cy="280" r="30" fill="none" stroke="black" strokeWidth="2"/>
            <circle cx="450" cy="280" r="30" fill="none" stroke="black" strokeWidth="2"/>
            
            {/* Node Labels - LaTeX font style */}
            <text x="150" y="128" textAnchor="middle" className="fill-black font-serif text-xl font-normal">a</text>
            <text x="450" y="128" textAnchor="middle" className="fill-black font-serif text-xl font-normal">b</text>
            <text x="150" y="288" textAnchor="middle" className="fill-black font-serif text-xl font-normal">c</text>
            <text x="450" y="288" textAnchor="middle" className="fill-black font-serif text-xl font-normal">d</text>
            
            {/* Arrow marker - clean LaTeX style */}
            <defs>
              <marker id="arrow" markerWidth="12" markerHeight="8" 
                      refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,8 L12,4 z" fill="black"/>
              </marker>
            </defs>
            
            {/* Directed edges - clean lines */}
            <line x1="180" y1="120" x2="420" y2="120" stroke="black" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <line x1="170" y1="145" x2="430" y2="255" stroke="black" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <line x1="150" y1="150" x2="150" y2="250" stroke="black" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <line x1="180" y1="280" x2="420" y2="280" stroke="black" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            
            {/* Self-loop - more round arc */}
            <path d="M 450 90 Q 520 60 520 120 Q 520 180 450 150" 
                  stroke="black" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
