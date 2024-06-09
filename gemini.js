const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Payload } = require('dialogflow-fulfillment');
const express = require("express");
const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = "AIzaSyBs_03P9KQaugVW30YImzPz12UczxWy_qk";

async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // console.log(genAI)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 50,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}

const webApp = express();
const PORT = process.env.PORT || 5005;
webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});
webApp.get('/', (req, res) => {
    res.sendStatus(200);
    res.send("Status Okay")
});

webApp.post('/dialogflow', async (req, res) => {

    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({
        request: req,
        response: res
    });

    async function fallback() {
        let action = req.body.queryResult.action;
        let queryText = req.body.queryResult.queryText;

        if (action === 'input.unknown') {
            let result = await runChat(queryText);
            agent.add(result);
            console.log(result)
        }else{
            agent.add(result);
            console.log(result)
        }
    }
    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add('Hi,Im your Saylani Registration form Assistant,How can i help you today!!📚✨')
    }

    function email(agent) {
        console.log(`intent  =>  email`);
        agent.add('My email is sherrymerry20@gmail.com📚✨')
    }

    function phone(agent) {
        console.log(`intent  =>  phone`);
        agent.add('My phone number is 03242080440📚✨')
    }

    function cnic(agent) {
        console.log(`intent  =>  cnic`);
        agent.add('My cnic no. is 42101-9343232-9📚✨')
    }

    function Dateofbirth(agent) {
        console.log(`intent  =>  Dateofbirth`);
        agent.add('My Date of birth is 17/11/2002📚✨')
    }

    function Fullname(agent) {
        console.log(`intent  =>  Fullname`);
        agent.add('My fullname is Shahryar waseem📚✨')
    }

    function Gender(agent) {
        console.log(`intent  =>  Gender`);
        agent.add('Male📚✨')
    }
  
    function Qualification(agent) {
        console.log(`intent  =>  Qualification`);
        agent.add('My last qualification is intermediate📚✨')
    }

    function Address(agent) {
        console.log(`intent  =>  Address`);
        agent.add('My address is nazimabad no.2 karachi📚✨')
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', hi);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('email', email);
    intentMap.set('phone', phone);
    intentMap.set('cnic', cnic);
    intentMap.set('Dateofbirth', Dateofbirth);
    intentMap.set('fullname', Fullname);
    intentMap.set('Gender', Gender);
    intentMap.set('Qualification', Qualification);
    intentMap.set('Address', Address);
    agent.handleRequest(intentMap);
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <sherrymerry20@gmail.com>', // sender address
    to: "hammadn788@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
