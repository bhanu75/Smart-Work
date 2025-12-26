import React, { useState } from 'react';
import { Home, ChevronLeft, ChevronRight, Calendar, CheckSquare, MoreHorizontal, Menu, X, Plus } from 'lucide-react';

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('planner'); // planner, schedule, daily, export
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 3, 24)); // April 24, 2024
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Sample events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Project Meeting',
      location: 'Office Conference Room',
      time: '9:00 am',
      category: 'Work',
      color: '#E8B4A0',
      icon: '📄',
      completed: true
    },
    {
      id: 2,
      title: 'Vet Appointment',
      location: 'City Animal Clinic',
      time: '10:00 am',
      category: 'Personal',
      color: '#A8C5A8',
      icon: '⚙️',
      completed: true
    },
    {
      id: 3,
      title: 'Lunch with Sam',
      location: 'Cafe Delight',
      time: '11:00 am',
      category: 'Meetings',
      color: '#A8C5D5',
      icon: '🍽️',
      completed: true
    },
    {
      id: 4,
      title: 'Gym Session',
      location: '',
      time: '1:00 pm',
      category: 'Health',
      color: '#E8B4B4',
      icon: '💪',
      completed: false
    }
  ]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getDayNumber = (date) => {
    return date.getDate();
  };

  const getDayName = (offset) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div style={styles.container}>
      {/* Daily Planner View */}
      {currentView === 'planner' && (
        <DailyPlanner 
          events={events}
          selectedDate={selectedDate}
          formatDate={formatDate}
          onAddEntry={() => setCurrentView('schedule')}
          onNavigateToDaily={() => setCurrentView('daily')}
        />
      )}

      {/* Schedule Input View */}
      {currentView === 'schedule' && (
        <ScheduleInput 
          events={events}
          selectedDate={selectedDate}
          onBack={() => setCurrentView('planner')}
          getDayName={getDayName}
          getDayNumber={getDayNumber}
        />
      )}

      {/* Daily View */}
      {currentView === 'daily' && (
        <DailyView 
          events={events}
          selectedDate={selectedDate}
          formatDate={formatDate}
          getDayName={getDayName}
          getDayNumber={getDayNumber}
          onBack={() => setCurrentView('planner')}
          onOpenExport={() => {
            setCurrentView('export');
            setShowExportModal(true);
          }}
        />
      )}

      {/* Export Options View */}
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

// Daily Planner Component
function DailyPlanner({ events, selectedDate, formatDate, onAddEntry, onNavigateToDaily }) {
  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.statusBar}>
          <span style={styles.time}>9:41</span>
          <div style={styles.statusIcons}>
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>
        
        <div style={styles.titleBar}>
          <h1 style={styles.title}>Daily Planner</h1>
          <button style={styles.iconButton}>
            <Home size={20} color="#5A5A5A" />
          </button>
        </div>

        <div style={styles.dateRow}>
          <span style={styles.dateText}>{formatDate(selectedDate)}</span>
          <button style={styles.todayButton} onClick={onNavigateToDaily}>
            <Calendar size={18} color="#5A5A5A" />
            <span style={styles.todayText}>Today</span>
          </button>
        </div>
      </div>

      {/* Add New Entry Button */}
      <button style={styles.addButton} onClick={onAddEntry}>
        <Plus size={20} color="#8FA88F" />
        <span style={styles.addButtonText}>Add New Entry</span>
      </button>

      {/* Events List */}
      <div style={styles.eventsList}>
        {events.map(event => (
          <div key={event.id} style={styles.eventCard}>
            <div style={{...styles.eventIcon, backgroundColor: event.color}}>
              <span>{event.icon}</span>
            </div>
            <div style={styles.eventContent}>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.eventLocation}>{event.location}</p>
              <div style={styles.tags}>
                <span style={{...styles.tag, backgroundColor: event.color + '40'}}>
                  {event.category}
                </span>
                {event.id === 1 && (
                  <span style={{...styles.tag, backgroundColor: event.color + '40'}}>
                    Work
                  </span>
                )}
              </div>
            </div>
            <ChevronRight size={20} color="#AFAFAF" />
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div style={styles.bottomNav}>
        <NavItem icon="📅" label="Today" active />
        <NavItem icon="📋" label="Calendar" />
        <NavItem icon="✏️" label="Tasks" />
        <NavItem icon="⋯" label="More" />
        <NavItem icon="≡" label="More" />
      </div>
    </div>
  );
}

