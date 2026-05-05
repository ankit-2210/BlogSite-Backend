import express from "express";

import { createPost, getAllPosts, getPost, updatePost, deletePost } from "../controller/post-controller.js";
import { uploadImage, getImage } from "../controller/image-controller.js";
import { upload } from "../middleware/upload.js";
import { newComment, getComment, deleteComment } from "../controller/comment-controller.js";
import { userSignUp, userLogin, aboutData, contactData, logout } from "../controller/user-controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// AUTH
router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/logout", logout);

// PROTECTED
router.get("/about", authenticate, aboutData);

// CONTACT
router.post("/contact", contactData);

// POSTS
router.post("/posts", authenticate, createPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPost);
router.put("/posts/:id", authenticate, updatePost);
router.delete("/posts/:id", authenticate, deletePost);

// FILE
router.post("/upload", upload.single("file"), uploadImage);
router.get("/file/:filename", getImage);

// COMMENTS
router.post("/comments", authenticate, newComment);
router.get("/comments/:id", getComment);
router.delete("/comments/:id", authenticate, deleteComment);


export default router;
