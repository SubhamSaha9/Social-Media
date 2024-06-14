import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    let { username, password, firstname, lastname } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const user = new User({
        username,
        password: hashedPass,
        firstname,
        lastname
    })
    try {
        const oldUser = await User.findOne({ username: username });
        if (oldUser) {
            return res.status(400).json("Username is already registered!");
        }
        const newUser = await user.save();
        const token = jwt.sign({
            username: newUser.username,
            id: newUser._id,
        }, process.env.SECRET_KEY, { expiresIn: '5h' })
        res.status(200).json({ newUser, token });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export const loginUser = async (req, res) => {
    let { username, password } = req.body;
    try {
        let user = await User.findOne({ username: username });
        if (user) {
            const validate = await bcrypt.compare(password, user.password);

            if (!validate) {
                res.status(400).json("Wrong Password");
            } else {
                const token = jwt.sign({
                    username: user.username,
                    id: user._id,
                }, process.env.SECRET_KEY, { expiresIn: '5h' })
                res.status(200).json({ user, token });
            }
        } else {
            res.status(400).json("User does not exist!");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
