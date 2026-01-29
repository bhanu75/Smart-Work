import React, { useState, useEffect } from 'react';
import { Settings, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const COLORS = ['red', 'green', 'yellow', 'blue'];
const PLAYER_NAMES = ['You', 'Computer 2', 'Computer 3', 'Computer 4'];
const START_POSITIONS = { red: 0, green: 13, yellow: 26, blue: 39 };

const LudoGame = () => {
  const [gameState, setGameState] = useState({
    currentPlayer: 0,
    diceValue: null,
    rolling: false,
    tokens: {
      red: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false })),
      green: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false })),
      yellow: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false })),
      blue: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false }))
    },
    movableTokens: [],
    winner: null
  });

  const [settings, setSettings] = useState({
    showSettings: false,
    sound: true,
    winOrder: { green: 'random', yellow: 'random', blue: 'random' }
  });

  const getMovableTokens = (color, dice) => {
    const tokens = gameState.tokens[color];
    return tokens.map((t, i) => {
      if (t.won) return null;
      if (t.position === -1 && dice === 6) return i;
      if (t.inHome && t.homePos + dice <= 5) return i;
      if (t.position >= 0 && !t.inHome && t.position + dice < 52) return i;
      return null;
    }).filter(i => i !== null);
  };

  const rollDice = () => {
    if (gameState.rolling || gameState.movableTokens.length > 0 || gameState.winner) return;
    setGameState(prev => ({ ...prev, rolling: true }));
    
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      const color = COLORS[gameState.currentPlayer];
      const movable = getMovableTokens(color, dice);
      
      setGameState(prev => ({ ...prev, diceValue: dice, rolling: false, movableTokens: movable }));
      
      if (movable.length === 0) {
        setTimeout(() => nextPlayer(), 1000);
      } else if (gameState.currentPlayer > 0) {
        setTimeout(() => {
          const idx = movable[Math.floor(Math.random() * movable.length)];
          moveToken(color, idx, dice);
        }, 1200);
      }
    }, 600);
  };

  const moveToken = (color, tokenIndex, dice) => {
    setGameState(prev => {
      const newTokens = { ...prev.tokens };
      const token = { ...newTokens[color][tokenIndex] };
      let extraTurn = false;
      
      if (token.position === -1) {
        token.position = 0;
        extraTurn = true;
      } else if (token.inHome) {
        token.homePos += dice;
        if (token.homePos === 5) token.won = true;
      } else {
        token.position += dice;
        if (token.position >= 51) {
          token.inHome = true;
          token.homePos = token.position - 51;
          if (token.homePos >= 5) token.won = true;
        }
      }
      
      newTokens[color][tokenIndex] = token;
      const allWon = newTokens[color].every(t => t.won);
      
      return { ...prev, tokens: newTokens, movableTokens: [], winner: allWon ? color : prev.winner };
    });
    
    setTimeout(() => {
      if (dice !== 6 && !gameState.winner) nextPlayer();
      else if (gameState.currentPlayer > 0 && !gameState.winner) rollDice();
    }, 800);
  };

  const nextPlayer = () => {
    setGameState(prev => ({ ...prev, currentPlayer: (prev.currentPlayer + 1) % 4, diceValue: null, movableTokens: [] }));
  };

  useEffect(() => {
    if (gameState.currentPlayer > 0 && !gameState.rolling && gameState.movableTokens.length === 0 && !gameState.winner && !gameState.diceValue) {
      setTimeout(() => rollDice(), 1500);
    }
  }, [gameState.currentPlayer]);

  const restartGame = () => {
    setGameState({
      currentPlayer: 0, diceValue: null, rolling: false,
      tokens: {
        red: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false })),
        green: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false })),
        yellow: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false })),
        blue: Array(4).fill(null).map((_, id) => ({ id, position: -1, inHome: false, homePos: -1, won: false }))
      },
      movableTokens: [], winner: null
    });
  };

  const getTokenStyle = (color, tokenId) => {
    const token = gameState.tokens[color][tokenId];
    if (token.position === -1) return null;
    
    const pos = (token.position + START_POSITIONS[color]) % 52;
    const pathPositions = [
      // Path coordinates around the board
      [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],
      [7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],
      [14,7],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],
      [7,14],[6,14],[6,13],[6,12],[6,11],[6,10],[6,9],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
    ];
    
    if (pos < pathPositions.length) {
      const [row, col] = pathPositions[pos];
      return { gridRow: row + 1, gridColumn: col + 1 };
    }
    return null;
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#ffd700', 
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          4-PLAYER LUDO MVP
        </h1>

        <div style={{ position: 'relative', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          
          {/* Settings Modal */}
          {settings.showSettings && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50,
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
            }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>⚙️ Settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    { color: 'green', label: '🟢 Computer 2' },
                    { color: 'yellow', label: '🟡 Computer 3' },
                    { color: 'blue', label: '🔵 Computer 4' }
                  ].map(({ color, label }) => (
                    <div key={color} style={{ border: `2px solid ${color}`, borderRadius: '8px', padding: '15px' }}>
                      <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color }}>{label}</label>
                      <select style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '1rem' }}
                        value={settings.winOrder[color]}
                        onChange={(e) => setSettings(prev => ({ ...prev, winOrder: { ...prev.winOrder, [color]: e.target.value } }))}>
                        <option value="random">🎲 Random</option>
                        <option value="first">🚀 Win First</option>
                        <option value="last">🐢 Win Last</option>
                      </select>
                    </div>
                  ))}
                </div>
                <button onClick={() => setSettings(prev => ({ ...prev, showSettings: false }))}
                  style={{ width: '100%', marginTop: '20px', background: '#667eea', color: 'white', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Win Modal */}
          {gameState.winner && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 50,
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ background: 'white', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: gameState.winner, marginBottom: '20px' }}>
                  {PLAYER_NAMES[COLORS.indexOf(gameState.winner)]} Wins!
                </h2>
                <button onClick={restartGame}
                  style={{ background: '#2ecc71', color: 'white', padding: '15px 40px', borderRadius: '8px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  🔄 Play Again
                </button>
              </div>
            </div>
          )}

          {/* Player Panels */}
          {[
            { color: 'green', pos: { top: '10px', left: '10px' }, label: 'Computer 2', idx: 1 },
            { color: 'yellow', pos: { top: '10px', right: '10px' }, label: 'Computer 3', idx: 2 },
            { color: 'red', pos: { bottom: '10px', left: '10px' }, label: 'You', idx: 0 },
            { color: 'blue', pos: { bottom: '10px', right: '10px' }, label: 'Computer 4', idx: 3 }
          ].map(({ color, pos, label, idx }) => (
            <div key={color} style={{
              position: 'absolute', ...pos, background: gameState.currentPlayer === idx ? color : 'rgba(255,255,255,0.95)',
              padding: '8px 12px', borderRadius: '8px', border: `3px solid ${color}`,
              transition: 'all 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                <span style={{ fontWeight: 'bold', color: gameState.currentPlayer === idx ? 'white' : '#333' }}>{label}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: gameState.currentPlayer === idx ? 'white' : '#666', marginTop: '4px' }}>
                {gameState.tokens[color].filter(t => t.won).length}/4 Home
              </div>
            </div>
          ))}

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingTop: '50px' }}>
            <button onClick={() => setSettings(prev => ({ ...prev, showSettings: true }))}
              style={{ padding: '10px', background: '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <Settings size={24} />
            </button>
            <button onClick={restartGame}
              style={{ padding: '10px', background: '#ffcccc', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              <RotateCcw size={24} />
            </button>
          </div>

          {/* Ludo Board */}
          <div style={{
            width: '100%',
            aspectRatio: '1',
            background: 'white',
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 1fr)',
            gridTemplateRows: 'repeat(15, 1fr)',
            gap: '1px',
            border: '4px solid #333',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Green Home */}
            <div style={{ gridColumn: '1 / 7', gridRow: '1 / 7', background: '#2ecc71', padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {gameState.tokens.green.map((token, idx) => (
                token.position === -1 && (
                  <div key={idx} style={{ background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60%', height: '60%', background: '#2ecc71', borderRadius: '50%', border: '3px solid white' }} />
                  </div>
                )
              ))}
            </div>

            {/* Yellow Home */}
            <div style={{ gridColumn: '10 / 16', gridRow: '1 / 7', background: '#f1c40f', padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {gameState.tokens.yellow.map((token, idx) => (
                token.position === -1 && (
                  <div key={idx} style={{ background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60%', height: '60%', background: '#f1c40f', borderRadius: '50%', border: '3px solid white' }} />
                  </div>
                )
              ))}
            </div>

            {/* Red Home */}
            <div style={{ gridColumn: '1 / 7', gridRow: '10 / 16', background: '#e74c3c', padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {gameState.tokens.red.map((token, idx) => (
                token.position === -1 && (
                  <div key={idx} style={{ background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60%', height: '60%', background: '#e74c3c', borderRadius: '50%', border: '3px solid white' }} />
                  </div>
                )
              ))}
            </div>

            {/* Blue Home */}
            <div style={{ gridColumn: '10 / 16', gridRow: '10 / 16', background: '#3498db', padding: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {gameState.tokens.blue.map((token, idx) => (
                token.position === -1 && (
                  <div key={idx} style={{ background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '60%', height: '60%', background: '#3498db', borderRadius: '50%', border: '3px solid white' }} />
                  </div>
                )
              ))}
            </div>

            {/* Center Triangle */}
            <div style={{ gridColumn: '7 / 10', gridRow: '7 / 10', background: 'linear-gradient(135deg, #2ecc71, #f1c40f, #e74c3c, #3498db)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🏠</div>
            </div>

            {/* Path Cells */}
            {Array.from({ length: 15 * 15 }).map((_, i) => {
              const row = Math.floor(i / 15);
              const col = i % 15;
              const isPath = (row >= 6 && row <= 8) || (col >= 6 && col <= 8);
              const isHome = (row < 6 && col < 6) || (row < 6 && col >= 9) || (row >= 9 && col < 6) || (row >= 9 && col >= 9);
              const isCenter = row >= 6 && row <= 8 && col >= 6 && col <= 8;
              
              if (isHome || isCenter) return null;
              
              return (
                <div key={i} style={{
                  gridColumn: col + 1,
                  gridRow: row + 1,
                  background: isPath ? '#fff' : 'transparent',
                  border: isPath ? '1px solid #ddd' : 'none'
                }} />
              );
            })}

            {/* Tokens on Board */}
            {COLORS.map(color => 
              gameState.tokens[color].map((token, idx) => {
                const style = getTokenStyle(color, idx);
                if (!style) return null;
                const isMovable = gameState.movableTokens.includes(idx) && COLORS[gameState.currentPlayer] === color;
                
                return (
                  <div key={`${color}-${idx}`}
                    onClick={() => isMovable && color === 'red' && moveToken(color, idx, gameState.diceValue)}
                    style={{
                      ...style,
                      width: '24px',
                      height: '24px',
                      background: color,
                      borderRadius: '50%',
                      position: 'relative',
                      margin: 'auto',
                      cursor: isMovable ? 'pointer' : 'default',
                      boxShadow: isMovable ? '0 0 0 4px yellow' : '0 2px 4px rgba(0,0,0,0.2)',
                      animation: isMovable ? 'pulse 1s infinite' : 'none',
                      zIndex: isMovable ? 10 : 5,
                      border: '3px solid white'
                    }}>
                    <div style={{ 
                      width: '10px', 
                      height: '10px', 
                      background: 'white', 
                      borderRadius: '50%', 
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }} />
                  </div>
                );
              })
            )}
          </div>

          {/* Dice */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={rollDice}
              disabled={gameState.rolling || gameState.movableTokens.length > 0 || gameState.currentPlayer !== 0 || gameState.winner}
              style={{
                fontSize: '3rem',
                background: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: '4px solid #333',
                cursor: gameState.currentPlayer === 0 && gameState.movableTokens.length === 0 && !gameState.winner ? 'pointer' : 'not-allowed',
                opacity: gameState.currentPlayer === 0 && gameState.movableTokens.length === 0 && !gameState.winner ? 1 : 0.5,
                animation: gameState.rolling ? 'spin 0.8s infinite linear' : 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
              {gameState.diceValue || '🎲'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'white', marginTop: '15px', fontSize: '0.95rem' }}>
          🎲 Roll 6 to start • Get all 4 tokens home to win • Configure AI in Settings!
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LudoGame;
