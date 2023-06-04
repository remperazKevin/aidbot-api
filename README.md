# AidBot Chatbot API Documentation

> Powered By: [OpenAI](https://openai.com/)

Table of Contents

{{TOC}}

- - -

## API Features
- Problem Processing (Sentiment Analysis, Problem Prioritization)
- Document Similarity Search
- Question Answering
- Multilingual Translation

### Problem Processing
This process works by taking in the user inquiry as content to be analyzed and revised to be used by the API as the basis for the overall process.

By segmenting the content into separate sentences, the AI model that the API uses can perform a sentiment analysis and rank them according to the severity of the sentiment.

Then, after the sentiment analysis, based on the level of severity, the model can now re-arrange the content, addressing the higher level first and the lowest level last.

- - -

### Similarity Search
The AI model performs an index of the given documents and searches for possible matches against the user's inquiry.

- - -

### Question Answering
As the name suggests, the AI model now tries to generate an answer to the user's inquiry based on the searched documents, making the response as straightforward as possible.

- - -

### Translation
This feature is optional to use. But if used, through a third-party translator, the API can have access to translate into over 103 languages.

- - - 

## Installation
This installation guide will walk you through the process of setting up the chatbot on your system.
Installation is fairly straightforward; you can select which of the two options works for you.

### Server POST Request
We recommend the server POST request installation for better security and performance.

#### Prerequisites
- NodeJS
- NPM
- OpenAI API Key
- Support Documents
- Server Port

#### Instructions
1. Extract the chatbot API to your server.
2. In your console, type and run `npm install` to install all required dependencies.
3. You are required to create a `.env` file that should contain your OpenAI API Key and your selected server port.
    1. See `example.env`.
4. Copy over all your support documents inside the `/support` folder.
5. To run the chatbot API, in your console, type and run `npm start`.
6. The console will output the exposed address of the chatbot API to be used as your endpoint.
   1. Your endpoint address should be `http:localhost:<server_port>/aid-bot`
7. You now have successfully set up the chatbot API and is now ready to receive POST requests.

> For security purposes, we recommend that you use a reverse proxy to hide the chatbot API endpoint.
> You can use NGINX or Apache to do this.

##### Installation with Docker
You can use docker to create multiple containers of the chatbot API to be used in a load-balanced environment.

### Integrated
Only use this installation option if you are unable to use the server POST request installation.
Or you do not have access to an external server.

> You may experience performance issues with this installation option.

#### Prerequisites
- NodeJS
- NPM
- OpenAI API Key
- Support Documents

1. Extract the chatbot API to your website's internal root folder.
2. In your console, type and run `npm install` to install all required dependencies.
3. You may need to modify the `index.js` to have an export of the otherwise POST endpoint of the API.
4. You are required to create a `.env` file that should contain your OpenAI API Key.
   1. See `example.env`.
   2. You may ignore the server port as this is not required.
5. Copy over all your support documents inside the `/support` folder.
6. Import the API module export to your website.
7. You now have successfully set up the chatbot API.

> You can use this installation option for testing purposes.
> We recommend the server POST request installation for production.

- - -

## Usage

### Example POST Request
```javascript
const header = new Headers();
header.append('Content-Type', 'application/x-www-form-urlencoded');

const urlencoded = new URLSearchParams();
urlencoded.append('content', pushMessage);
urlencoded.append('language', 'tl');

const requestOptions = {
	method: 'POST',
	headers: header,
	body: urlencoded,
};

fetch('<address>/aid-bot', requestOptions)
	.then((response) => {
		if (response.ok) {
			return response.json();
		}
		else {
			return { response: null };
		}
	})
	.then((result) => {
		if (result.response) {
			// ...display chatbot response...
		}
		else {
			// ...handle missing response...
		}
	})
	.catch((error) => {
		console.log('error', error);
	});
```

### Response
```json
{
	"response": "<bot_response>"
}
```

- - -

## Appendix

#### Supported languages
|  Key  | Language            |
|:-----:|:--------------------|
|  af   | Afrikaans           |
|  sq   | Albanian            |
|  ar   | Arabic              |
|  hy   | Armenian            |
|  az   | Azerbaijani         |
|  eu   | Basque              |
|  be   | Belarusian          |
|  bn   | Bengali             |
|  bs   | Bosnian             |
|  bg   | Bulgarian           |
|  ca   | Catalan             |
|  ceb  | Cebuano             |
|  ny   | Chichewa            |
| zh-cn | Chinese Simplified  |
| zh-tw | Chinese Traditional |
|  co   | Corsican            |
|  hr   | Croatian            |
|  cs   | Czech               |
|  da   | Danish              |
|  nl   | Dutch               |
|  en   | English             |
|  eo   | Esperanto           |
|  et   | Estonian            |
|  tl   | Filipino            |
|  fi   | Finnish             |
|  fr   | French              |
|  fy   | Frisian             |
|  gl   | Galician            |
|  ka   | Georgian            |
|  de   | German              |
|  el   | Greek               |
|  gu   | Gujarati            |
|  ht   | Haitian Creole      |
|  ha   | Hausa               |
|  haw  | Hawaiian            |
|  iw   | Hebrew              |
|  hi   | Hindi               |
|  hmn  | Hmong               |
|  hu   | Hungarian           |
|  is   | Icelandic           |
|  ig   | Igbo                |
|  id   | Indonesian          |
|  ga   | Irish               |
|  it   | Italian             |
|  ja   | Japanese            |
|  jw   | Javanese            |
|  kn   | Kannada             |
|  kk   | Kazakh              |
|  km   | Khmer               |
|  ko   | Korean              |
|  ku   | Kurdish (Kurmanji)  |
|  ky   | Kyrgyz              |
|  lo   | Lao                 |
|  la   | Latin               |
|  lv   | Latvian             |
|  lt   | Lithuanian          |
|  lb   | Luxembourgish       |
|  mk   | Macedonian          |
|  mg   | Malagasy            |
|  ms   | Malay               |
|  ml   | Malayalam           |
|  mt   | Maltese             |
|  mi   | Maori               |
|  mr   | Marathi             |
|  mn   | Mongolian           |
|  my   | Myanmar (Burmese)   |
|  ne   | Nepali              |
|  no   | Norwegian           |
|  ps   | Pashto              |
|  fa   | Persian             |
|  pl   | Polish              |
|  pt   | Portuguese          |
|  ma   | Punjabi             |
|  ro   | Romanian            |
|  ru   | Russian             |
|  sm   | Samoan              |
|  gd   | Scots Gaelic        |
|  sr   | Serbian             |
|  st   | Sesotho             |
|  sn   | Shona               |
|  sd   | Sindhi              |
|  si   | Sinhala             |
|  sk   | Slovak              |
|  sl   | Slovenian           |
|  so   | Somali              |
|  es   | Spanish             |
|  su   | Sudanese            |
|  sw   | Swahili             |
|  sv   | Swedish             |
|  tg   | Tajik               |
|  ta   | Tamil               |
|  te   | Telugu              |
|  th   | Thai                |
|  tr   | Turkish             |
|  uk   | Ukrainian           |
|  ur   | Urdu                |
|  uz   | Uzbek               |
|  vi   | Vietnamese          |
|  cy   | Welsh               |
|  xh   | Xhosa               |
|  yi   | Yiddish             |
|  yo   | Yoruba              |
|  zu   | Zulu                |