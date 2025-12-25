import React, { useState } from 'react';
import { Calendar, Plus, ChevronRight, ChevronLeft, X, Menu, CheckCircle2, Briefcase, Users, Dumbbell, User } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('planner');
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 3, 24));
  const [showExportModal, setShowExportModal] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Project Meeting',
      location: 'Office Conference Room',
      time: '9:00 am',
      category: 'Work',
      icon: 'briefcase',
      color: 'bg-orange-200',
      iconBg: 'bg-orange-300',
      completed: true
    },
    {
      id: 2,
      title: 'Vet Appointment',
      location: 'City Animal Clinic',
      time: '10:00 am',
      category: 'Personal',
      icon: 'user',
      color: 'bg-green-200',
      iconBg: 'bg-green-300',
      completed: true
    },
    {
      id: 3,
      title: 'Lunch with Sam',
      location: 'Cafe Delight',
      time: '11:00 am',
      category: 'Meetings',
      icon: 'users',
      color: 'bg-blue-200',
      iconBg: 'bg-blue-300',
      completed: true
    },
    {
      id: 4,
      title: 'Gym Session',
      location: '',
      time: '1:00 pm',
      category: 'Health',
      icon: 'dumbbell',
      color: 'bg-red-200',
      iconBg: 'bg-red-300',
      completed: false
    }
  ]);

  const getIcon = (iconName) => {
    const icons = {
      briefcase: Briefcase,
      user: User,
      users: Users,
      dumbbell: Dumbbell
    };
    const IconComponent = icons[iconName] || Briefcase;
    return <IconComponent className="w-5 h-5 text-gray-700" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: 'bg-orange-100 text-orange-700',
      Personal: 'bg-green-100 text-green-700',
      Meetings: 'bg-blue-100 text-blue-700',
      Health: 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getTimelineColor = (category) => {
    const colors = {
      Work: 'bg-orange-400',
      Personal: 'bg-green-400',
      Meetings: 'bg-blue-400',
      Health: 'bg-red-400'
    };
    return colors[category] || 'bg-gray-400';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getDayButtons = () => {
    const days = [];
    for (let i = -2; i <= 2; i++) {
      const date = new Date(selectedDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const DailyPlannerView = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold text-gray-800">Daily Planner</h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
        <span className="text-gray-600">{formatDate(selectedDate)}</span>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          <span>Today</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <button 
          onClick={() => setCurrentView('schedule')}
          className="w-full p-4 mb-3 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition"
        >
          <Plus className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Add New Entry</span>
        </button>

        <div className="space-y-3">
          {events.map(event => (
            <div
              key={event.id}
              className={`${event.color} p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:shadow-md transition`}
              onClick={() => setCurrentView('daily')}
            >
              <div className={`${event.iconBg} p-3 rounded-lg`}>
                {getIcon(event.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.location}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-white">
        <div className="flex items-center justify-around p-2">
          <button 
            onClick={() => setCurrentView('planner')}
            className="flex flex-col items-center gap-1 p-2 text-green-600"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Today</span>
          </button>
          <button 
            onClick={() => setCurrentView('daily')}
            className="flex flex-col items-center gap-1 p-2 text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">Calendar</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs">Tasks</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            <span className="text-xs">More</span>
          </button>
          <button 
            onClick={() => setShowExportModal(true)}
            className="flex flex-col items-center gap-1 p-2 text-gray-400"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ScheduleInputView = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center p-4 border-b">
        <button onClick={() => setCurrentView('planner')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-semibold text-gray-800">Add New Entry</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto">
        {getDayButtons().map((date, idx) => {
          const isToday = date.toDateString() === selectedDate.toDateString();
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = date.getDate();
          
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[70px] ${
                isToday ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-sm">{dayName}</span>
              <span className="text-lg font-semibold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="text-sm text-gray-600 w-20">{event.time}</div>
                <div className={`w-1 h-full ${getTimelineColor(event.category)} rounded-full`}></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                    {event.category === 'Work' && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        Work
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <button className="w-full bg-green-400 text-white py-4 rounded-full font-semibold shadow-lg hover:bg-green-500 transition flex items-center justify-center gap-2">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const DailyView = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={() => setCurrentView('planner')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">April 24, 2024</h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto">
        {getDayButtons().map((date, idx) => {
          const isToday = date.toDateString() === selectedDate.toDateString();
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = date.getDate();
          
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-3 rounded-xl min-w-[70px] ${
                isToday ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span className="text-sm">{dayName}</span>
              <span className="text-lg font-semibold">{dayNum}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="relative">
              <div className="flex items-start gap-3">
                <div className="text-sm text-gray-600 w-20 pt-1">{event.time}</div>
                <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className={`w-1 h-full ${getTimelineColor(event.category)} rounded-full absolute left-[110px] top-0 bottom-0`}></div>
                    <div className="flex-1 pl-4">
                      <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                          {event.category}
                        </span>
                        {event.category === 'Work' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                            Work
                          </span>
                        )}
                      </div>
                    </div>
                    {event.completed && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 ml-2" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <div className="text-sm text-gray-600 w-20 pt-1">4:00 pm</div>
            <div className="flex-1"></div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button 
          onClick={() => setCurrentView('schedule')}
          className="w-full bg-green-400 text-white py-4 rounded-full font-semibold shadow-lg hover:bg-green-500 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  const ExportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Export Schedule</h2>
          <button 
            onClick={() => setShowExportModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">Export As PDF</span>
          </button>

          <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">Export As Excel</span>
          </button>

          <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">Export As Text File</span>
          </button>

          <button className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-3 hover:bg-gray-100 transition">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium text-gray-800">Sync with Google Calendar</span>
          </button>
        </div>

        <button className="w-full bg-green-400 text-white py-4 rounded-full font-semibold hover:bg-green-500 transition">
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md h-full bg-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-12 bg-white flex items-center justify-between px-4 z-10">
          <span className="text-sm font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          </div>
        </div>

        <div className="h-full pt-12">
          {currentView === 'planner' && <DailyPlannerView />}
          {currentView === 'schedule' && <ScheduleInputView />}
          {currentView === 'daily' && <DailyView />}
        </div>

        {showExportModal && <ExportModal />}
      </div>
    </div>
  );
};

export default App;
