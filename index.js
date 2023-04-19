import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { router } from "./functions.js";


dotenv.config();
export const config = new Configuration ({
    organization: "",
    apiKey : process.env.OPENAI_API_KEY,
})
export const openai = new OpenAIApi(config);

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.use(router)

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})


