import express from "express";
import cors from "cors";
import { config } from "dotenv";
import databaseService from "./services/database.service.js";
import roleRoute from "./routes/role.route.js";
import adminRoute from "./routes/admin.route.js";
import topicRoute from "./routes/topic.route.js";
import feedbackRoute from "./routes/feedback.route.js";
import passwordRoutes from "./routes/passwordController.route.js";
import questionRoute from "./routes/question.route.js";
import countryRoute from "./routes/country.route.js";
import uploadRoute from "./routes/upload.route.js";
import { initLocaleData } from "./localization.js";
import { loadContentLanguage } from "./middlewares/localization.middleware.js";
import documentationRoute from "./routes/documentation.route.js";
import playerRoute from "./routes/player.route.js";
import testRoute from "./routes/test.route.js";

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
app.use("/documentations", documentationRoute);
app.use("/players", playerRoute);
app.use("/tests", testRoute);
app.use("/password", passwordRoutes);
app.use("/feedbacks", feedbackRoute);
app.use("/questions", questionRoute);
app.use("/upload", uploadRoute)

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