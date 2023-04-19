import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';


dotenv.config();
let choiceData = []
const config = new Configuration ({
    organization: "",
    apiKey : process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config);
const regex = /\{.+\}/gs
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
    console.log(userChoice)
})


app.post('/chat', async (req, res) => {
    const prompt = req.body.message
    const instructions = {botType: choiceData[0].bot.toLowerCase(), 
        industry: choiceData[0].industry.toLowerCase(), 
        useCase: choiceData[0].useCase.toLowerCase(), 
        tone:choiceData[0].tone.toLowerCase(), 
        additional: choiceData[0].additional.toLowerCase()
    }
    
const getExampleJSON = async filePath => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8')
    return JSON.stringify(data).replace("inpage", instructions.botType).replaceAll("\\", "")
  }
  catch(err) {
    console.log(err)
  }
}


instructions.example = await getExampleJSON('example.json')

    
    //systemMsg is the instructions for the chatbot, it should vary depending on user choices on the site.
let systemMsg = `Pretend you're a program that generates JSON templates for chatbots to follow. The user wants to implement a ${instructions.useCase} chatbot on their website. The conversation of the chatbot should be in a ${instructions.tone} tone. The conversation should start from:${instructions.start} and end in:${instructions.end}  Their company is in the ${instructions.industry} industry. The user may have some discussion points in mind, which will be listed at the end of the prompt. Your output should be valid JSON, specifically it should mirror the structure of this JSON file ${instructions.example}
Please note that node types dictate what the purpose of a node is and is mapped like this: {"multiplechoice answers":14,"dropdown menu answers":15,"singlechoice answers":11,"openfield answers":5}. Note that only singlechoice answers can branch out to multiple alternative questions. Also make sure you generate at least 8 nodes. Make sure the JSON you generate is minified. Generate the JSON file now.`
console.log(systemMsg)
console.log(req.body)
        /* const completion = await openai.createChatCompletion({
        model : "gpt-3.5-turbo",
        messages : [
            {role: "system", content: systemMsg}, prompt
        ]
    })
    const gptmessage = completion.data.choices[0].message.content */
        //everything below this line is for testing
    const completion = {
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Here's the JSON template for the lead generation chatbot:\n" +
    '\n' +
    '```\n' +
    `{"originMode":"inpage","payload":[{"nodeData":{"id":1,"bot_id":1,"text":"Hey! Thanks for visiting our website! I'm the funny chatbot from the kitchen industry. Can I get your name?","type":5,"next_no":"2","score":null,"left":240,"top":-56,"is_live_chat":false,"answers":[],"key":"1","isEntryPoint":true},"type":"question"},{"nodeData":{"id":2,"bot_id":1,"text":"Awesome! I love meeting new people. So, what can I help you with? (Please select an option below)","type":11,"next_no":null,"score":null,"left":840,"top":-56,"is_live_chat":false,"answers":[{"id":3,"question_id":2,"text":"I'm interested in your products/services","next_no":"4","score":0,"is_live_chat":0,"key":"4","parentToken":"2"},{"id":4,"question_id":2,"text":"I just want to chat with you","next_no":"6","score":0,"is_live_chat":0,"key":"6","parentToken":"2"}],"key":"2","isEntryPoint":false},"type":"question"},{"nodeData":{"id":4,"bot_id":1,"text":"Yay! So happy to hear that! Are you interested in any specific product or service?","type":14,"next_no":"5","score":null,"left":240,"top":184,"is_live_chat":false,"answers":[{"id":5,"question_id":4,"text":"Kitchen renovation","next_no":"5-1","score":0,"is_live_chat":0,"key":"5-1","parentToken":"4"},{"id":6,"question_id":4,"text":"Customized cabinetry","next_no":"5-1","score":0,"is_live_chat":0,"key":"5-1","parentToken":"4"},{"id":7,"question_id":4,"text":"Countertops","next_no":"5-1","score":0,"is_live_chat":0,"key":"5-1","parentToken":"4"}],"key":"4","isEntryPoint":false},"type":"question"},{"nodeData":{"id":5,"bot_id":1,"text":"Great choice! Before we proceed, may I know which country you are located in?","type":11,"next_no":"5-2","score":null,"left":480,"top":424,"is_live_chat":false,"answers":[{"id":9,"question_id":5,"text":"USA","next_no":"5-3","score":0,"is_live_chat":0,"key":"5-3","parentToken":"5-2"},{"id":10,"question_id":5,"text":"Canada","next_no":"5-3","score":0,"is_live_chat":0,"key":"5-3","parentToken":"5-2"},{"id":11,"question_id":5,"text":"Other","next_no":"5-3","score":0,"is_live_chat":0,"key":"5-3","parentToken":"5-2"}],"key":"5-2","isEntryPoint":false},"type":"question"},{"nodeData":{"id":6,"bot_id":1,"text":"I'm always up for a good chat! So, what's on your mind?","type":5,"next_no":"7","score":null,"left":800,"top":184,"is_live_chat":false,"answers":[],"key":"6","isEntryPoint":false},"type":"question"},{"nodeData":{"id":7,"bot_id":1,"text":"Glad to hear that! Do you need any assistance with anything? (Please select an option from below)","type":11,"next_no":null,"score":null,"left":800,"top":424,"is_live_chat":false,"answers":[{"id":13,"question_id":7,"text":"No, I'm good. I just wanted to chat","next_no":"8","score":0,"is_live_chat":0,"key":"8","parentToken":"7"}],"key":"7","isEntryPoint":false},"type":"question"},{"nodeData":{"id":9,"bot_id":1,"text":"That's great! Our services are currently not available in your area. Please provide your contact information and we will reach out to you when we expand our services there. Thank you!","type":0,"next_no":"8","score":null,"left":1040,"top":664,"is_live_chat":false,"answers":[],"key":"9","isEntryPoint":false},"type":"question"},{"nodeData":{"id":10,"bot_id":1,"text":"At the moment, we offer a limited set of services in your area. Please provide your contact information and we will let you know if we expand our services there. Thank you!","type":0,"next_no":"8","score":null,"left":1520,"top":424,"is_live_chat":false,"answers":[],"key":"10","isEntryPoint":false},"type":"question"},{"nodeData":{"id":13,"bot_id":1,"text":"Great, let's get to it! To help you better, please tell me the name of your company.","type":5,"next_no":"14","score":null,"left":1280,"top":184,"is_live_chat":false,"answers":[],"key":"13","isEntryPoint":false},"type":"question"},{"nodeData":{"id":14,"bot_id":1,"text":"Haha, love the name! Could you tell me how many employees work at your company?","type":11,"next_no":null,"score":null,"left":1600,"top":424,"is_live_chat":false,"answers":[{"id":15,"question_id":14,"text":"Just little ol' me","next_no":"17","score":0,"is_live_chat":0,"key":"17","parentToken":"14"},{"id":16,"question_id":14,"text":"Between 2-50","next_no":"15","score":0,"is_live_chat":0,"key":"15","parentToken":"14"},{"id":17,"question_id":14,"text":"Between 50-250","next_no":"15","score":0,"is_live_chat":0,"key":"15","parentToken":"14"},{"id":18,"question_id":14,"text":"More than 250","next_no":"15","score":0,"is_live_chat":0,"key":"15","parentToken":"14"}],"key":"14","isEntryPoint":false},"type":"question"},{"nodeData":{"id":15,"bot_id":1,"text":"Great! Finally, which services do you want the quote on?","type":14,"next_no":"16","score":null,"left":1920,"top":664,"is_live_chat":false,"answers":[{"id":19,"question_id":15,"text":"Set-up","next_no":"19-1","score":0,"is_live_chat":0,"key":"19-1","parentToken":"15"},{"id":20,"question_id":15,"text":"Maintenance","next_no":"19-1","score":0,"is_live_chat":0,"key":"19-1","parentToken":"15"},{"id":21,"question_id":15,"text":"Support","next_no":"19-1","score":0,"is_live_chat":0,"key":"19-1","parentToken":"15"}],"key":"15","isEntryPoint":false},"type":"question"},{"nodeData":{"id":16,"bot_id":1,"text":"Thanks for sharing this information with me! I'll have a quote ready for you in no time. Please give me your contact details and I'll email you the quote shortly. Have a great day ahead!","type":0,"next_no":"17","score":null,"left":2320,"top":424,"is_live_chat":false,"answers":[],"key":"16","isEntryPoint":false},"type":"question"},{"nodeData":{"id":17,"bot_id":1,"text":"Thanks for chatting with me today, have a great day ahead!","type":0,"next_no":null,"score":null,"left":240,"top":664,"is_live_chat":false,"answers":[],"key":"17","isEntryPoint":false},"type":"question"}],"connections":{"start":"1","2":"4","4":"5","5-2":"5-3","5-3":"9","6":"7","7":"8","9":"8","10":"8","13":"14","14":"15","15":"16","16":"17"},"companyId":2318}\n` +
    '```\n' +
    '\n' +
    'Discussion points:\n' +
    '- What are the lead generation goals of the chatbot?\n' +
    '- How should the chatbot engage with visitors in a funny tone?\n' +
    '- Which services should the chatbot offer quotes for?\n' +
    '- What additional information should the chatbot collect from visitors before offering a quote?',
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
    const gptmessage = completion.choices[0].message.content
    //everyting above this line is for testing


    const gptresponse = {completion: gptmessage}
    if(gptmessage.match(regex)){
        gptresponse.final=true;
    } else {
        gptresponse.final=false
    }
    console.log(gptresponse)
    res.json(gptresponse)
})

app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})


