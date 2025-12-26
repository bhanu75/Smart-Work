import React, { useState } from 'react';
import { Home, ChevronLeft, ChevronRight, Calendar, Plus, X } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('planner');
  const [selectedDate] = useState(new Date(2024, 3, 24));
  const [showExportModal, setShowExportModal] = useState(false);
  
  const [events] = useState([
    {
      id: 1,
      title: 'Project Meeting',
      location: 'Office Conference Room',
      time: '9:00 am',
      category: 'Work',
      color: 'bg-[#E8B4A0]',
      icon: '📄',
      completed: true
    },
    {
      id: 2,
      title: 'Vet Appointment',
      location: 'City Animal Clinic',
      time: '10:00 am',
      category: 'Personal',
      color: 'bg-[#A8C5A8]',
      icon: '⚙️',
      completed: true
    },
    {
      id: 3,
      title: 'Lunch with Sam',
      location: 'Cafe Delight',
      time: '11:00 am',
      category: 'Meetings',
      color: 'bg-[#A8C5D5]',
      icon: '🍽️',
      completed: true
    },
    {
      id: 4,
      title: 'Gym Session',
      location: '',
      time: '1:00 pm',
      category: 'Health',
      color: 'bg-[#E8B4B4]',
      icon: '💪',
      completed: false
    }
  ]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getDayNumber = (offset) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    return date.getDate();
  };

  const getDayName = (offset) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-5 gap-5 flex-wrap">
      {currentView === 'planner' && (
        <DailyPlanner 
          events={events}
          selectedDate={selectedDate}
          formatDate={formatDate}
          onAddEntry={() => setCurrentView('schedule')}
          onNavigateToDaily={() => setCurrentView('daily')}
        />
      )}

      {currentView === 'schedule' && (
        <ScheduleInput 
          events={events}
          selectedDate={selectedDate}
          onBack={() => setCurrentView('planner')}
          getDayName={getDayName}
          getDayNumber={getDayNumber}
        />
      )}

      {currentView === 'daily' && (
        <DailyView 
          events={events}
          selectedDate={selectedDate}
          getDayName={getDayName}
          getDayNumber={getDayNumber}
          onBack={() => setCurrentView('planner')}
          onOpenExport={() => {
            setCurrentView('export');
            setShowExportModal(true);
          }}
        />
      )}

      {currentView === 'export' && showExportModal && (
        <ExportOptions 
          onClose={() => {
            setShowExportModal(false);
            setCurrentView('daily');
          }}
        />
      )}
    </div>
  );
}

