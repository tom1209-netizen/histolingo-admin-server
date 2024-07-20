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
        } catch (error) {
            throw (
                {
                    message: error.message || error,
                    statusCode: 500,
                    data: null
                }
            );
        }
    }
}

const databaseService = new DatabaseService();

export default databaseService;