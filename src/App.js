import React, {useState} from 'react';
import './App.css';
import API, { graphqlOperation } from '@aws-amplify/api';
import Amplify, { Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const speakTranslatedImageTextQuery = `query SpeakTranslatedImageText($input: SpeakTranslatedImageTextInput!) {
  speakTranslatedImageText(input: {
    identifyText: {
      key: "myimage.jpg"
    }
    translateText: {
      sourceLanguage: "en"
      targetLanguage: "es"
    }
    convertTextToSpeech: {
      voiceID: "Conchita"
    }
  })
}
`;

function SpeakTranslatedImage() {
  const [ src, setSrc ] = useState('');
  const [ img, setImg ] = useState('');

  function putS3Image(event) {
    const file = event.target.files[0];
    Storage.put(file.name, file)
    .then (async result => {
      setSrc(await speakTranslatedImageTextOP(result.key));
      setImg(await Storage.get(result.key));
    }).catch(err =>console.log(err));
  }
  return (
    <div className="Text">
      <div>
        <h3>Upload Image</h3>
        <input
              type = "file" accept='image/jpeg'
              onChange = {(event) => {
                putS3Image(event)
              }}
          />
        <br />
        { img && <img src = {img} alt="description"></img>}
        { src &&
          <div> <audio id="audioPlayback" controls>
              <source id="audioSource" type="audio/mp3" src = {src}/>
          </audio> </div>
        }
      </div>
    </div>
  );
}
async function speakTranslatedImageTextOP(key) {
  const inputObj = {
    translateText: {
      sourceLanguage: "en", targetLanguage: "es" },
    identifyText: { key },
    convertTextToSpeech: { voiceID: "Conchita" }
  };
  const response = await API.graphql(
    graphqlOperation(speakTranslatedImageTextQuery, { input: inputObj }));
  return response.data.speakTranslatedImageText;
}

function App() {
  return (
    <div className="App">
      <h1>Does I works!!!!???</h1>
      <SpeakTranslatedImage/>
    </div>
  );
}

export default App;
