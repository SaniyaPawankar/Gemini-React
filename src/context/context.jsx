import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([ ]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord ) => {
          setTimeout(function () {
            setResultData(prev => prev+nextWord);
          }, 75*index);
    }
   

    /*Executing this function will hide the result and shows the card section of website*/
    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response ;
        if(prompt !== undefined){
            response = await run(prompt);
            setRecentPrompt(prompt);

        }
        else{
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }
        
        let responseArray = response.split("**");
        let newArray = "" ;
        for(let i=0; i<responseArray.length; i++){
            if(i===0 ||  i%2 !== 1){
                newArray += responseArray[i];
            }
            else{
                newArray += "<b>"+responseArray[i]+"</b>";
            }
        }
       let newResponse = newArray.split('*').join("</br>");
       let newResponseArray = newResponse.split(" ");
       /*To Add Typing Effect*/ 
       for(let i=0; i<newResponseArray.length;i++)
       {
         const nextWord = newResponseArray[i];
         delayPara(i, nextWord+" ");
       }
        setResultData(newResponse)
        setLoading(false)
        setInput("")
    }


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}


export default ContextProvider;

//to access this context in our project we will open main.jsx

