import React, { useState, useEffect, useRef } from 'react';

// Mock stories data
const STORIES_DATA = [
  {
    id: 1,
    username: 'travel_diaries',
    avatar: 'https://i.pravatar.cc/150?img=1',
    stories: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=700&fit=crop'
    ]
  },
  {
    id: 2,
    username: 'food_lover',
    avatar: 'https://i.pravatar.cc/150?img=2',
    stories: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=700&fit=crop'
    ]
  },
  {
    id: 3,
    username: 'fitness_goals',
    avatar: 'https://i.pravatar.cc/150?img=3',
    stories: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=700&fit=crop'
    ]
  },
  {
    id: 4,
    username: 'tech_world',
    avatar: 'https://i.pravatar.cc/150?img=4',
    stories: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=700&fit=crop'
    ]
  },
  {
    id: 5,
    username: 'art_gallery',
    avatar: 'https://i.pravatar.cc/150?img=5',
    stories: [
      'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=700&fit=crop',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=700&fit=crop'
    ]
  }
];

const ProgressBar = ({ progress }) => (
  <div className="h-0.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
    <div 
      className="h-full bg-white transition-all duration-100 ease-linear"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const StoryViewer = ({ story, onClose, initialStoryIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const imageRef = useRef(null);

  const currentStory = story.stories[currentIndex];

  useEffect(() => {
    // Preload image
    setIsLoading(true);
    const img = new Image();
    img.src = currentStory;
    img.onload = () => {
      setIsLoading(false);
      setProgress(0);
    };
  }, [currentStory]);

  useEffect(() => {
    if (isLoading || isPaused) return;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isLoading, isPaused]);

  const handleNext = () => {
    if (currentIndex < story.stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 2) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-2 flex gap-1">
          {story.stories.map((_, idx) => (
            <div key={idx} className="flex-1">
              <ProgressBar 
                progress={
                  idx < currentIndex ? 100 : 
                  idx === currentIndex ? progress : 
                  0
                }
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-12 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={story.avatar} 
                alt={story.username}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <span className="text-white font-semibold text-sm">
                {story.username}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-white text-2xl w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Story image */}
        <div 
          className="w-full h-full flex items-center justify-center bg-black cursor-pointer"
          onClick={handleTap}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            ref={imageRef}
            src={currentStory}
            alt="Story"
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>

        {/* Tap zones (invisible) */}
        <div className="absolute inset-0 flex pointer-events-none">
          <div className="w-1/2 h-full" />
          <div className="w-1/2 h-full" />
        </div>
      </div>
    </div>
  );
};

const StoryThumbnail = ({ story, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div 
      onClick={onClick}
      className="flex-shrink-0 flex flex-col items-center gap-1 cursor-pointer"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
          <div className="w-full h-full rounded-full bg-white p-0.5">
            {!imageLoaded && (
              <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
            )}
            <img
              src={story.avatar}
              alt={story.username}
              className={`w-full h-full rounded-full object-cover transition-opacity ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-800 max-w-[70px] truncate">
        {story.username}
      </span>
    </div>
  );
};

export default function App() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Simulate fetching stories from external file
    setTimeout(() => {
      setStories(STORIES_DATA);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };

  const handleCloseStory = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-only container */}
      <div className="max-w-md mx-auto h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Stories</h1>
        </div>

        {/* Stories list */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-gray-100">
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {stories.map(story => (
                <StoryThumbnail
                  key={story.id}
                  story={story}
                  onClick={() => handleStoryClick(story)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Placeholder content */}
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <div className="text-4xl mb-4">📸</div>
            <p className="text-gray-500 text-sm">
              Tap on a story above to view
            </p>
          </div>
        </div>
      </div>

      {/* Story viewer modal */}
      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={handleCloseStory}
        />
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
