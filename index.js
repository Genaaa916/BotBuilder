import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


dotenv.config();
let choiceData = []
const config = new Configuration ({
    organization: "",
    apiKey : process.env.OPENAI_API_KEY,
    })
const openai = new OpenAIApi(config);

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());


//for running in nodejs
app.post('/choices', async (req, res) => {
    choiceData = []
    const userChoice = req.body.userChoice;
    res.json({userChoice: userChoice})
    choiceData.push(userChoice)
})



app.post('/chat', async (req, res) => {
    const prompt = req.body.msg_array
    const choices = choiceData[0]
    const instructions = {botType: choices.bot.toLowerCase(), industry:choices.industry.toLowerCase(), useCase: choices.useCase.toLowerCase(), tone:choices.tone.toLowerCase(), additional: choices.additional.toLowerCase()}
    //systemMsg is the instructions for the chatbot, it should vary depending on user choices on the site.
    let systemMsg = `You are a chatbot generator. You build JSON objects that represent chatbots. The structure for a chatbot is as follows:\n \
    \n \
    There may be additional instructions for the topic of the chatbot, they are listed in the user message. \n \
Your goal is to create the chatbot for the use case: ${instructions.useCase} in a ${instructions.tone} tone for the ${instructions.industry} industry. I would hope the chatbot would start with the following discussion points: [discussion points]. \n \
The answer options can have max 7 words. Mention the use case, tone and industry back to the user. Try to make a longer bot with multiple nodes.\n \
Also personalise the message based on discussion points, which the user will specify in their message.\n \
Please consider this additional information if there is any: ${instructions.additional}\n \
This map shows which type defines which type of node, use integer values instead of text. {"multiplechoice answers":14,"dropdown menu answers":15,"singlechoice answers":11,"openfield answers":5}\n \
Here's an example structure of the bot JSON: \n \
{"originMode":"${instructions.botType}","payload":[{"nodeData":{"type":11,"text":"Greeting","left":1000,"top":200,"key":"1","answers":[]},"type":"question"},{"nodeData":{"type":11,"text":"Question","left":550,"top":200,"answers":[{"id":1,"text":"Answer"},{"id":2,"text":"Answer"},{"id":3,"text":"Answer"},{"id":4,"text":"Answer"}],"key":"2"},"type":"question"},{"nodeData":{"type":11,"text":"Question","left":100,"top":200,"key":"3","answers":[]},"type":"question"}],"connections":{"1":"2","2":"3","start":"1"},"companyId":2318}
`
        const completion = await openai.createChatCompletion({
        model : "gpt-3.5-turbo",
        messages : [
            {role: "system", content: systemMsg},
            ...prompt
          ]
        })
    res.json({completion: completion.data.choices[0].message})
})

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})

