import Chat from '../models/chat.js'

export const createChat = async (req, res) => {
    const newChat = new Chat({
        members: [req.body.senderId, req.body.receiverId],
    });
    try {
        const chat = await Chat.findOne({ members: { $all: [req.body.senderId, req.body.receiverId] } });
        if (chat) {
            res.status(400).json("chat already present");
        } else {
            const result = await newChat.save();
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

export const userChats = async (req, res) => {
    try {
        const chat = await Chat.find({ members: { $in: [req.params.userId] } });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error)
    }
}

export const findChat = async (req, res) => {
    try {
        const chat = await Chat.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] }
        })
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
}