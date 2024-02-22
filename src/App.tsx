import React, { useState, useEffect } from "react";
import "./App.css";

interface TranslationData {
  data: {
    translations: {
      translatedText: string;
    }[];
  };
}
const recognition =
  "webkitSpeechRecognition" in window
    ? new (window as any).webkitSpeechRecognition()
    : null;

if (recognition) {
  recognition.lang = "en-US";
}
export const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText) {
        translateText(inputText);
      }
    }, 500); // Atraso de 500 milissegundos

    return () => clearTimeout(timer); // Limpa o timer quando o componente é desmontado ou o inputText é alterado
  }, [inputText]);

  const apiKey = process.env.API_KEY;
  console.log(apiKey);
  const translateText = async (text: string) => {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&source=en&target=pt&format=text&q=${encodeURIComponent(
          text
        )}`
      );
      const data: TranslationData = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      setTranslatedText(translatedText);
    } catch (error) {
      console.error("Erro ao traduzir:", error);
    }
  };

  useEffect(() => {
    if (translatedText !== "") {
      speak(translatedText);
    }
  }, [translatedText]);

  const startListening = () => {
    setListening(true);
    if (recognition) {
      recognition.onresult = (event: any) => {
        const speechToText = event.results[0][0].transcript;
        setInputText(speechToText);
        recognition.stop();
        setListening(false);
      };
      recognition.start();
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container">
      <h1>Translator</h1>
      <p className="description">Digite ou fale palavras em inglês</p>
      <div className="wrapper">
        <div className="inputs">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="Fale ou digite aqui..."
            rows={4}
            cols={50}
          />
          <div className="translated-container">
            <p>{translatedText}</p>
          </div>
        </div>
        <button onClick={startListening} disabled={listening}>
          {listening ? "Ouvindo..." : <img src="/assets/micro.png" style={{width:"60px"}} alt="microphone"/>}
        </button>
      </div>
    </div>
  );
};
