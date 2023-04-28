import {
    example
} from "./example.js";
import {
    Configuration,
    OpenAIApi
} from "openai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';


dotenv.config();
let choiceData = []
const config = new Configuration({
    organization: "",
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config);

function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !VALID_API_KEY.includes(apiKey)) {
        return res.status(401).json({
            error: 'Invalid API key'
        });
    }
    next();
}
const corsOption = {
    origin: ['https://3-5-partial-completion--radiant-kleicha-96d976.netlify.app/'],
};
const app = express();
const port = 3000;
app.use(cors(corsOption));
app.use(bodyParser.json());



//for running in nodejs
app.post('/choices', async (req, res) => {
    try {
        choiceData = []
        const userChoice = req.body.userChoice;
        res.json({
            userChoice: userChoice
        })
        choiceData.push(userChoice)
        console.log(userChoice)

    } catch (err) {
        console.log(err)
    }
})


app.post('/chat', async (req, res) => {
    try {
        const prompt = req.body.message
        const instructions = {
            botType: choiceData[0].bot.toLowerCase(),
            industry: choiceData[0].industry.toLowerCase(),
            useCase: choiceData[0].useCase.toLowerCase(),
            tone: choiceData[0].tone.toLowerCase(),
            additional: choiceData[0].additional.toLowerCase(),
            start: choiceData[0].start.toLowerCase(),
            end: choiceData[0].end.toLowerCase()
        }




        instructions.example = JSON.stringify(example)


        //systemMsg is the instructions for the chatbot, it should vary depending on user choices on the site.
        let systemMsg = `Pretend you're a program that generates JSON templates for chatbots to follow. The user wants to implement a ${instructions.useCase} chatbot on their website. The conversation of the chatbot should be in a ${instructions.tone} tone. The conversation should start from:${instructions.start} and end in:${instructions.end}  Their company is in the ${instructions.industry} industry. The user may have some discussion points in mind, which will be listed at the end of the prompt. Your output should be valid JSON, specifically it should mirror the structure of this JSON file ${instructions.example}
Please note that node types dictate what the purpose of a node is and is mapped like this: {"multiplechoice answers":14,"dropdown menu answers":15,"singlechoice answers":11,"openfield answers":5}. Note that only singlechoice answers can branch out to multiple alternative questions. Also make sure you generate at least 8 nodes. Make sure the JSON you generate is minified. Generate the JSON file now.`
        console.log(systemMsg)
        console.log(req.body)
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: systemMsg
            }, prompt]
        })
        res.json({
            completion: completion.data.choices[0].message
        })
    } catch (err) {
        console.log(err)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})