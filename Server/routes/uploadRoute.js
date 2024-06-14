import express from 'express';
const router = express.Router();
import multer from 'multer';
import { storage } from '../cloudConfig.js';


let upload = multer({
    storage,
    limits: {
        fileSize: 1000000 * 100
    },

}).single("file");

router.post("/", async (req, res) => {
    // store file
    upload(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(500).json(err);
        }
        console.log(req.file.path)
        return res.status(200).json("File uploded successfully");
    })

})

export default router;