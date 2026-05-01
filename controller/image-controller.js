import mongoose from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";

let bucket;

mongoose.connection.once("open", () => {
    bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "photos",
    });
});

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        if (!bucket) {
            return res.status(500).json({ message: "Bucket not initialized" });
        }

        const filename = `${Date.now()}-${req.file.originalname}`;
        const uploadStream = bucket.openUploadStream(filename, {
            contentType: req.file.mimetype,
        });

        uploadStream.end(req.file.buffer);
        uploadStream.on("finish", () => {
            const imageUrl = `${process.env.BASE_URL}/api/file/${filename}`;
            return res.status(200).json({ imageUrl });
        });
        uploadStream.on("error", (err) => {
            console.error(err);
            return res.status(500).json({ message: "Upload failed" });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getImage = async (req, res) => {
    try {
        if (!bucket) {
            return res.status(500).json({ message: "Bucket not initialized" });
        }
        const file = await mongoose.connection.db
            .collection("photos.files")
            .findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }
        res.set("Content-Type", file.contentType);
        const downloadStream = bucket.openDownloadStreamByName(
            req.params.filename
        );
        downloadStream.pipe(res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving image" });
    }
};