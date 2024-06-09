const { GoogleGenerativeAI } = require("@google/generative-ai");
const { WebhookClient } = require('dialogflow-fulfillment');
const express = require("express");
const nodemailer = require("nodemailer");

const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = "AIzaSyBs_03P9KQaugVW30YImzPz12UczxWy_qk"; // Replace with your Gemini API key

async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 50,
    };

    const chat = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}

const webApp = express();
const PORT = process.env.PORT || 5005;
webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
    },
});

async function sendEmail(subject, html) {
    const info = await transporter.sendMail({
        from: '"Shahryar waseem👻" <sherrymerry20@gmail.com>',
        to: "hammadn788@gmail.com",
        subject: subject,
        html: html,
    });
}

webApp.post('/dialogflow', async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    async function fallback() {
        let action = req.body.queryResult.action;
        let queryText = req.body.queryResult.queryText;

        if (action === 'input.unknown') {
            let result = await runChat(queryText);
            agent.add(result);
        } else {
            agent.add(result);
        }
    }

    function hi(agent) {
        agent.add('Hi, I\'m your Saylani Registration form Assistant, how can I help you today!! 📚✨');
    }

    function email(agent) {
        const emailHtml = `
          <h1>Registration Form Details</h1>
          <p>Thank you for contacting us! Here are your registration form details:</p>
          <ul>
            <li>Name: Shahryar Waseem</li>
            <li>Email: sherrymerry20@gmail.com</li>
            <li>Phone: 03242080440</li>
            <li>CNIC: 42101-9343232-9</li>
            <li>Date of Birth: 17/11/2002</li>
            <li>Full Name: Shahryar Waseem</li>
            <li>Gender: Male</li>
            <li>Qualification: Intermediate</li>
            <li>Address: Nazimabad no.2 Karachi</li>
          </ul>
        `;

        try {
            sendEmail("Registration Form Details", emailHtml);
            agent.add('Your registration details have been sent to your email.');
        } catch (error) {
            console.error("Error sending email:", error);
            agent.add("There was an error sending the email. Please try again later.");
        }
    }

    function phone(agent) {
        agent.add('My phone number is 03242080440📚✨');
    }

    function cnic(agent) {
        agent.add('My cnic no. is 42101-9343232-9📚✨');
    }

    function dateofbirth(agent) {
        agent.add('My Date of birth is 17/11/2002📚✨');
    }

    function fullname(agent) {
        agent.add('My Fullname is Shahryar waseem📚✨');
    }

    function gender(agent) {
        agent.add('Male📚✨');
    }

    function qualification(agent) {
        agent.add('My last qualification is intermediate📚✨');
    }

    function address(agent) {
        agent.add('My address is nazimabad no.2 karachi📚✨');
    }

    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', hi);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('Emails', email);
    intentMap.set('Phone-no', phone);
    intentMap.set('Cnic_no', cnic);
    intentMap.set('Dateofbirth', dateofbirth);
    intentMap.set('Full-name', fullname);
    intentMap.set('Gender', gender);
    intentMap.set('Qualification', qualification);
    intentMap.set('Address', address);
    agent.handleRequest(intentMap);
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}/`);
});
