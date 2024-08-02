import mongoose from "mongoose";
import { config } from "dotenv";

config();

class DatabaseService {
    constructor() {
        this.uri = process.env.BASE_URI;
    }
    async connect() {
        try {
            await mongoose.connect(this.uri);
            console.log(`MongoDB connect successfully`);
        } catch (e) {
            const error = new Error("MongoDB connect failed");
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            console.log("MongoDB disconnected successfully");
        } catch (e) {
            const error = new Error("MongoDB disconnection failed");
            error.status = 500;
            error.data = null;
            throw error;
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;