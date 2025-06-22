# MERN Chat App Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start MongoDB (make sure it's running on `mongodb://localhost:27017/mern-chat`).
3. Start the server in development mode:
   ```bash
   npm run dev
   ```
   Or in production mode:
   ```bash
   npm start
   ```

## API Endpoints
- `GET /api/messages` - Get all chat messages
- `POST /api/messages` - Post a new chat message
- `POST /api/upload` - Upload an image or video file (form-data, field: `file`). Returns `{ url }`.

## File Uploads
- Uploaded files are stored in the `uploads/` directory and served at `/uploads/<filename>`.

## Real-time
- Socket.IO is used for real-time messaging on the same server. 