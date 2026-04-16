import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fileUpload from 'express-fileupload';
import { clerkMiddleware } from '@clerk/express';
import { createServer } from 'http';
import cron from 'node-cron';
import fs from 'fs';


//Files imported
import { connectDB } from './db.js';
import { initializeSocketIO } from './socket.io.js';

dotenv.config();
const __dirname = path.resolve();

//Initialize express server
const app = express();

//initialize socket.io
const httpServer = createServer(app);
initializeSocketIO(httpServer);

//Routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import songsRoutes from './routes/songsRoutes.js';
import albumsRoutes from './routes/albumsRoutes.js';
import statsRoutes from './routes/statsRoutes.js';


//Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
})); //Enable CORS
app.use(express.json()); //Parse JSON bodies (as sent by API clients)
app.use(clerkMiddleware()); // Pass no parameters => adds auth to req object
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp'),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit file size
})); //Enable file upload

//CRON JOBS => Delete files in tmp directory every hour
const tempDir = path.join(process.cwd(), 'tmp');
cron.schedule('0 * * * *', () => {
    if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});




app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/albums', albumsRoutes);
app.use('/api/stats', statsRoutes);

//Error handler
app.use((error, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : error.message });
});

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
    connectDB();
});