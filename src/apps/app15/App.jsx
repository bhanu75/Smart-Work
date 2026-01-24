import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import confetti from 'canvas-confetti';

// ===== TYPES =====
const TARGET_PRESETS = [
  { days: 7, label: "7 Days", emoji: "🔥" },
  { days: 21, label: "21 Days", emoji: "⭐" },
  { days: 30, label: "30 Days", emoji: "💪" },
  { days: 60, label: "60 Days", emoji: "🏆" },
  { days: 90, label: "90 Days", emoji: "👑" },
  { days: 180, label: "180 Days", emoji: "💎" }
];

const MILESTONES = [
  { days: 7, label: "Week Warrior", emoji: "🔥" },
  { days: 14, label: "Two Week Champ", emoji: "💪" },
  { days: 21, label: "Habit Former", emoji: "⭐" },
  { days: 30, label: "Month Master", emoji: "🏆" },
  { days: 60, label: "Double Month", emoji: "👑" },
  { days: 90, label: "Quarter Legend", emoji: "💎" },
  { days: 100, label: "Century Club", emoji: "🎯" },
  { days: 180, label: "Half Year Hero", emoji: "🚀" }
];

// ===== DATE UTILS =====
const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const getDaysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

const isToday = (date) => date === getToday();
const isYesterday = (date) => date === getDaysAgo(1);

// ===== STREAK LOGIC =====
const calcStreak = (checkIns) => {
  if (!checkIns.length) return { current: 0, longest: 0, total: 0 };
  
  const unique = [...new Set(checkIns)].sort().reverse();
  const today = getToday();
  const lastDate = unique[0];
  
  // Current streak
  let current = 0;
  if (isToday(lastDate) || isYesterday(lastDate)) {
    let checkDate = isToday(lastDate) ? today : lastDate;
    for (const d of unique) {
      if (d === checkDate) {
        current++;
        const dt = new Date(checkDate);
        dt.setDate(dt.getDate() - 1);
        checkDate = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
      } else break;
    }
  }
  
  // Longest streak
  const asc = [...unique].reverse();
  let longest = 1, temp = 1;
  for (let i = 1; i < asc.length; i++) {
    const d1 = new Date(asc[i-1]);
    const d2 = new Date(asc[i]);
    const diff = Math.floor((d2 - d1) / 86400000);
    if (diff === 1) {
      temp++;
      longest = Math.max(longest, temp);
    } else temp = 1;
  }
  
  return { current, longest, total: unique.length };
};

