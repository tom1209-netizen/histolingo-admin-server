import express from "express";
import cors from "cors";
import { config } from "dotenv";
import databaseService from "./services/database.service.js";
import roleRoute from "./routes/role.route.js";
import adminRoute from "./routes/admin.route.js";
import topicRoute from "./routes/topic.route.js";
import passwordRoutes from "./routes/passwordController.route.js";
import { initLocaleData } from "./localization.js";
import { loadContentLanguage } from "./middlewares/localization.middleware.js";
import countryRoute from "./routes/country.route.js";

const app = express();

config();

app.use(express.json());
app.use(cors());

initLocaleData().then(() => {
    console.log("Locale data initialized successfully");
}).catch(err => {
    console.error("Error initializing locale data:", err);
});

app.use(loadContentLanguage);

app.get("/", (req, res) => {
    res.send("Hello! Welcome to my Express server.");
});

app.use("/roles", roleRoute);
app.use("/admins", adminRoute);
app.use("/countries", countryRoute);
app.use('/topics', topicRoute);
app.use("/password", passwordRoutes);

// Error handling middleware
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
});