/**
 * @fileoverview AidBot API.
 * @version 1.0.0-beta
 * @license GNU Affero General Public License v3.0
 */

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { OpenAI } from 'langchain/llms/openai';
import { loadQAStuffChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import translate from 'translate-google';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(process.env.API_PORT, () => {
    console.log(`API Port: http://localhost:${process.env.API_PORT}`);
});

const model = new OpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
});

// Document Library and Chain
const directoryLoader = new DirectoryLoader('support', {
    '.txt': (path) => new TextLoader(path),
    // TODO Add more file types
});
const documents = await directoryLoader.loadAndSplit();
const memoryVectorStore = await MemoryVectorStore.fromDocuments(documents, new OpenAIEmbeddings());
const stuffDocumentsChain = loadQAStuffChain(model);

// Sentiment Analysis (Problem Processing) Chain
const template = 'Determine which of the sentences in the text require immediate attention and re-arrange them accordingly.\nText: {text}\nAnswer:';
const promptTemplate = new PromptTemplate({
    template: template,
    inputVariables: ['text'],
});
const llmChain = new LLMChain({ llm: model, prompt: promptTemplate });

// Main API Endpoint
app.post('/aid-bot', cors(), async (req, res) => {
    /*
     * API Process Flow
     * 1. Problem Processing (Sentiment Analysis, Problem Prioritization)
     * 2. Similarity Search
     * 3. Question Answering
     * 4. Translation
     * 5. Response
     */

    /**
     * The response body to be sent back to the client.
     * @type {Object.<JSON>}
     */
    const body = [];

    /**
     * The body content of the request.
     * @type {String}
     */
    let content = req.body.content;
    if (content === undefined || content === '' || content === null) {
        res.status(400);
        return res.json({ error: 'Missing body content' });
    }
    if (content.match(/\S+/gm).length > 200) {
        res.status(400);
        return res.json({ error: 'Body content too long' });
    }

    /**
     * Problem Processing (Sentiment Analysis, Problem Prioritization)
     * Analyze the sentiment of the content problem and revise to be responded to.
     */
    const sentiment = await llmChain.call({ text: content });
    content = sentiment.text.replace(/^\s/m, '');

    /**
     * Similarity Search.
     * Find the most similar document to the content.
     * @see https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/memory
     */
    const document = await memoryVectorStore.similaritySearch(content);
    if (document === undefined) {
        res.status(400);
        return res.json({ error: 'No similar documents found' });
    }

    /**
     * Question Answering.
     * Answer the question based on the content and the document.
     * @see https://js.langchain.com/docs/modules/chains/index_related_chains/document_qa
     */
    const documentQA = await stuffDocumentsChain.call({
        input_documents: document,
        question: content,
    });
    const documentAnswer = documentQA.text.replace(/^\s/m, '');

    /**
     * The language to translate the response to.
     * @type {String}
     */
    const language = req.body.language;

    // Determine if the translation language is specified.
    if (!language) {
        // Push the response to the array.
        body.push({response: documentAnswer});
    }
    else {
        /**
         * Translation.
         * Translate the response to the language specified.
         * This is handled by a third-party Google Translate API.
         * @see https://www.npmjs.com/package/translate-google
         */
        const languages = {
            auto: 'Automatic',
            af: 'Afrikaans',
            sq: 'Albanian',
            ar: 'Arabic',
            hy: 'Armenian',
            az: 'Azerbaijani',
            eu: 'Basque',
            be: 'Belarusian',
            bn: 'Bengali',
            bs: 'Bosnian',
            bg: 'Bulgarian',
            ca: 'Catalan',
            ceb: 'Cebuano',
            ny: 'Chichewa',
            'zh-cn': 'Chinese Simplified',
            'zh-tw': 'Chinese Traditional',
            co: 'Corsican',
            hr: 'Croatian',
            cs: 'Czech',
            da: 'Danish',
            nl: 'Dutch',
            en: 'English',
            eo: 'Esperanto',
            et: 'Estonian',
            tl: 'Filipino',
            fi: 'Finnish',
            fr: 'French',
            fy: 'Frisian',
            gl: 'Galician',
            ka: 'Georgian',
            de: 'German',
            el: 'Greek',
            gu: 'Gujarati',
            ht: 'Haitian Creole',
            ha: 'Hausa',
            haw: 'Hawaiian',
            iw: 'Hebrew',
            hi: 'Hindi',
            hmn: 'Hmong',
            hu: 'Hungarian',
            is: 'Icelandic',
            ig: 'Igbo',
            id: 'Indonesian',
            ga: 'Irish',
            it: 'Italian',
            ja: 'Japanese',
            jw: 'Javanese',
            kn: 'Kannada',
            kk: 'Kazakh',
            km: 'Khmer',
            ko: 'Korean',
            ku: 'Kurdish (Kurmanji)',
            ky: 'Kyrgyz',
            lo: 'Lao',
            la: 'Latin',
            lv: 'Latvian',
            lt: 'Lithuanian',
            lb: 'Luxembourgish',
            mk: 'Macedonian',
            mg: 'Malagasy',
            ms: 'Malay',
            ml: 'Malayalam',
            mt: 'Maltese',
            mi: 'Maori',
            mr: 'Marathi',
            mn: 'Mongolian',
            my: 'Myanmar (Burmese)',
            ne: 'Nepali',
            no: 'Norwegian',
            ps: 'Pashto',
            fa: 'Persian',
            pl: 'Polish',
            pt: 'Portuguese',
            ma: 'Punjabi',
            ro: 'Romanian',
            ru: 'Russian',
            sm: 'Samoan',
            gd: 'Scots Gaelic',
            sr: 'Serbian',
            st: 'Sesotho',
            sn: 'Shona',
            sd: 'Sindhi',
            si: 'Sinhala',
            sk: 'Slovak',
            sl: 'Slovenian',
            so: 'Somali',
            es: 'Spanish',
            su: 'Sudanese',
            sw: 'Swahili',
            sv: 'Swedish',
            tg: 'Tajik',
            ta: 'Tamil',
            te: 'Telugu',
            th: 'Thai',
            tr: 'Turkish',
            uk: 'Ukrainian',
            ur: 'Urdu',
            uz: 'Uzbek',
            vi: 'Vietnamese',
            cy: 'Welsh',
            xh: 'Xhosa',
            yi: 'Yiddish',
            yo: 'Yoruba',
            zu: 'Zulu'
        }

        // Determine if the language is valid.
        if (Object.keys(languages).includes(language)) {
            // Translate the response.
            const translation = await translate(documentAnswer, {to: language});
            const modifiedBody = `English: ${documentAnswer} \n${languages[language]}: ${translation}`;

            // Push the modified response to the array.
            body.push({response: modifiedBody.replaceAll('\\n', '\n')});
        }
        else {
            res.status(400);
            return res.json({error: 'Invalid language'});
        }
    }

    /**
     * Response.
     * Send the response to the client.
     * @returns {Object.<JSON>}
     */
    if (body.length !== 0) {
        res.status(200);
        return res.json(JSON.parse(JSON.stringify(body[0])));
    }
    else {
        res.status(500);
        return res.json({ error: 'Failed to generate response' });
    }
});
