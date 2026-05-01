import mongoose from "mongoose";

const Connection = async () => {
    const DB = process.env.MONGO_URI;
    try {
        await mongoose.connect(DB);
        console.log("Database Connected Successfully");
    }
    catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

export default Connection;