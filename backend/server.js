import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // Correct import for socket.io
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import otpRoute from './routes/otp.route.js';

dotenv.config();
const app = express();
const server = http.createServer(app); // Create the HTTP server for Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL (change if different)
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }
});

const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend URL
  credentials: true // Allow credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware with updated settings

app.use("/user", userRoute);
app.use("/post", postRoute);
app.use('/otp', otpRoute);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });

io.on("connection", (socket) => {
  console.log('A user connected');

  // Handle user joining the chat (e.g., by user ID or username)
  socket.on('joinChat', (userId) => {
    console.log(`User ${userId} joined the chat`);
    socket.userId = userId;  // Store the userId for later reference
  });

  // Handle receiving a chat message
  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);

    // Broadcast the message to other clients
    io.emit('receiveMessage', message);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log("A user disconnected");
  });
});

// Exporting the io object
export { io }; // Export the io object for other files to use
