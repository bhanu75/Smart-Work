import React, { useState, useEffect } from 'react';
import { Settings, Home, RotateCcw, Volume2, VolumeX, MapPin } from 'lucide-react';

const COLORS = ['red', 'green', 'yellow', 'blue'];
const PLAYER_NAMES = ['You', 'Computer 2', 'Computer 3', 'Computer 4'];

// Actual board positions with coordinates
const SAFE_POSITIONS = [1, 9, 14, 22, 27, 35, 40, 48];
const STAR_POSITIONS = [8, 21, 34, 47];

const START_POSITIONS = { red: 0, green: 13, yellow: 26, blue: 39 };

const HOME_STRETCH_LENGTH = 6;

const LudoGame = () => {
  const [gameState, setGameState] = useState({
    currentPlayer: 0,
    diceValue: null,
    rolling: false,
    tokens: {
      red: [
        { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
      ],
      green: [
        { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
      ],
      yellow: [
        { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
      ],
      blue: [
        { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
        { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
      ]
    },
    canMove: false,
    movableTokens: [],
    consecutiveSixes: 0,
    winner: null
  });

  const [settings, setSettings] = useState({
    showSettings: false,
    sound: true,
    winOrder: {
      green: 'random',
      yellow: 'random',
      blue: 'random'
    }
  });

  const getMovableTokens = (color, dice) => {
    const tokens = gameState.tokens[color];
    const movable = [];
    
    tokens.forEach((token, idx) => {
      if (token.isHome) return;
      
      if (token.position === -1 && dice === 6) {
        movable.push(idx);
      } else if (token.inHomeStretch) {
        if (token.homeStretchPos + dice <= HOME_STRETCH_LENGTH) {
          movable.push(idx);
        }
      } else if (token.position >= 0) {
        movable.push(idx);
      }
    });
    
    return movable;
  };

  const rollDice = () => {
    if (gameState.rolling || gameState.canMove || gameState.winner) return;
    
    setGameState(prev => ({ ...prev, rolling: true }));
    
    setTimeout(() => {
      const dice = Math.floor(Math.random() * 6) + 1;
      const color = COLORS[gameState.currentPlayer];
      const movable = getMovableTokens(color, dice);
      
      let newConsecutiveSixes = dice === 6 ? gameState.consecutiveSixes + 1 : 0;
      
      if (newConsecutiveSixes === 3) {
        setGameState(prev => ({
          ...prev,
          diceValue: dice,
          rolling: false,
          consecutiveSixes: 0,
          canMove: false
        }));
        setTimeout(() => nextPlayer(), 1000);
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        diceValue: dice,
        rolling: false,
        canMove: movable.length > 0,
        movableTokens: movable,
        consecutiveSixes: newConsecutiveSixes
      }));
      
      if (gameState.currentPlayer > 0 && movable.length > 0) {
        setTimeout(() => {
          const aiDifficulty = settings.winOrder[color];
          const tokenIndex = selectAIMove(color, movable, dice, aiDifficulty);
          moveToken(color, tokenIndex, dice);
        }, 1200);
      } else if (movable.length === 0) {
        setTimeout(() => nextPlayer(), 1000);
      }
    }, 600);
  };

  const selectAIMove = (color, movableTokens, dice, difficulty) => {
    const tokens = gameState.tokens[color];
    
    if (difficulty === 'first') {
      let best = movableTokens[0];
      let bestScore = -100;
      
      movableTokens.forEach(idx => {
        const token = tokens[idx];
        let score = 0;
        if (token.isHome) score = 1000;
        else if (token.inHomeStretch) score = 500 + token.homeStretchPos * 10;
        else if (token.position >= 0) score = token.position;
        else score = -10;
        
        if (score > bestScore) {
          bestScore = score;
          best = idx;
        }
      });
      return best;
    } else if (difficulty === 'last') {
      let worst = movableTokens[0];
      let worstScore = 1000;
      
      movableTokens.forEach(idx => {
        const token = tokens[idx];
        let score = 0;
        if (token.isHome) score = 1000;
        else if (token.inHomeStretch) score = 500 + token.homeStretchPos * 10;
        else if (token.position >= 0) score = token.position;
        else score = -10;
        
        if (score < worstScore) {
          worstScore = score;
          worst = idx;
        }
      });
      return worst;
    } else {
      return movableTokens[Math.floor(Math.random() * movableTokens.length)];
    }
  };

  const moveToken = (color, tokenIndex, dice) => {
    if (!gameState.canMove && gameState.currentPlayer === 0) return;
    if (!gameState.movableTokens.includes(tokenIndex)) return;
    
    setGameState(prev => {
      const newTokens = { ...prev.tokens };
      const token = { ...newTokens[color][tokenIndex] };
      let extraTurn = false;
      
      if (token.position === -1) {
        token.position = 0;
        extraTurn = true;
      } else if (token.inHomeStretch) {
        token.homeStretchPos += dice;
        if (token.homeStretchPos === HOME_STRETCH_LENGTH) {
          token.isHome = true;
        }
      } else {
        const newPos = token.position + dice;
        
        if (newPos >= 51) {
          token.inHomeStretch = true;
          token.homeStretchPos = newPos - 51;
          if (token.homeStretchPos === HOME_STRETCH_LENGTH) {
            token.isHome = true;
          }
        } else {
          token.position = newPos;
          
          const absolutePos = (token.position + START_POSITIONS[color]) % 52;
          
          COLORS.forEach(otherColor => {
            if (otherColor !== color) {
              newTokens[otherColor] = newTokens[otherColor].map(t => {
                if (!t.inHomeStretch && t.position >= 0) {
                  const otherAbsPos = (t.position + START_POSITIONS[otherColor]) % 52;
                  if (absolutePos === otherAbsPos && !SAFE_POSITIONS.includes(absolutePos)) {
                    extraTurn = true;
                    return { ...t, position: -1 };
                  }
                }
                return t;
              });
            }
          });
        }
      }
      
      newTokens[color][tokenIndex] = token;
      
      const allHome = newTokens[color].every(t => t.isHome);
      
      return {
        ...prev,
        tokens: newTokens,
        canMove: false,
        movableTokens: [],
        winner: allHome ? color : prev.winner,
        diceValue: extraTurn || dice === 6 ? prev.diceValue : null
      };
    });
    
    if (dice !== 6 && !gameState.winner) {
      setTimeout(() => nextPlayer(), 1000);
    } else if (gameState.currentPlayer > 0 && !gameState.winner) {
      setTimeout(() => rollDice(), 1000);
    }
  };

  const nextPlayer = () => {
    setGameState(prev => ({
      ...prev,
      currentPlayer: (prev.currentPlayer + 1) % 4,
      diceValue: null,
      consecutiveSixes: 0,
      canMove: false,
      movableTokens: []
    }));
  };

  useEffect(() => {
    if (gameState.currentPlayer > 0 && !gameState.rolling && !gameState.canMove && !gameState.winner && !gameState.diceValue) {
      setTimeout(() => rollDice(), 1500);
    }
  }, [gameState.currentPlayer, gameState.rolling, gameState.canMove, gameState.diceValue]);

  const restartGame = () => {
    setGameState({
      currentPlayer: 0,
      diceValue: null,
      rolling: false,
      tokens: {
        red: [
          { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
        ],
        green: [
          { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
        ],
        yellow: [
          { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
        ],
        blue: [
          { id: 0, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 1, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 2, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false },
          { id: 3, position: -1, inHomeStretch: false, homeStretchPos: -1, isHome: false }
        ]
      },
      canMove: false,
      movableTokens: [],
      consecutiveSixes: 0,
      winner: null
    });
  };

  const getTokensOnPosition = (position, inHomeStretch = false, homeStretchPos = -1) => {
    const tokensHere = [];
    COLORS.forEach(color => {
      gameState.tokens[color].forEach((token, idx) => {
        if (inHomeStretch && token.inHomeStretch && token.homeStretchPos === homeStretchPos && !token.isHome) {
          tokensHere.push({ color, idx, token });
        } else if (!inHomeStretch && !token.inHomeStretch && token.position === position && token.position >= 0) {
          const absolutePos = (token.position + START_POSITIONS[color]) % 52;
          tokensHere.push({ color, idx, token, absolutePos });
        }
      });
    });
    return tokensHere;
  };

  const getBoardColor = (pos) => {
    if (SAFE_POSITIONS.includes(pos)) return 'bg-white';
    return 'bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-center text-yellow-300 mb-2 drop-shadow-lg">
          4-PLAYER LUDO MVP
        </h1>
        <p className="text-center text-white text-sm sm:text-base mb-4">One Real Player vs Three Computer AIs</p>
      </div>

      <div className="relative bg-white rounded-2xl shadow-2xl p-3 sm:p-6 max-w-3xl w-full">
        {settings.showSettings && (
          <div className="absolute inset-0 bg-black bg-opacity-80 z-50 rounded-2xl flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">⚙️ Settings</h2>
              
              <div className="space-y-5">
                <div className="border-2 border-green-500 rounded-lg p-4">
                  <label className="block font-bold mb-2 text-green-700">🟢 Computer 2 (Green)</label>
                  <select 
                    className="w-full border-2 rounded-lg p-3 text-base"
                    value={settings.winOrder.green}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      winOrder: { ...prev.winOrder, green: e.target.value }
                    }))}
                  >
                    <option value="random">🎲 Random (Normal)</option>
                    <option value="first">🚀 Win First (Aggressive)</option>
                    <option value="last">🐢 Win Last (Defensive)</option>
                  </select>
                </div>

                <div className="border-2 border-yellow-500 rounded-lg p-4">
                  <label className="block font-bold mb-2 text-yellow-700">🟡 Computer 3 (Yellow)</label>
                  <select 
                    className="w-full border-2 rounded-lg p-3 text-base"
                    value={settings.winOrder.yellow}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      winOrder: { ...prev.winOrder, yellow: e.target.value }
                    }))}
                  >
                    <option value="random">🎲 Random (Normal)</option>
                    <option value="first">🚀 Win First (Aggressive)</option>
                    <option value="last">🐢 Win Last (Defensive)</option>
                  </select>
                </div>

                <div className="border-2 border-blue-500 rounded-lg p-4">
                  <label className="block font-bold mb-2 text-blue-700">🔵 Computer 4 (Blue)</label>
                  <select 
                    className="w-full border-2 rounded-lg p-3 text-base"
                    value={settings.winOrder.blue}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      winOrder: { ...prev.winOrder, blue: e.target.value }
                    }))}
                  >
                    <option value="random">🎲 Random (Normal)</option>
                    <option value="first">🚀 Win First (Aggressive)</option>
                    <option value="last">🐢 Win Last (Defensive)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between border-2 rounded-lg p-4">
                  <span className="font-bold text-lg">🔊 Sound</span>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, sound: !prev.sound }))}
                    className={`p-3 rounded-lg ${settings.sound ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {settings.sound ? <Volume2 size={24} className="text-white" /> : <VolumeX size={24} />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setSettings(prev => ({ ...prev, showSettings: false }))}
                className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700"
              >
                Close Settings
              </button>
            </div>
          </div>
        )}

        {gameState.winner && (
          <div className="absolute inset-0 bg-black bg-opacity-80 z-50 rounded-2xl flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-4xl font-bold mb-4" style={{ color: gameState.winner }}>
                {PLAYER_NAMES[COLORS.indexOf(gameState.winner)]} Wins!
              </h2>
              <button
                onClick={restartGame}
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-green-700"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setSettings(prev => ({ ...prev, showSettings: true }))}
            className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            <Settings size={24} />
          </button>
          
          <div className="text-center">
            <div 
              className="font-bold text-xl px-6 py-2 rounded-lg"
              style={{ 
                backgroundColor: COLORS[gameState.currentPlayer],
                color: 'white'
              }}
            >
              {PLAYER_NAMES[gameState.currentPlayer]}'s Turn
            </div>
            {gameState.consecutiveSixes > 0 && (
              <div className="text-sm text-orange-600 font-bold mt-1">
                {gameState.consecutiveSixes} six{gameState.consecutiveSixes > 1 ? 'es' : ''}!
              </div>
            )}
          </div>

          <button
            onClick={restartGame}
            className="p-3 bg-red-200 rounded-lg hover:bg-red-300 transition"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* PROPER LUDO BOARD */}
        <div className="aspect-square relative mx-auto" style={{ maxWidth: '600px' }}>
          <div className="absolute inset-0 border-8 border-black">
            {/* HOME BASES */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-green-500 border-4 border-black p-4">
              <div className="text-white font-bold text-sm sm:text-base mb-2">Computer 2</div>
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-2rem)]">
                {gameState.tokens.green.map((token, idx) => (
                  token.position === -1 && (
                    <div key={idx} className="bg-white rounded-full border-4 border-green-700 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-700 rounded-full"></div>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-yellow-400 border-4 border-black p-4">
              <div className="text-yellow-900 font-bold text-sm sm:text-base mb-2">Computer 3</div>
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-2rem)]">
                {gameState.tokens.yellow.map((token, idx) => (
                  token.position === -1 && (
                    <div key={idx} className="bg-white rounded-full border-4 border-yellow-700 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-700 rounded-full"></div>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-red-500 border-4 border-black p-4">
              <div className="text-white font-bold text-sm sm:text-base mb-2">You</div>
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-2rem)]">
                {gameState.tokens.red.map((token, idx) => (
                  token.position === -1 && (
                    <div key={idx} className="bg-white rounded-full border-4 border-red-700 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-700 rounded-full"></div>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-500 border-4 border-black p-4">
              <div className="text-white font-bold text-sm sm:text-base mb-2">Computer 4</div>
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-2rem)]">
                {gameState.tokens.blue.map((token, idx) => (
                  token.position === -1 && (
                    <div key={idx} className="bg-white rounded-full border-4 border-blue-700 flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-700 rounded-full"></div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* CENTER HOME */}
            <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-gradient-to-br from-yellow-300 via-green-300 to-red-300 border-4 border-black flex items-center justify-center">
              <Home className="text-white drop-shadow-lg" size={40} />
            </div>

            {/* VERTICAL PATHS */}
            <div className="absolute left-0 top-[40%] w-[40%] h-[20%] grid grid-cols-6 gap-0.5">
              {[0,1,2,3,4,5].map(i => (
                <div key={`left-${i}`} className={`${i === 1 ? 'bg-green-600' : 'bg-white'} border border-gray-400 relative flex items-center justify-center`}>
                  {i === 1 && getTokensOnPosition(-1, true, i).filter(t => t.color === 'green').map((t, idx) => (
                    <div key={idx} className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-green-700 border-2 border-white rounded-full"></div>
                  ))}
                </div>
              ))}
            </div>

            <div className="absolute right-0 top-[40%] w-[40%] h-[20%] grid grid-cols-6 gap-0.5">
              {[0,1,2,3,4,5].map(i => (
                <div key={`right-${i}`} className={`${i === 4 ? 'bg-blue-600' : 'bg-white'} border border-gray-400 relative flex items-center justify-center`}>
                  {i === 4 && getTokensOnPosition(-1, true, i).filter(t => t.color === 'blue').map((t, idx) => (
                    <div key={idx} className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-blue-700 border-2 border-white rounded-full"></div>
                  ))}
                </div>
              ))}
            </div>

            {/* HORIZONTAL PATHS */}
            <div className="absolute top-0 left-[40%] h-[40%] w-[20%] grid grid-rows-6 gap-0.5">
              {[0,1,2,3,4,5].map(i => (
                <div key={`top-${i}`} className={`${i === 4 ? 'bg-yellow-600' : 'bg-white'} border border-gray-400 relative flex items-center justify-center`}>
                  {i === 4 && getTokensOnPosition(-1, true, i).filter(t => t.color === 'yellow').map((t, idx) => (
                    <div key={idx} className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-yellow-700 border-2 border-white rounded-full"></div>
                  ))}
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-[40%] h-[40%] w-[20%] grid grid-rows-6 gap-0.5">
              {[0,1,2,3,4,5].map(i => (
                <div key={`bottom-${i}`} className={`${i === 1 ? 'bg-red-600' : 'bg-white'} border border-gray-400 relative flex items-center justify-center`}>
                  {i === 1 && getTokensOnPosition(-1, true, i).filter(t => t.color === 'red').map((t, idx) => (
                    <div key={idx} className="absolute w-4 h-4 sm:w-5 sm:h-5 bg-red-700 border-2 border-white rounded-full"></div>
                  ))}
                </div>
              ))}
            </div>

            {/* MAIN BOARD PATH TOKENS */}
            {COLORS.map(color => 
              gameState.tokens[color].map((token, idx) => {
                if (token.position >= 0 && !token.inHomeStretch && !token.isHome) {
                  const absolutePos = (token.position + START_POSITIONS[color]) % 52;
                  const isSafe = SAFE_POSITIONS.includes(absolutePos);
                  const isStar = STAR_POSITIONS.includes(absolutePos);
                  const isMovable = gameState.movableTokens.includes(idx) && color === COLORS[gameState.currentPlayer];
                  
                  let left = 0, top = 0;
                  
                  // Calculate position based on board layout
                  if (absolutePos < 5) { // Bottom row, left side
                    left = 6 + absolutePos * 6.67;
                    top = 86.67;
                  } else if (absolutePos === 5) {
                    left = 40;
                    top = 86.67;
                  } else if (absolutePos < 12) { // Left column, bottom to middle
                    left = 6.67;
                    top = 86.67 - (absolutePos - 5) * 6.67;
                  } else if (absolutePos === 12) {
                    left = 6.67;
                    top = 40;
                  } else if (absolutePos < 18) { // Left column, middle to top
                    left = 6.67;
                    top = 40 - (absolutePos - 12) * 6.67;
                  } else if (absolutePos < 24) { // Top row, left to middle
                    left = 6.67 + (absolutePos - 17) * 6.67;
                    top = 6.67;
                  } else if (absolutePos < 30) { // Top row, middle to right
                    left = 46.67 + (absolutePos - 24) * 6.67;
                    top = 6.67;
                  
