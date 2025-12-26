import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, Plus, MoreVertical, Home, BookOpen, Calendar, BarChart3, Clock, Trash2, Edit2, Target, TrendingUp, Download } from 'lucide-react';

const TradeCard = ({ trade, onDelete, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getResultColor = () => {
    if (trade.result === 'WIN') return 'text-emerald-400';
    if (trade.result === 'RULE BROKEN') return 'text-yellow-400';
    return 'text-red-400';
  };

  const getResultIcon = () => {
    if (trade.result === 'WIN') return <Check className="w-4 h-4" />;
    if (trade.result === 'RULE BROKEN') return <AlertTriangle className="w-4 h-4" />;
    return <X className="w-4 h-4" />;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded ${trade.result === 'WIN' ? 'bg-emerald-500/20' : trade.result === 'RULE BROKEN' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
            {getResultIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-medium">{trade.symbol}</span>
              <span className={`font-medium ${trade.type === 'CALL' ? 'text-emerald-400' : 'text-red-400'}`}>
                {trade.type}
              </span>
              <Clock className="w-3 h-3 text-slate-500" />
              <span className="text-slate-400 text-sm">{trade.time}</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-white p-1"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-slate-700 rounded-lg shadow-xl z-20 w-36 border border-slate-600">
              <button 
                onClick={() => { onEdit(trade); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-slate-600 rounded-t-lg flex items-center gap-2 text-white"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button 
                onClick={() => { onDelete(trade.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-600 rounded-b-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {trade.conditions.map((condition, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {condition.confirmed ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <X className="w-4 h-4 text-red-400" />
            )}
            <span className="text-slate-300 text-sm">
              {condition.name}: {condition.confirmed ? 'Confirmed' : 
                <span className="text-red-400">NOT CONFIRMED</span>
              }
            </span>
          </div>
        ))}
      </div>

      <div className={`mb-2 ${getResultColor()} font-medium`}>
        Result: {trade.result}
      </div>

      <div className="text-slate-400 text-sm italic">
        Reason: {trade.reason}
      </div>
    </div>
  );
};

const AddTradeModal = ({ isOpen, onClose, onSave, editTrade }) => {
  const [formData, setFormData] = useState({
    symbol: 'EUR/USD',
    type: 'CALL',
    time: '',
    reason: '',
    result: 'WIN',
    conditions: [
      { name: '5 Minute Seller Candle with lower wick', confirmed: true },
      { name: 'Rectangle draw on lower wick (closing price on seller)', confirmed: true },
      { name: 'Market box mein enter hone ki koshish kre toh Trade place', confirmed: true },
      { name: 'Optional condition', confirmed: true }
    ]
  });

  useEffect(() => {
    if (editTrade) {
      setFormData(editTrade);
    } else {
      setFormData({
        symbol: 'EUR/USD',
        type: 'CALL',
        time: '',
        reason: '',
        result: 'WIN',
        conditions: [
          { name: '5 Minute Seller Candle with lower wick', confirmed: true },
          { name: 'Rectangle draw on lower wick (closing price on seller)', confirmed: true },
          { name: 'Market box mein enter hone ki koshish kre toh Trade place', confirmed: true },
          { name: 'Optional condition', confirmed: true }
        ]
      });
    }
  }, [editTrade, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { name: `Condition ${formData.conditions.length + 1}`, confirmed: true }]
    });
  };

  const removeCondition = (idx) => {
    const newConditions = formData.conditions.filter((_, i) => i !== idx);
    setFormData({ ...formData, conditions: newConditions });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{editTrade ? 'Edit Trade' : 'Add New Trade'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Currency Pair</label>
              <select
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              >
                <option value="EUR/USD">EUR/USD</option>
                <option value="USD/JPY">USD/JPY</option>
                <option value="EUR/JPY">EUR/JPY</option>
                <option value="AUD/JPY">AUD/JPY</option>
                <option value="GBP/USD">GBP/USD</option>
                <option value="USD/CHF">USD/CHF</option>
                <option value="AUD/USD">AUD/USD</option>
                <option value="NZD/USD">NZD/USD</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="CALL">CALL</option>
                  <option value="PUT">PUT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Result</label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({...formData, result: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="WIN">WIN</option>
                <option value="LOSS">LOSS</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-300">Conditions</label>
                <button
                  type="button"
                  onClick={addCondition}
                  className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
              {formData.conditions.map((cond, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={cond.confirmed}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[idx].confirmed = e.target.checked;
                      setFormData({...formData, conditions: newConditions});
                    }}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <input
                    type="text"
                    value={cond.name}
                    onChange={(e) => {
                      const newConditions = [...formData.conditions];
                      newConditions[idx].name = e.target.value;
                      setFormData({...formData, conditions: newConditions});
                    }}
                    className="flex-1 bg-slate-700 rounded px-2 py-1 text-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Condition name"
                  />
                  {formData.conditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCondition(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">Reason</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full bg-slate-700 rounded-lg px-3 py-2 text-white h-20 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                placeholder="Trade reason..."
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                {editTrade ? 'Update Trade' : 'Add Trade'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PlannerView = () => {
  const [plannerData, setPlannerData] = useState({
    rules: '',
    strategy: '1. Candle hammer nahi honi chahiye\n2. Seller k baad agar fir koi buyer ki candle hai toh vaha strategy kaam nahi karegi jo humara perfect setup nahi hoga\n3. Practice kro pahle atleast 100 trades lo demo par\n4. ',
    goals: ''
  });

  useEffect(() => {
    const loadPlanner = async () => {
      try {
        const result = await window.storage.get('trading-journal-planner');
        if (result && result.value) {
          setPlannerData(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('Planner data not available');
      }
    };
    loadPlanner();
  }, []);

  useEffect(() => {
    const savePlanner = async () => {
      try {
        await window.storage.set('trading-journal-planner', JSON.stringify(plannerData));
      } catch (error) {
        console.log('Storage not available');
      }
    };
    savePlanner();
  }, [plannerData]);

  return (
    <div className="px-4 pt-6 pb-24">
      <h2 className="text-2xl font-bold mb-6">Trading Planner</h2>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-slate-300 mb-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">My Trading Rules</span>
          </label>
          <textarea
            value={plannerData.rules}
            onChange={(e) => setPlannerData({...plannerData, rules: e.target.value})}
            className="w-full bg-slate-800/50 rounded-lg px-4 py-3 text-white h-32 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="Write your trading rules here..."
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-slate-300 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">Strategy Notes</span>
          </label>
          <textarea
            value={plannerData.strategy}
            onChange={(e) => setPlannerData({...plannerData, strategy: e.target.value})}
            className="w-full bg-slate-800/50 rounded-lg px-4 py-3 text-white h-32 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="Document your trading strategies..."
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-slate-300 mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">Goals & Targets</span>
          </label>
          <textarea
            value={plannerData.goals}
            onChange={(e) => setPlannerData({...plannerData, goals: e.target.value})}
            className="w-full bg-slate-800/50 rounded-lg px-4 py-3 text-white h-32 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="Set your trading goals..."
          />
        </div>

        <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
          <h3 className="font-medium text-slate-300 mb-2">Quick Tips</h3>
          <ul className="text-sm text-slate-400 space-y-1">
            <li>• Always follow your predefined rules</li>
            <li>• Review your trades daily</li>
            <li>• Focus on process over profits</li>
            <li>• Keep emotions in check</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const CalendarView = ({ trades, selectedDate, onDateSelect, onViewTrades }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${monthNames[currentMonth]} ${i}, ${currentYear}`;
      const dayTrades = trades.filter(t => t.date === dateStr);
      days.push({
        date: i,
        fullDate: dateStr,
        hasActivity: dayTrades.length > 0,
        tradeCount: dayTrades.length,
        trades: dayTrades
      });
    }
    return days;
  };

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    if (day && day.hasActivity) {
      onViewTrades(day.fullDate, day.trades);
    }
  };

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <button onClick={previousMonth} className="text-white hover:text-emerald-400 p-2">
          ←
        </button>
        <h2 className="text-2xl font-bold">{monthNames[currentMonth]} {currentYear}</h2>
        <button onClick={nextMonth} className="text-white hover:text-emerald-400 p-2">
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-slate-400 text-sm py-2">
            {day}
          </div>
        ))}
        {getDaysInMonth().map((day, idx) => (
          <button
            key={idx}
            onClick={() => handleDateClick(day)}
            disabled={!day}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center relative ${
              !day ? '' :
              selectedDate === day.fullDate
                ? 'bg-emerald-600 text-white'
                : day.hasActivity
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'text-slate-500 hover:bg-slate-800'
            }`}
          >
            {day && (
              <>
                <span>{day.date}</span>
                {day.hasActivity && (
                  <span className="text-xs mt-1 opacity-75">{day.tradeCount}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const StatsView = ({ trades }) => {
  const wins = trades.filter(t => t.result === 'WIN');
  const losses = trades.filter(t => t.result === 'LOSS');
  
  const winRate = trades.length > 0 ? ((wins.length / trades.length) * 100).toFixed(1) : 0;

  const exportData = () => {
    const dataStr = JSON.stringify(trades, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'trading-journal-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Statistics</h2>
        <button
          onClick={exportData}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Total Trades</div>
          <div className="text-3xl font-bold">{trades.length}</div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="text-slate-400 text-sm mb-1">Win Rate</div>
          <div className="text-3xl font-bold text-emerald-400">{winRate}%</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-slate-300 text-sm">Wins</div>
              <div className="text-2xl font-bold text-emerald-400">{wins.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-red-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <X className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-slate-300 text-sm">Losses</div>
              <div className="text-2xl font-bold text-red-400">{losses.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeView = () => {
  return (
    <div className="px-4 pt-6 pb-24">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">Welcome Back!</h3>
          <p className="text-emerald-100 text-sm">Track your trading journey and improve your performance</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <BookOpen className="w-8 h-8 text-emerald-400 mb-2" />
            <div className="text-slate-400 text-sm">Quick Access</div>
            <div className="text-lg font-bold">Journal</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4">
            <Target className="w-8 h-8 text-blue-400 mb-2" />
            <div className="text-slate-400 text-sm">Plan Ahead</div>
            <div className="text-lg font-bold">Planner</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4">
            <Calendar className="w-8 h-8 text-purple-400 mb-2" />
            <div className="text-slate-400 text-sm">View History</div>
            <div className="text-lg font-bold">Calendar</div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-4">
            <BarChart3 className="w-8 h-8 text-orange-400 mb-2" />
            <div className="text-slate-400 text-sm">Performance</div>
            <div className="text-lg font-bold">Statistics</div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <h3 className="font-medium text-slate-300 mb-3">Today's Focus</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Review your trading rules
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Log all trades immediately
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              Analyze your performance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  const [followedRules, setFollowedRules] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [activeTab, setActiveTab] = useState('journal');
  const [trades, setTrades] = useState([]);
  const [viewingCalendarTrades, setViewingCalendarTrades] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get('trading-journal-trades');
        if (result && result.value) {
          setTrades(JSON.parse(result.value));
        } else {
          const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          setTrades([
            {
              id: 1,
              date: today,
              symbol: 'EUR/USD',
              type: 'CALL',
              time: '09:45',
              conditions: [
                { name: '5 Minute Seller Candle with lower wick', confirmed: true },
                { name: 'Rectangle draw on lower wick (closing price on seller)', confirmed: true },
                { name: 'Market box mein enter hone ki koshish kre toh Trade place', confirmed: true },
                { name: 'Optional condition', confirmed: false }
              ],
              result: 'WIN',
              reason: 'Perfect setup with all conditions met.'
            },
            {
              id: 2,
              date: today,
              symbol: 'USD/JPY',
              type: 'PUT',
              time: '11:00',
              conditions: [
                { name: '5 Minute Seller Candle with lower wick', confirmed: true },
                { name: 'Rectangle draw on lower wick (closing price on seller)', confirmed: false },
                { name: 'Market box mein enter hone ki koshish kre toh Trade place', confirmed: true }
              ],
              result: 'LOSS',
              reason: 'Rectangle condition not properly confirmed.'
            },
            {
              id: 3,
              date: today,
              symbol: 'EUR/JPY',
              type: 'CALL',
              time: '13:35',
              conditions: [
                { name: '5 Minute Seller Candle with lower wick', confirmed: true },
                { name: 'Rectangle draw on lower wick (closing price on seller)', confirmed: true },
                { name: 'Market box mein enter hone ki koshish kre toh Trade place', confirmed: true }
              ],
              result: 'WIN',
              reason: 'Clean setup with proper market box entry.'
            }
          ]);
        }
      } catch (error) {
        console.log('Storage not available, using default data');
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        setTrades([
          {
            id: 1,
            date: today,
            symbol: 'EUR/USD',
            type: 'CALL',
            time: '09:45',
            conditions: [
              { name: '5 Minute Seller Candle with lower wick', confirmed: true },
              { name: 'Rectangle draw on lower wick (closing price on seller)', confirmed: true },
              { name: 'Market box mein enter hone ki koshish kre toh Trade place', confirmed: false }
            ],
            result: 'WIN',
            reason: 'Perfect setup with all conditions met.'
          }
        ]);
      }

      try {
        const rulesResult = await window.storage.get('trading-journal-rules');
        if (rulesResult && rulesResult.value) {
          setFollowedRules(JSON.parse(rulesResult.value));
        }
      } catch (error) {
        console.log('Rules not loaded');
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await window.storage.set('trading-journal-trades', JSON.stringify(trades));
      } catch (error) {
        console.log('Storage not available');
      }
    };

    if (trades.length > 0) {
      saveData();
    }
  }, [trades]);

  useEffect(() => {
    const saveRules = async () => {
      if (followedRules !== null) {
        try {
          await window.storage.set('trading-journal-rules', JSON.stringify(followedRules));
        } catch (error) {
          console.log('Storage not available');
        }
      }
    };

    saveRules();
  }, [followedRules]);

  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateNum = date.getDate();
      const fullDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const dayTrades = trades.filter(t => t.date === fullDate);
      
      days.push({
        day: dayName.charAt(0),
        date: dateNum,
        fullDate: fullDate,
        hasActivity: dayTrades.length > 0,
        hasMultiple: dayTrades.length > 1
      });
    }
    
    return days;
  };

  const weekDays = getWeekDays();

  const currentDateTrades = trades.filter(t => t.date === selectedDate);

  const stats = {
    wins: currentDateTrades.filter(t => t.result === 'WIN').length,
    losses: currentDateTrades.filter(t => t.result === 'LOSS').length
  };

  const handleAddTrade = (tradeData) => {
    if (editingTrade) {
      setTrades(trades.map(t => t.id === editingTrade.id ? {...tradeData, id: editingTrade.id, date: editingTrade.date} : t));
      setEditingTrade(null);
    } else {
      const newTrade = {
        ...tradeData,
        id: Date.now(),
        date: selectedDate
      };
      setTrades([newTrade, ...trades]);
    }
  };

  const handleDeleteTrade = (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  const handleEditTrade = (trade) => {
    setEditingTrade(trade);
    setShowModal(true);
  };

  const handleViewCalendarTrades = (date, trades) => {
    setViewingCalendarTrades({ date, trades });
  };

  const handleBackFromCalendarTrades = () => {
    setViewingCalendarTrades(null);
  };

  const renderContent = () => {
    if (activeTab === 'home') {
      return <HomeView />;
    }

    if (activeTab === 'planner') {
      return <PlannerView />;
    }
    
    if (activeTab === 'calendar') {
      if (viewingCalendarTrades) {
        return (
          <div className="px-4 pt-6 pb-24">
            <button 
              onClick={handleBackFromCalendarTrades}
              className="mb-4 text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
            >
              ← Back to Calendar
            </button>
            <h2 className="text-2xl font-bold mb-4">{viewingCalendarTrades.date}</h2>
            <div className="mb-4">
              <span className="text-slate-400 text-sm">● {viewingCalendarTrades.trades.length} trades</span>
            </div>
            {viewingCalendarTrades.trades.map((trade) => (
              <TradeCard 
                key={trade.id} 
                trade={trade} 
                onDelete={handleDeleteTrade}
                onEdit={handleEditTrade}
              />
            ))}
          </div>
        );
      }
      return <CalendarView trades={trades} selectedDate={selectedDate} onDateSelect={setSelectedDate} onViewTrades={handleViewCalendarTrades} />;
    }
    
    if (activeTab === 'stats') {
      return <StatsView trades={trades} />;
    }

    return (
      <>
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Trading Journal</h1>
            <button 
              onClick={() => { setEditingTrade(null); setShowModal(true); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Trade
            </button>
          </div>

          <div className="flex justify-between mb-6 overflow-x-auto pb-2">
            {weekDays.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDate(day.fullDate)}
                className="flex flex-col items-center relative flex-shrink-0"
              >
                <span className="text-slate-400 text-sm mb-1">{day.day}</span>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-colors ${
                    selectedDate === day.fullDate
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {day.date}
                </div>
                {day.hasMultiple && (
                  <div className="flex gap-0.5 mt-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                  </div>
                )}
                {day.hasActivity && !day.hasMultiple && (
                  <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">Trades for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}:</h2>
              <span className="text-slate-400 text-sm">● {currentDateTrades.length} trades</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-emerald-500/20 text-emerald-400 rounded-lg p-3">
                <Check className="w-5 h-5 mb-1" />
                <div className="text-xs opacity-75">Wins</div>
                <div className="text-xl font-bold">{stats.wins}</div>
              </div>
              
              <div className="bg-red-500/20 text-red-400 rounded-lg p-3">
                <X className="w-5 h-5 mb-1" />
                <div className="text-xs opacity-75">Losses</div>
                <div className="text-xl font-bold">{stats.losses}</div>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-lg p-3 flex items-center justify-between">
              <span className="text-slate-300">Did I follow my rules today?</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFollowedRules(true)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    followedRules === true
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFollowedRules(false)}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    followedRules === false
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pb-24">
          {currentDateTrades.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No trades for this date. Click "Add Trade" to get started!</p>
            </div>
          ) : (
            currentDateTrades.map((trade) => (
              <TradeCard 
                key={trade.id} 
                trade={trade} 
                onDelete={handleDeleteTrade}
                onEdit={handleEditTrade}
              />
            ))
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {renderContent()}

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-3">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('planner')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'planner' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Planner</span>
          </button>
          <button 
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'journal' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Journal</span>
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'calendar' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Calendar</span>
          </button>
          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'stats' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Stats</span>
          </button>
        </div>
      </div>

      <AddTradeModal 
        isOpen={showModal} 
        onClose={() => { setShowModal(false); setEditingTrade(null); }}
        onSave={handleAddTrade}
        editTrade={editingTrade}
      />
    </div>
  );
}