// Schedule Input Component
function ScheduleInput({ events, selectedDate, onBack, getDayName, getDayNumber }) {
  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.statusBar}>
          <span style={styles.time}>9:41</span>
          <div style={styles.statusIcons}>
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>
        
        <div style={styles.titleBar}>
          <button style={styles.backButton} onClick={onBack}>
            <ChevronLeft size={24} color="#5A5A5A" />
          </button>
          <h2 style={styles.modalTitle}>Add New Entry</h2>
        </div>
      </div>

      {/* Date Selector */}
      <div style={styles.dateSelector}>
        {[-2, -1, 0, 1, 2].map(offset => {
          const isToday = offset === 0;
          return (
            <div 
              key={offset}
              style={{
                ...styles.dateOption,
                ...(isToday ? styles.dateOptionActive : {})
              }}
            >
              <div style={styles.dayName}>{getDayName(offset)}</div>
              <div style={styles.dayNumber}>{getDayNumber(new Date(selectedDate.getTime() + offset * 86400000))}</div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div style={styles.timeline}>
        {events.map(event => (
          <div key={event.id} style={styles.timelineItem}>
            <span style={styles.timeLabel}>{event.time}</span>
            <div style={styles.timelineEvent}>
              <div style={{...styles.timelineBar, backgroundColor: event.color}} />
              <div style={styles.timelineContent}>
                <h3 style={styles.timelineTitle}>{event.title}</h3>
                <p style={styles.timelineLocation}>{event.location}</p>
                {event.category && (
                  <span style={{...styles.tag, backgroundColor: event.color + '40'}}>
                    {event.category}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty time slots */}
        {['2:00 pm', '3:00 pm', '4:00 pm'].map(time => (
          <div key={time} style={styles.timelineItem}>
            <span style={styles.timeLabel}>{time}</span>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button style={styles.floatingButton}>
        <Plus size={28} color="white" />
      </button>
    </div>
  );
}

// Daily View Component
function DailyView({ events, selectedDate, formatDate, getDayName, getDayNumber, onBack, onOpenExport }) {
  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.statusBar}>
          <span style={styles.time}>9:41</span>
          <div style={styles.statusIcons}>
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>
        
        <div style={styles.dateNavigation}>
          <button style={styles.backButton} onClick={onBack}>
            <ChevronLeft size={24} color="#5A5A5A" />
          </button>
          <h2 style={styles.dateTitle}>April 24, 2024</h2>
          <button style={styles.iconButton}>
            <ChevronRight size={24} color="#5A5A5A" />
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div style={styles.dateSelector}>
        {[-2, -1, 0, 1, 2].map(offset => {
          const isToday = offset === 0;
          return (
            <div 
              key={offset}
              style={{
                ...styles.dateOption,
                ...(isToday ? styles.dateOptionActive : {})
              }}
            >
              <div style={styles.dayName}>{getDayName(offset)}</div>
              <div style={styles.dayNumber}>{getDayNumber(new Date(selectedDate.getTime() + offset * 86400000))}</div>
            </div>
          );
        })}
      </div>

      {/* Timeline with completed events */}
      <div style={styles.timeline}>
        {events.map(event => (
          <div key={event.id} style={styles.timelineItem}>
            <span style={styles.timeLabel}>{event.time}</span>
            <div style={{...styles.timelineEvent, opacity: event.completed ? 0.9 : 1}}>
              <div style={{...styles.timelineBar, backgroundColor: event.color}} />
              <div style={styles.timelineContent}>
                <h3 style={styles.timelineTitle}>{event.title}</h3>
                <p style={styles.timelineLocation}>{event.location}</p>
                {event.category && (
                  <span style={{...styles.tag, backgroundColor: event.color + '40'}}>
                    {event.category}
                  </span>
                )}
              </div>
              {event.completed && (
                <div style={styles.checkmark}>✓</div>
              )}
            </div>
          </div>
        ))}
        
        <div style={styles.timelineItem}>
          <span style={styles.timeLabel}>4:00 pm</span>
        </div>
      </div>

      {/* Floating Add Button */}
      <button style={styles.floatingButton} onClick={onOpenExport}>
        <Plus size={28} color="white" />
      </button>
    </div>
  );
}

// Export Options Component
function ExportOptions({ onClose }) {
  const exportOptions = [
    { icon: '📄', label: 'Export As PDF', color: '#8B8B8B' },
    { icon: '📊', label: 'Export As Excel', color: '#6FA86F' },
    { icon: '📄', label: 'Export As Text File', color: '#8B8B8B' },
    { icon: '📅', label: 'Sync with Google Calendar', color: '#E89B6D' }
  ];

  return (
    <div style={styles.screen}>
      <div style={styles.overlay}>
        <div style={styles.statusBar}>
          <span style={styles.time}>9:41</span>
          <div style={styles.statusIcons}>
            <span>📶</span>
            <span>📡</span>
            <span>🔋</span>
          </div>
        </div>

        <div style={styles.modalOverlay}>
          <div style={styles.exportModal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Export Schedule</h2>
              <button style={styles.closeButton} onClick={onClose}>
                <X size={24} color="#5A5A5A" />
              </button>
            </div>

            <div style={styles.exportOptions}>
              {exportOptions.map((option, index) => (
                <button key={index} style={styles.exportOption}>
                  <span style={styles.exportIcon}>{option.icon}</span>
                  <span style={styles.exportLabel}>{option.label}</span>
                </button>
              ))}
            </div>

            <button style={styles.saveButton}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active }) {
  return (
    <div style={{...styles.navItem, ...(active ? styles.navItemActive : {})}}>
      <span style={styles.navIcon}>{icon}</span>
      <span style={styles.navLabel}>{label}</span>
    </div>
  );
}

// Styles Object
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    gap: '20px',
    flexWrap: 'wrap'
  },
  screen: {
    width: '390px',
    height: '844px',
    backgroundColor: '#EFEBE7',
    borderRadius: '30px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  header: {
    padding: '0 20px',
    backgroundColor: '#EFEBE7'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    marginBottom: '15px'
  },
  time: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#000'
  },
  statusIcons: {
    display: 'flex',
    gap: '5px',
    fontSize: '14px'
  },
  titleBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  title: {
    fontSize: '32px',
    fontWeight: '600',
    color: '#2B2B2B',
    margin: 0
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px'
  },
  dateRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  dateText: {
    fontSize: '16px',
    color: '#5A5A5A'
  },
  todayButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: '1px solid #D0D0D0',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer'
  },
  todayText: {
    fontSize: '14px',
    color: '#5A5A5A'
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: 'calc(100% - 40px)',
    margin: '0 20px 20px',
    padding: '16px',
    backgroundColor: '#E8E4DF',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#5A5A5A'
  },
  addButtonText: {
    fontSize: '16px',
    color: '#8FA88F'
  },
  eventsList: {
    padding: '0 20px',
    overflowY: 'auto',
    maxHeight: '500px'
  },
  eventCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    gap: '12px'
  },
  eventIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0
  },
  eventContent: {
    flex: 1
  },
  eventTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#2B2B2B',
    margin: '0 0 4px 0'
  },
  eventLocation: {
    fontSize: '14px',
    color: '#8B8B8B',
    margin: '0 0 8px 0'
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  tag: {
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    color: '#5A5A5A'
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: '8px 0 20px',
    borderTop: '1px solid #E0E0E0'
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    opacity: 0.5
  },
  navItemActive: {
    opacity: 1
  },
  navIcon: {
    fontSize: '20px'
  },
  navLabel: {
    fontSize: '11px',
    color: '#5A5A5A'
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px'
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2B2B2B',
    margin: 0
  },
  dateSelector: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '15px 20px',
    marginBottom: '10px'
  },
  dateOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: '#E8E4DF',
    cursor: 'pointer',
    minWidth: '60px'
  },
  dateOptionActive: {
    backgroundColor: '#8FA88F'
  },
  dayName: {
    fontSize: '13px',
    color: '#5A5A5A',
    marginBottom: '4px'
  },
  dayNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2B2B2B'
  },
  timeline: {
    padding: '0 20px',
    overflowY: 'auto',
    maxHeight: '500px'
  },
  timelineItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'flex-start'
  },
  timeLabel: {
    fontSize: '14px',
    color: '#5A5A5A',
    minWidth: '70px',
    paddingTop: '4px'
  },
  timelineEvent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    position: 'relative',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  timelineBar: {
    width: '4px',
    height: '100%',
    borderRadius: '2px',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0
  },
  timelineContent: {
    flex: 1,
    paddingLeft: '12px'
  },
  timelineTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2B2B2B',
    margin: '0 0 4px 0'
  },
  timelineLocation: {
    fontSize: '13px',
    color: '#8B8B8B',
    margin: '0 0 8px 0'
  },
  checkmark: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#8FA88F',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0
  },
  floatingButton: {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#8FA88F',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  dateNavigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  dateTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2B2B2B',
    margin: 0
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  exportModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '24px',
    width: '90%',
    maxWidth: '350px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  exportOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  exportOption: {
    display: 'flex    </div>
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
