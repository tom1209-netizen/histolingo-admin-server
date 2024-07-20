import express from "express"
import cors from "cors"
import { config } from "dotenv"
import databaseService from "./services/database.service.js";
import roleRoute from "./routes/role.route.js";
import adminRoute from "./routes/admin.route.js";

const app = express();

config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello! Welcome to my Express server.");
});

app.use("/role", roleRoute);
app.use("/admin", adminRoute);

app.use((err, req, res, next) => {
    if (err.message) {
        return res.json({ error: err.message });
    } else {
        return res.json({ err });
    }
});


app.listen(process.env.PORT, async (err) => {
    await databaseService.connect();
    console.log(`Your app is listening on ${process.env.PORT}`);
})