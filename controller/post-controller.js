import Post from "../models/postSchema.js";

export const createPost = async (req, res) => {
    try {
        console.log(req.body);
        const { title, description, category, picture } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }
        const newPost = new Post({
            title,
            description,
            category,
            picture,
            username: req.user.username,
            userId: req.user._id,
        })

        await newPost.save();
        res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const { username, category, search } = req.query;
        let filter = {};
        if (username)
            filter.username = username;
        if (category)
            filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const posts = await Post.find(filter)
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(posts);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching posts", });
    }
}

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedPost);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export const deletePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Post deleted successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
