import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const getAllUsers = async (req, res) => {
    try {
        let users = await User.find({});
        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc;
            return otherDetails;
        })

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}


export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(400).json("User not found!");
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    let { id } = req.params;
    const { _id, currentUserAdminStatus, password } = req.body;
    console.log(req.body);
    if (id === _id || currentUserAdminStatus) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }
            let user = await User.findByIdAndUpdate(id, req.body, { new: true });

            const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET_KEY, { expiresIn: "5h" });

            res.status(200).json({ user, token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json("Access Denied!");
    }
}

export const deleteUser = async (req, res) => {
    let { id } = req.params;
    const { currentUserId, currentUserAdminStatus } = req.body;

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            await User.findByIdAndDelete(id);
            res.status(200).json("User deleted successfully");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json("Access Denied! You'r not the owner.");
    }
}

export const followUser = async (req, res) => {
    const { id } = req.params;
    const { _id } = req.body;
    if (_id === id) {
        res.status(403).json("Action forbidden");
    } else {
        try {
            const followUser = await User.findById(id);
            const followingUser = await User.findById(_id);
            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json("User followed!");
            } else {
                res.status(403).json("User is Already followed by you");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const unFollowUser = async (req, res) => {
    const { id } = req.params;
    const { _id } = req.body;
    if (_id === id) {
        res.status(403).json("Action forbidden");
    } else {
        try {
            const followUser = await User.findById(id);
            const followingUser = await User.findById(_id);
            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json("User Unfollowed!");
            } else {
                res.status(403).json("User is not followed by you!");
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}