function DailyPlanner({ events, selectedDate, formatDate, onAddEntry, onNavigateToDaily }) {
  return (
    <div className="w-[390px] h-[844px] bg-[#EFEBE7] rounded-[30px] overflow-hidden relative shadow-xl">
      <StatusBar />
      
      <div className="px-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[32px] font-semibold text-[#2B2B2B]">Daily Planner</h1>
          <button className="p-2">
            <Home size={20} color="#5A5A5A" />
          </button>
        </div>

        <div className="flex justify-between items-center mb-5">
          <span className="text-base text-[#5A5A5A]">{formatDate(selectedDate)}</span>
          <button 
            onClick={onNavigateToDaily}
            className="flex items-center gap-1.5 border border-[#D0D0D0] rounded-lg px-3 py-2"
          >
            <Calendar size={18} color="#5A5A5A" />
            <span className="text-sm text-[#5A5A5A]">Today</span>
          </button>
        </div>
      </div>

      <button 
        onClick={onAddEntry}
        className="flex items-center gap-2.5 w-[calc(100%-40px)] mx-5 mb-5 p-4 bg-[#E8E4DF] rounded-xl"
      >
        <Plus size={20} color="#8FA88F" />
        <span className="text-base text-[#8FA88F]">Add New Entry</span>
      </button>

      <div className="px-5 overflow-y-auto max-h-[500px]">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function ScheduleInput({ events, onBack, getDayName, getDayNumber }) {
  return (
    <div className="w-[390px] h-[844px] bg-[#EFEBE7] rounded-[30px] overflow-hidden relative shadow-xl">
      <StatusBar />
      
      <div className="px-5">
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="p-2">
            <ChevronLeft size={24} color="#5A5A5A" />
          </button>
          <h2 className="text-lg font-semibold text-[#2B2B2B] flex-1 text-center mr-10">
            Add New Entry
          </h2>
        </div>
      </div>

      <DateSelector getDayName={getDayName} getDayNumber={getDayNumber} />

      <div className="px-5 overflow-y-auto max-h-[550px]">
        {events.map(event => (
          <TimelineItem key={event.id} event={event} />
        ))}
        
        {['2:00 pm', '3:00 pm', '4:00 pm'].map(time => (
          <div key={time} className="flex gap-3 mb-4">
            <span className="text-sm text-[#5A5A5A] min-w-[70px] pt-1">{time}</span>
          </div>
        ))}
      </div>

      <FloatingButton />
    </div>
  );
}

function DailyView({ events, getDayName, getDayNumber, onBack, onOpenExport }) {
  return (
    <div className="w-[390px] h-[844px] bg-[#EFEBE7] rounded-[30px] overflow-hidden relative shadow-xl">
      <StatusBar />
      
      <div className="px-5">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onBack} className="p-2">
            <ChevronLeft size={24} color="#5A5A5A" />
          </button>
          <h2 className="text-xl font-semibold text-[#2B2B2B]">April 24, 2024</h2>
          <button className="p-2">
            <ChevronRight size={24} color="#5A5A5A" />
          </button>
        </div>
      </div>

      <DateSelector getDayName={getDayName} getDayNumber={getDayNumber} />

      <div className="px-5 overflow-y-auto max-h-[550px]">
        {events.map(event => (
          <TimelineItem key={event.id} event={event} showCheckmark />
        ))}
        
        <div className="flex gap-3 mb-4">
          <span className="text-sm text-[#5A5A5A] min-w-[70px] pt-1">4:00 pm</span>
        </div>
      </div>

      <button 
        onClick={onOpenExport}
        className="absolute bottom-7 right-7 w-14 h-14 rounded-full bg-[#8FA88F] flex items-center justify-center shadow-lg"
      >
        <Plus size={28} color="white" />
      </button>
    </div>
  );
}

function ExportOptions({ onClose }) {
  const options = [
    { icon: '📄', label: 'Export As PDF' },
    { icon: '📊', label: 'Export As Excel' },
    { icon: '📄', label: 'Export As Text File' },
    { icon: '📅', label: 'Sync with Google Calendar' }
  ];

  return (
    <div className="w-[390px] h-[844px] bg-black/30 rounded-[30px] overflow-hidden relative shadow-xl">
      <StatusBar />
      
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="bg-white rounded-[20px] p-6 w-full max-w-[350px] shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#2B2B2B]">Export Schedule</h2>
            <button onClick={onClose} className="p-1">
              <X size={24} color="#5A5A5A" />
            </button>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {options.map((option, idx) => (
              <button 
                key={idx}
                className="flex items-center gap-3 p-4 bg-[#F8F8F8] rounded-xl text-left"
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="text-base text-[#2B2B2B]">{option.label}</span>
              </button>
            ))}
          </div>

          <button className="w-full p-4 bg-[#8FA88F] text-white rounded-xl text-[17px] font-semibold">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 pt-2.5 mb-4">
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="flex gap-1 text-sm">
        <span>📶</span>
        <span>📡</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="flex items-center bg-white rounded-2xl p-4 mb-3 shadow-sm gap-3">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${event.color}`}>
        {event.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-[17px] font-semibold text-[#2B2B2B] mb-1">{event.title}</h3>
        <p className="text-sm text-[#8B8B8B] mb-2">{event.location}</p>
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-xs px-2.5 py-1 rounded-md ${event.color} bg-opacity-25 text-[#5A5A5A]`}>
            {event.category}
          </span>
          {event.id === 1 && (
            <span className={`text-xs px-2.5 py-1 rounded-md ${event.color} bg-opacity-25 text-[#5A5A5A]`}>
              Work
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={20} color="#AFAFAF" />
    </div>
  );
}

function DateSelector({ getDayName, getDayNumber }) {
  return (
    <div className="flex justify-center gap-2 px-5 py-4 mb-2.5">
      {[-2, -1, 0, 1, 2].map(offset => {
        const isToday = offset === 0;
        return (
          <div 
            key={offset}
            className={`flex flex-col items-center py-3 px-4 rounded-xl min-w-[60px] cursor-pointer ${
              isToday ? 'bg-[#8FA88F]' : 'bg-[#E8E4DF]'
            }`}
          >
            <div className="text-[13px] text-[#5A5A5A] mb-1">{getDayName(offset)}</div>
            <div className="text-base font-semibold text-[#2B2B2B]">{getDayNumber(offset)}</div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineItem({ event, showCheckmark }) {
  return (
    <div className="flex gap-3 mb-4">
      <span className="text-sm text-[#5A5A5A] min-w-[70px] pt-1">{event.time}</span>
      <div className="flex-1 bg-white rounded-xl p-3.5 flex gap-3 relative shadow-sm">
        <div className={`w-1 h-full rounded-sm absolute left-0 top-0 bottom-0 ${event.color}`} />
        <div className="flex-1 pl-3">
          <h3 className="text-base font-semibold text-[#2B2B2B] mb-1">{event.title}</h3>
          <p className="text-[13px] text-[#8B8B8B] mb-2">{event.location}</p>
          {event.category && (
            <span className={`text-xs px-2.5 py-1 rounded-md ${event.color} bg-opacity-25 text-[#5A5A5A] inline-block`}>
              {event.category}
            </span>
          )}
        </div>
        {showCheckmark && event.completed && (
          <div className="w-6 h-6 rounded-full bg-[#8FA88F] text-white flex items-center justify-center text-sm flex-shrink-0">
            ✓
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingButton() {
  return (
    <button className="absolute bottom-7 right-7 w-14 h-14 rounded-full bg-[#8FA88F] flex items-center justify-center shadow-lg">
      <Plus size={28} color="white" />
    </button>
  );
}

function BottomNav() {
  const navItems = [
    { icon: '📅', label: 'Today', active: true },
    { icon: '📋', label: 'Calendar', active: false },
    { icon: '✏️', label: 'Tasks', active: false },
    { icon: '⋯', label: 'More', active: false },
    { icon: '≡', label: 'More', active: false }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-around bg-white py-2 pb-5 border-t border-[#E0E0E0]">
      {navItems.map((item, idx) => (
        <div 
          key={idx}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            item.active ? 'opacity-100' : 'opacity-50'
          }`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[11px] text-[#5A5A5A]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default App;
