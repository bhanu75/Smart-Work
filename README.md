# Innovative Time Management App

A modern, feature-rich time management application with energy-based planning, focus mode, and goal tracking.

## Features

- **Energy-Based Timeline View**: Plan tasks based on your energy levels throughout the day
- **Card-Based Daily Planner**: Mobile-friendly card interface for quick task management
- **Focus Mode with Countdown**: Dedicated timer to help you concentrate on important tasks
- **Goal-Driven Task List**: Track progress across different categories (Fitness, Work, Learning)
- **Recently Added Tasks**: Quick access to your latest tasks

## Tech Stack

- **React 18.2** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS 3.4** - Styling
- **Lucide React** - Icons
- **JavaScript (ES2020+)** - Programming language

## Installation

### Prerequisites
- Node.js 16+ and npm installed

### Setup Steps

1. **Create project directory and navigate to it:**
```bash
mkdir innovative-time-management
cd innovative-time-management
```

2. **Copy all the configuration files to the project root:**
   - package.json
   - vite.config.js
   - tailwind.config.js
   - postcss.config.js
   - .eslintrc.cjs
   - .gitignore
   - index.html

3. **Create the src directory and add files:**
```bash
mkdir src
```
   - src/main.jsx
   - src/App.jsx
   - src/index.css

4. **Install dependencies:**
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
innovative-time-management/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles with Tailwind
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
└── .eslintrc.cjs         # ESLint configuration
```

## Usage

### Energy View
- View tasks organized by time with energy level indicators
- Color-coded tasks (green=high energy, yellow=medium, orange=low)
- Click "Focus" on any task to start a focus session

### Card Planner
- Mobile-optimized card interface
- Complete tasks with quick actions
- Progress bars show task completion

### Focus Mode
- Start a countdown timer for any task
- Pause, resume, or extend your focus session
- Complete tasks directly from focus mode

### Goals View
- Add new tasks with category selection
- See recently added tasks at the top
- Track progress by category (Fitness, Work, Learning)
- Delete or mark tasks as complete

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Then drag and drop the 'dist' folder to Netlify
```

### Deploy to GitHub Pages
```bash
npm install gh-pages --save-dev
```

Add to package.json:
```json
"homepage": "https://yourusername.github.io/innovative-time-management",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Then run:
```bash
npm run deploy
```

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
