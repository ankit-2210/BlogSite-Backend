import Comment from "../models/commentSchema.js";

export const newComment = async (req, res) => {
    try {
        const { postId, text, username } = req.body;
        if (!postId || !text || !username) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const comment = new Comment({
            postId,
            text,
            username
        });

        await comment.save();
        res.status(201).json(comment);
    }
    catch (error) {
        console.error("COMMENT ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getComment = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.name !== req.body.name) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

