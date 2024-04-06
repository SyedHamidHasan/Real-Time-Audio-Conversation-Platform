import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import speech, { useSpeechRecognition } from 'react-speech-recognition';



import './App.css'

function App() {
  
  const{
    listening ,transcript
  }=useSpeechRecognition();
  const [thinking,setThinking]=useState(false);
  const [aiText,setAiText]=useState("");
async function callGpt3API(message ){
  setThinking(true);
  const data= await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${apikey}`
    },
   body:JSON.stringify(
    {
      messages:[{
        role:"user",
        content:message
      },

      ],
      model:"gpt-3.5-turbo",
    }
   ),

  }).then((res)=>res.json());
  setThinking(false);
  return data.choices[0].message.content;
}
useEffect(()=>{
 if(!listening && transcript){
  callGpt3API(transcript).then((response)=>{
    const speechSynthesis=window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(response);
    speechSynthesis.speak(utterance);
    setAiText(response);
  });
 }
},[transcript,listening])
  return (
    <>
     {
      listening?(
      <p>go a head i m listening</p>
      ):(
      <p>click the button and ask me anything</p>
      )
     }
     <button onClick={()=>{
      speech.startListening();
     }}>Start Voice Input</button>
     {transcript && <div>{transcript}</div>}
     {
      thinking && <div>thinking...</div>
     }
     {
      aiText && <div>{aiText}</div>
     }
    </>
  )
}

export default App