// ===== STORE =====
const useStore = create((set, get) => ({
  habits: [],
  activeId: null,
  
  init: () => {
    const data = localStorage.getItem('habits');
    if (data) {
      const parsed = JSON.parse(data);
      set(parsed);
    }
  },
  
  save: () => {
    const state = get();
    localStorage.setItem('habits', JSON.stringify({
      habits: state.habits,
      activeId: state.activeId
    }));
  },
  
  addHabit: (name, emoji, target) => {
    const h = {
      id: Date.now().toString(),
      name,
      emoji,
      target,
      checkIns: []
    };
    set(s => ({ habits: [...s.habits, h], activeId: h.id }));
    get().save();
  },
  
  deleteHabit: (id) => {
    set(s => {
      const newHabits = s.habits.filter(h => h.id !== id);
      return {
        habits: newHabits,
        activeId: s.activeId === id ? (newHabits[0]?.id || null) : s.activeId
      };
    });
    get().save();
  },
  
  setActive: (id) => {
    set({ activeId: id });
    get().save();
  },
  
  toggleCheckIn: (id) => {
    const today = getToday();
    set(s => ({
      habits: s.habits.map(h => {
        if (h.id !== id) return h;
        const has = h.checkIns.includes(today);
        return {
          ...h,
          checkIns: has ? h.checkIns.filter(d => d !== today) : [...h.checkIns, today]
        };
      })
    }));
    get().save();
  },
  
  updateHabit: (id, updates) => {
    set(s => ({
      habits: s.habits.map(h => h.id === id ? { ...h, ...updates } : h)
    }));
    get().save();
  },
  
  exportJSON: () => {
    const data = JSON.stringify(get(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habits-${getToday()}.json`;
    a.click();
  },
  
  importJSON: (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        set(data);
        get().save();
        showToast('✅ Import successful!', 'success');
      } catch {
        showToast('❌ Invalid file', 'error');
      }
    };
    reader.readAsText(file);
  }
}));

// ===== TOAST =====
let toastTimeout;
const ToastContainer = ({ toast, setToast }) => {
  if (!toast) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
      toast.type === 'success' ? 'bg-green-500' : 
      toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white font-medium`}>
      {toast.message}
    </div>
  );
};

let setGlobalToast;
const showToast = (message, type = 'info') => {
  if (setGlobalToast) {
    setGlobalToast({ message, type });
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => setGlobalToast(null), 3000);
  }
};

// ===== CONFETTI =====
const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
};

// ===== COMPONENTS =====
const CheckInButton = ({ habit, onCheckIn }) => {
  const today = getToday();
  const isChecked = habit.checkIns.includes(today);
  const streak = calcStreak(habit.checkIns);
  const prevStreak = streak.current;
  
  const handleClick = () => {
    const willCheck = !isChecked;
    onCheckIn(habit.id);
    
    if (willCheck) {
      fireConfetti();
      const newStreak = prevStreak + 1;
      const milestone = MILESTONES.find(m => m.days === newStreak);
      if (milestone) {
        showToast(`🎉 ${milestone.label} unlocked!`, 'success');
      } else {
        showToast(`🔥 Day ${newStreak} done!`, 'success');
      }
    } else {
      showToast('Check-in removed', 'info');
    }
  };
  
  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
        isChecked 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl'
      }`}
    >
      {isChecked ? '✓ Completed Today' : '+ Check In Today'}
    </button>
  );
};

const StreakCard = ({ habit }) => {
  const streak = calcStreak(habit.checkIns);
  const progress = Math.min((streak.total / habit.target) * 100, 100);
  
  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
      <div className="text-center">
        <div className="text-7xl mb-4 animate-bounce">{habit.emoji}</div>
        <h2 className="text-3xl font-bold mb-2">{habit.name}</h2>
        <div className="text-6xl font-extrabold mb-4">{streak.current}</div>
        <div className="text-xl opacity-90">Day Streak 🔥</div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-sm opacity-80">Longest</div>
          <div className="text-2xl font-bold">{streak.longest}</div>
        </div>
        <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
          <div className="text-sm opacity-80">Total</div>
          <div className="text-2xl font-bold">{streak.total}</div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{streak.total} / {habit.target} days</span>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const Calendar = ({ habit }) => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    days.push(getDaysAgo(i));
  }
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold text-lg mb-4">Last 30 Days</h3>
      <div className="grid grid-cols-10 gap-2">
        {days.map(day => {
          const isChecked = habit.checkIns.includes(day);
          const isToday_ = isToday(day);
          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${
                isChecked 
                  ? 'bg-green-500 text-white scale-110' 
                  : isToday_ 
                    ? 'border-2 border-blue-500' 
                    : 'bg-gray-100'
              }`}
            >
              {isChecked && '✓'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Milestones = ({ habit }) => {
  const streak = calcStreak(habit.checkIns);
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-bold text-lg mb-4">Milestones</h3>
      <div className="space-y-3">
        {MILESTONES.map(m => {
          const achieved = streak.longest >= m.days;
          return (
            <div 
              key={m.days}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                achieved ? 'bg-gradient-to-r from-yellow-100 to-amber-100' : 'bg-gray-50'
              }`}
            >
              <div className={`text-2xl ${achieved ? 'scale-110' : 'grayscale opacity-50'}`}>
                {m.emoji}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${achieved ? 'text-amber-700' : 'text-gray-400'}`}>
                  {m.label}
                </div>
                <div className="text-sm text-gray-500">{m.days} days</div>
              </div>
              {achieved && <div className="text-green-500 font-bold">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ===== MODALS =====
const NewHabitModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [target, setTarget] = useState(21);
  const [custom, setCustom] = useState('');
  
  const emojis = ['🏋️', '📚', '💧', '🧘', '🏃', '🎯', '💪', '🎨', '🎵', '🌱'];
  
  const handleCreate = () => {
    if (!name.trim()) {
      showToast('Please enter habit name', 'error');
      return;
    }
    onCreate(name, emoji, target);
    showToast('🎉 Habit created!', 'success');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Create New Habit</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Workout"
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Choose Emoji</label>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map(e => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`text-3xl p-3 rounded-xl transition-all ${
                    emoji === e ? 'bg-blue-100 scale-110' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Target Days</label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {TARGET_PRESETS.map(p => (
                <button
                  key={p.days}
                  onClick={() => setTarget(p.days)}
                  className={`py-2 rounded-xl text-sm font-medium transition-all ${
                    target === p.days 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {p.emoji} {p.days}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setTarget(parseInt(e.target.value) || 21);
              }}
              placeholder="Custom days"
              className="w-full px-4 py-2 border-2 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

const ImportExportModal = ({ onClose, onExport, onImport }) => {
  const fileRef = React.useRef();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Backup & Restore</h2>
        
        <div className="space-y-4">
          <button
            onClick={() => { onExport(); showToast('📥 Data exported!', 'success'); }}
            className="w-full py-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
          >
            📥 Export Data (JSON)
          </button>
          
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600"
          >
            📤 Import Data (JSON)
          </button>
          
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onImport(e.target.files[0]);
                onClose();
              }
            }}
          />
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ===== MAIN APP =====
export default function App() {
  const { habits, activeId, init, addHabit, deleteHabit, setActive, toggleCheckIn, updateHabit, exportJSON, importJSON } = useStore();
  const [showNewHabit, setShowNewHabit] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [toast, setToast] = useState(null);
  
  useEffect(() => {
    init();
    setGlobalToast = setToast;
  }, []);
  
  const activeHabit = habits.find(h => h.id === activeId);
  
  if (!habits.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-3xl font-bold mb-4">Habit Streak Tracker</h1>
          <p className="text-gray-600 mb-8">Build consistency, track progress, and achieve your goals one day at a time.</p>
          <button
            onClick={() => setShowNewHabit(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            + Create Your First Habit
          </button>
        </div>
        
        {showNewHabit && (
          <NewHabitModal
            onClose={() => setShowNewHabit(false)}
            onCreate={addHabit}
          />
        )}
        <ToastContainer toast={toast} setToast={setToast} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🎯 Habit Tracker</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportExport(true)}
              className="px-4 py-2 bg-white rounded-xl shadow hover:shadow-lg transition-all"
            >
              💾
            </button>
            <button
              onClick={() => setShowNewHabit(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
            >
              + New
            </button>
          </div>
        </div>
        
        {/* Habit Selector */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {habits.map(h => (
            <button
              key={h.id}
              onClick={() => setActive(h.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                h.id === activeId 
                  ? 'bg-white shadow-lg scale-105' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            >
              <span className="text-2xl">{h.emoji}</span>
              <span>{h.name}</span>
            </button>
          ))}
        </div>
        
        {activeHabit && (
          <div className="space-y-6">
            <StreakCard habit={activeHabit} />
            <CheckInButton habit={activeHabit} onCheckIn={toggleCheckIn} />
            <Calendar habit={activeHabit} />
            <Milestones habit={activeHabit} />
            
            {/* Edit/Delete */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const newName = prompt('New name:', activeHabit.name);
                  if (newName) {
                    updateHabit(activeHabit.id, { name: newName });
                    showToast('✏️ Habit updated!', 'success');
                  }
                }}
                className="flex-1 py-3 bg-gray-200 rounded-xl font-medium hover:bg-gray-300"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this habit?')) {
                    deleteHabit(activeHabit.id);
                    showToast('🗑️ Habit deleted', 'info');
                  }
                }}
                className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>
      
      {showNewHabit && (
        <NewHabitModal
          onClose={() => setShowNewHabit(false)}
          onCreate={addHabit}
        />
      )}
      
      {showImportExport && (
        <ImportExportModal
          onClose={() => setShowImportExport(false)}
          onExport={exportJSON}
          onImport={importJSON}
        />
      )}
      
      <ToastContainer toast={toast} setToast={setToast} />
    </div>
  );
}
