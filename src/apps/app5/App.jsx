import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Download, Search, Filter, Tag, TrendingUp, TrendingDown } from 'lucide-react';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('daily');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: new Date(),
      symbol: 'AAPL',
      type: 'Long',
      entry: 175.50,
      exit: 178.20,
      quantity: 100,
      pnl: 270,
      notes: 'Breakout above resistance',
      tags: ['Momentum', 'Tech'],
      setup: 'Bull Flag',
      timeframe: '15m'
    },
    {
      id: 2,
      date: new Date(),
      symbol: 'TSLA',
      type: 'Short',
      entry: 242.80,
      exit: 238.50,
      quantity: 50,
      pnl: 215,
      notes: 'Failed to break high',
      tags: ['Reversal'],
      setup: 'Double Top',
      timeframe: '1h'
    }
  ]);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'Long',
    entry: '',
    exit: '',
    quantity: '',
    notes: '',
    tags: [],
    setup: '',
    timeframe: '15m'
  });

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const calculateStats = () => {
    const totalPnL = entries.reduce((sum, entry) => sum + entry.pnl, 0);
    const wins = entries.filter(e => e.pnl > 0).length;
    const losses = entries.filter(e => e.pnl < 0).length;
    const winRate = entries.length > 0 ? ((wins / entries.length) * 100).toFixed(1) : 0;
    return { totalPnL, wins, losses, winRate, total: entries.length };
  };

  const stats = calculateStats();

  const handleAddEntry = () => {
    if (formData.symbol && formData.entry && formData.exit && formData.quantity) {
      const pnl = (parseFloat(formData.exit) - parseFloat(formData.entry)) * parseInt(formData.quantity) * (formData.type === 'Long' ? 1 : -1);
      const newEntry = {
        id: Date.now(),
        date: selectedDate,
        ...formData,
        entry: parseFloat(formData.entry),
        exit: parseFloat(formData.exit),
        quantity: parseInt(formData.quantity),
        pnl: parseFloat(pnl.toFixed(2))
      };
      setEntries([...entries, newEntry]);
      setFormData({
        symbol: '',
        type: 'Long',
        entry: '',
        exit: '',
        quantity: '',
        notes: '',
        tags: [],
        setup: '',
        timeframe: '15m'
      });
      setShowAddEntry(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <DateNavigation
          selectedDate={selectedDate}
          navigateDate={navigateDate}
          formatDate={formatDate}
          view={view}
          setView={setView}
          setShowAddEntry={setShowAddEntry}
        />
        <StatsPanel stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <EntriesTable entries={entries} />
          </div>
          <div className="space-y-6">
            <TradingPlanner />
            <QuickStats stats={stats} />
          </div>
        </div>
      </div>
      {showAddEntry && (
        <AddEntryModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowAddEntry(false)}
          onSave={handleAddEntry}
        />
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Trading Journal</h1>
              <p className="text-sm text-gray-500">Track and analyze your trades</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateNavigation({ selectedDate, navigateDate, formatDate, view, setView, setShowAddEntry }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold text-gray-900">{formatDate(selectedDate)}</span>
          </div>
          <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
          <button className="px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Today
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('daily')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${view === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setView('weekly')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${view === 'weekly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md ${view === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
            >
              Monthly
            </button>
          </div>
          <button
            onClick={() => setShowAddEntry(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsPanel({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <StatCard
        label="Total P&L"
        value={`$${stats.totalPnL.toFixed(2)}`}
        trend={stats.totalPnL >= 0 ? 'up' : 'down'}
        color={stats.totalPnL >= 0 ? 'green' : 'red'}
      />
      <StatCard
        label="Win Rate"
        value={`${stats.winRate}%`}
        subtitle={`${stats.wins}W / ${stats.losses}L`}
        color="blue"
      />
      <StatCard
        label="Total Trades"
        value={stats.total}
        color="purple"
      />
      <StatCard
        label="Avg Win"
        value="$242.50"
        color="indigo"
      />
    </div>
  );
}

function StatCard({ label, value, subtitle, trend, color }) {
  const colorClasses = {
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    indigo: 'bg-indigo-50 text-indigo-700'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {trend === 'up' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
        )}
      </div>
    </div>
  );
}

function EntriesTable({ entries }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Trade Entries</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">P&L</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Setup</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-semibold text-gray-900">{entry.symbol}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${entry.type === 'Long' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {entry.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">${entry.entry.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">${entry.exit.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{entry.quantity}</td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${entry.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${entry.pnl.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{entry.setup}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TradingPlanner() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review market news', completed: true },
    { id: 2, text: 'Check economic calendar', completed: true },
    { id: 3, text: 'Analyze top movers', completed: false },
    { id: 4, text: 'Review yesterday trades', completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Trading Planner</h3>
        <button className="text-blue-600 hover:text-blue-700">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStats({ stats }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Best Trade</span>
          <span className="text-sm font-semibold text-green-600">+$270.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Worst Trade</span>
          <span className="text-sm font-semibold text-red-600">-$0.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Avg Hold Time</span>
          <span className="text-sm font-semibold text-gray-900">2h 15m</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Profit Factor</span>
          <span className="text-sm font-semibold text-gray-900">2.45</span>
        </div>
      </div>
    </div>
  );
}

function AddEntryModal({ formData, setFormData, onClose, onSave }) {
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Trade Entry</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AAPL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Long</option>
                <option>Short</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.entry}
                onChange={(e) => updateField('entry', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exit Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.exit}
                onChange={(e) => updateField('exit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Setup</label>
              <input
                type="text"
                value={formData.setup}
                onChange={(e) => updateField('setup', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bull Flag"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                value={formData.timeframe}
                onChange={(e) => updateField('timeframe', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>1m</option>
                <option>5m</option>
                <option>15m</option>
                <option>1h</option>
                <option>4h</option>
                <option>1D</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Trade notes and observations..."
            />
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Entry
          </button>
        </div>
      </div>
    </div>
  );
}
