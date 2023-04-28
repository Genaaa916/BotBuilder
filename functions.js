import express from 'express'
import {
    openai
} from './index.js'
import {
    Configuration,
    OpenAIApi
} from "openai";
import {
    example
} from './example.js'

//send API request to generate bot
let choiceData = []
export const router = express.Router()
router.post('/discussion', async (req, res) => {
    const prompt = req.body.message
    const instructions = {
        botType: choiceData[0].bot.toLowerCase(),
        industry: choiceData[0].industry.toLowerCase(),
        useCase: choiceData[0].useCase.toLowerCase(),
        tone: choiceData[0].tone.toLowerCase(),
        additional: choiceData[0].additional.toLowerCase()
    }

    const systemMsg = `Pretend you're a program that generates discussions for a chatbot. You must generate a full discussion for a chatbot, including the things the bot says and the possible answers the user can give. The bot you generate will be used for ${instructions.useCase}. The conversation of the chatbot should be in a ${instructions.tone} tone. Their company is in the ${instructions.industry} industry. There may be additional discussion points at end of the prompt. Your output should have a chatbot lines numbered with 1. 2. etc and user lines nested in the bot lines with a. b. c. Only generate the bot conversation, and nothing else.`
    console.log(systemMsg)
    console.log(req.body)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: systemMsg
        }, prompt]
    })
    /* const completion = {
        model: "gpt-3.5-turbo",
        choices: [{
            message: {
                role: "system",
                content: "Sure, I can help you generate a discussion for your lead generation chatbot. Let's get started! 1. Welcome message: Hello there! It's great to see you here on our website. I'm your friendly chatbot, and I'm here to help you generate leads for your business. What can I do for you today? a. I want to learn more about lead generation. b. I want to learn how your chatbot can help me. c. I’m just browsing. 2. Explanation about lead generation: Well, lead generation is the process of attracting and converting strangers into customers. It's a crucial aspect of any business, and without it, your sales will suffer. I'm here to make sure you never miss a potential lead. a. Can you give me an example of lead generation? b. How do you generate leads? c. Why is lead generation important? 3. Explanation about chatbot features: Our chatbot has several features that can help you generate leads in a fun and interactive way. For instance, I can ask your website visitors questions, and gather their contact information. This way, you can follow up with them and turn them into customers. a. How do you ask questions to the visitors? b. How do you gather their contact information? c. Can you show me how it works? 4. The importance of a funny tone: As you may have noticed, I like to keep things light and funny. That's because, in order to convert visitors into leads, you need to keep them engaged and interested. A little humor can go a long way in making visitors feel comfortable, and ultimately, more likely to give you their contact information. a. Can you tell me a joke? b. I'm not very funny. Can I still use your chatbot? c. How do you make sure you're not too cheesy? Those are some potential discussion points to get you started. Let me know if you have any specific goals or areas you want to focus on, and I can tailor the conversation accordingly."
            },
            prompt
        }]
    } */
    const gptmessage = completion.data.choices[0].message.content
    const gptresponse = {
        completion: gptmessage
    }
    const regex = /\{.+\}/gs
    if (gptmessage.match(regex)) {
        gptresponse.final = true;
    } else {
        gptresponse.final = false
    }
    console.log(gptresponse)
    res.json(gptresponse)
})

//send choices
router.post('/choices', async (req, res) => {
    choiceData = []
    const userChoice = req.body.userChoice;
    res.json({
        userChoice: userChoice
    })
    choiceData.push(userChoice)
    console.log(userChoice)
})


//create bot
router.post('/bot', async (req, res) => {
    const discussionData = req.body
    console.log(discussionData)
    const systemMsg = `Turn this conversation into a JSON: ${discussionData.message.join(' ')}. You must mirror the structure of this JSON, with the exact keys and nesting. : ${JSON.stringify(example)}`
    console.log(discussionData)
    console.log(systemMsg)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "system",
            content: systemMsg
        }]
    })
    const gptmessage = completion.data.choices[0].message.content
    const gptresponse = {
        completion: gptmessage
    }
    const regex = /\{.+\}/gs
    if (gptmessage.match(regex)) {
        gptresponse.final = true;
    } else {
        gptresponse.final = false
    }
    console.log(gptresponse)
    res.json(gptresponse)


})