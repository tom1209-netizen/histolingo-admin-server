import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'

const app = express();

config();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello! Welcome to my Express server.');
});

app.use((err, req, res, next) => {
    if (err.message) {
        return res.json({ error: err.message });
    } else {
        return res.json({ err });
    }
});


app.listen(process.env.PORT, (err) => {
    console.log(`Your app is listening on ${process.env.PORT}`)
})