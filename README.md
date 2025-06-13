# TranquilApp - Wellness & Nervous System Regulation

A mobile-first React wellness application focused on guided audio exercises and personalized user wellness experiences.

## Features

- **Exercise Discovery**: Browse and discover various wellness exercises
- **Multiple Media Formats**: Audio-only, audio+animation, video, and slideshow exercises
- **Favorites System**: Save and organize preferred exercises
- **Progress Tracking**: Monitor streaks, milestones, and completion history
- **Mood Tracking**: Track daily feelings and wellness progress
- **Assessment System**: Take wellness assessments and view history
- **Mobile-First Design**: Optimized for mobile devices with responsive design

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Express.js, Node.js
- **State Management**: localStorage for persistence
- **UI Components**: Radix UI, Lucide React icons
- **Routing**: Wouter
- **Data Fetching**: TanStack Query

## Deployment

### Render Deployment

This app is configured for easy deployment on Render:

1. **Fork or clone this repository**

2. **Connect to Render**:
   - Create a new Web Service on [Render](https://render.com)
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` configuration

3. **Automatic Configuration**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: Node.js
   - Health Check: `/health`

4. **Environment Variables**:
   - `NODE_ENV=production` (automatically set)
   - Port is automatically assigned by Render

### Manual Deployment

If deploying elsewhere:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### Docker Deployment

```bash
# Build the image
docker build -t tranquil-app .

# Run the container
docker run -p 10000:10000 -e NODE_ENV=production tranquil-app
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and helpers
│   │   └── data/        # Static data files
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── attached_assets/ # Static assets
└── dist/            # Build output
```

## Health Check

The application includes a health check endpoint at `/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## License

MIT License