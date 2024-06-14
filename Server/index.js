import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import uploadRoute from './routes/uploadRoute.js'
import chatRoute from './routes/chatRoute.js'
import messageRoute from './routes/messageRoute.js'
import reviewRoute from './routes/reviewRoute.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


main().then((res) => {
    console.log("connected");
}).catch((err) => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}


// routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/post/:id/reviews", reviewRoute);
app.use("/upload", uploadRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);


const server = app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
})

const io = new Server(server, {
    cors: {
        origin: "https://social-media-subhamio-subham-sahas-projects-26624cb8.vercel.app",
    },
});

let activeUsers = [];

io.on("connection", (socket) => {
    // add new user
    socket.on("new-user-add", (newUserId) => {
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
            console.log("New User Connected", activeUsers);
        }
        io.emit("get-users", activeUsers);
    })

    socket.on("send-message", (data) => {
        const { receiverId } = data;
        const user = activeUsers.find((user) => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit("recieve-message", data);
        }
    })

    socket.on("disconnect", () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers);
        io.emit("get-users", activeUsers);
    });
})