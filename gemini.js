const { GoogleGenerativeAI } = require("@google/generative-ai");
const { WebhookClient } = require('dialogflow-fulfillment');
const express = require("express");
const nodemailer = require("nodemailer");

const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = "AIzaSyBs_03P9KQaugVW30YImzPz12UczxWy_qk";

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
    service: 'gmail',
    auth: {
        user: 'sherrymerry20@gmail.com',
        pass: 'rmafsirdqatwjjko',
    },
});

async function sendEmail(subject, html) {
    try {
        const info = await transporter.sendMail({
            from: '"Shahryar Waseem👻" <sherrymerry20@gmail.com>',
            to: "sherrymerry20@gmail.com",
            subject: subject,
            html: html,
        });
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
}

webApp.post('/dialogflow', async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    async function fallback(agent) {
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

    async function email(agent) {
        const emailHtml = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        color: #333;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: auto;
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    p {
                        font-size: 16px;
                    }
                    ul {
                        list-style-type: none;
                        padding: 0;
                    }
                    ul li {
                        background: #f4f4f9;
                        margin: 10px 0;
                        padding: 10px;
                        border-left: 4px solid #4CAF50;
                    }
                    ul li:nth-child(even) {
                        background: #e9e9f0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Registration Form Details</h1>
                    <p>Thank you for contacting us! Here are your registration form details:</p>
                    <ul>
                        <li><strong>Name:</strong> Shahryar Waseem</li>
                        <li><strong>Email:</strong> sherrymerry20@gmail.com</li>
                        <li><strong>Phone:</strong> 03242080440</li>
                        <li><strong>CNIC:</strong> 42101-9343232-9</li>
                        <li><strong>Date of Birth:</strong> 17/11/2002</li>
                        <li><strong>Full Name:</strong> Shahryar Waseem</li>
                        <li><strong>Gender:</strong> Male</li>
                        <li><strong>Qualification:</strong> Intermediate</li>
                        <li><strong>Address:</strong> Nazimabad no.2 Karachi</li>
                    </ul>
                </div>
            </body>
            </html>
        `;

        try {
            await sendEmail("Registration Form Details", emailHtml);
            agent.add('Your registration details have been sent to your email.');
        } catch (error) {
            agent.add("There was an error sending the email. Please try again later.");
        }
    }

    function welcome(agent) {
        agent.add('Hi, Iam your Saylani Registration form Assistant, how can I help you today!! 📚✨');
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
    intentMap.set('Phone-no', welcome);
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
