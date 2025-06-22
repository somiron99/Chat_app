# MERN Real-Time Chat App

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring room-based messaging, file sharing, and Socket.IO for real-time communication.

## Features

- 🔐 **Room-based Chat**: Create or join chat rooms using unique codes
- 💬 **Real-time Messaging**: Instant message delivery using Socket.IO
- 📸 **Media Sharing**: Send images and short videos
- 🎨 **Modern UI**: Beautiful, responsive design with styled-components
- 📱 **Auto-scroll**: Automatically scrolls to latest messages
- 👥 **Multi-user Support**: Multiple users can chat in the same room

## Project Structure

```
Web/
├── server/          # Backend (Node.js + Express + Socket.IO)
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   ├── uploads/     # File uploads directory
│   └── index.js     # Main server file
└── client/          # Frontend (React + Socket.IO-client)
    ├── public/      # Static files
    └── src/         # React components
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Web
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Environment Setup
```bash
cd ../server
cp env.example .env
# Edit .env with your MongoDB connection string
```

## Running the Application

### Development Mode

1. **Start MongoDB** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Start Frontend**
   ```bash
   cd client
   npm start
   ```
   App will run on http://localhost:3000

### Production Build

1. **Build Frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start Production Server**
   ```bash
   cd ../server
   npm start
   ```

## Usage

1. **Enter Username**: Start by entering your username
2. **Create/Join Room**: 
   - Create a new room (get a unique code to share)
   - Or join an existing room using a code
3. **Start Chatting**: Send text messages, images, or videos
4. **Share Room Code**: Share the room code with others to invite them

## API Endpoints

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send a new message

### Rooms
- `POST /api/rooms/create` - Create a new room
- `POST /api/rooms/join` - Join a room by code

### File Upload
- `POST /api/upload` - Upload image/video file

## Deployment

### Environment Variables
Set these in your deployment platform:
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (optional, defaults to 5000)
- `NODE_ENV`: Set to "production"

### Deployment Platforms

#### Render
1. Connect your GitHub repository
2. Set root directory to `server`
3. Build command: `cd ../client && npm install && npm run build && cd ../server && npm install`
4. Start command: `node index.js`
5. Add environment variables

#### Heroku
1. Install Heroku CLI
2. In `server` directory:
   ```bash
   heroku create
   git push heroku main
   ```
3. Set environment variables in Heroku dashboard

#### Railway
1. Connect your GitHub repository
2. Set root directory to `server`
3. Add environment variables
4. Deploy

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Socket.IO**: Real-time communication
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **Multer**: File upload handling

### Frontend
- **React**: UI library
- **Socket.IO-client**: Real-time client
- **styled-components**: CSS-in-JS styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository. 