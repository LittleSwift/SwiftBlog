// ==UserScript==
// @name         Quizlet Cheat
// @namespace    http://tampermonkey.net/
// @version      2024-10-03
// @description  try to take over the world!
// @author       LittleSwift
// @match        https://quizlet.com/*/learn*
// @match        https://quizlet.com/*/test*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        if(location.href.includes("/learn")){
            let button = document.createElement("button");
            button.innerText = "Get Answer";
            button.onclick = ()=>{
                let question = document.getElementsByClassName("FormattedText notranslate FormattedTextWithImage-wrapper lang-math")[0].attributes.getNamedItem("aria-label").textContent;
                for(let i in __NEXT_DATA__.props.pageProps.studyModesCommon.studiableDocumentData.studiableItems){
                    let obj = __NEXT_DATA__.props.pageProps.studyModesCommon.studiableDocumentData.studiableItems[i];
                    if(obj.cardSides[1].media[0].plainText==question){
                        let input = document.getElementsByClassName("AssemblyInput-input")[0];
                        let selects = document.querySelector("div[data-testid='MCQ Answers']");
                        const newValue = obj.cardSides[0].media[0].plainText;
                        if(input){
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                            nativeInputValueSetter.call(input, newValue);
                            const inputEvent = new Event('input', { bubbles: true });
                            input.dispatchEvent(inputEvent);
                            document.querySelector("button[aria-label='Answer']").click();
                        }else if(selects){
                            for(let j in selects.children){
                                const child = selects.children[j].children[1].children[0].children[0].attributes.getNamedItem("aria-label").textContent;
                                if(child == newValue){
                                    selects.children[j].click();
                                }
                            }
                        }else{
                            alert(obj.cardSides[0].media[0].plainText);
                        }
                    }
                }
            };
            document.getElementsByClassName("StudyModesLayout")[0].appendChild(button);
        }else if(location.href.includes("/test")){
            let button = document.createElement("button");
            button.innerText = "Solve All";
            button.onclick = ()=>{
                let questions = document.querySelectorAll("article");
                for(let q in questions){
                    let question = questions[q].children[0].children[1].children[0].children[0].attributes.getNamedItem("aria-label").textContent;
                    for(let i in __NEXT_DATA__.props.pageProps.studyModeData.studiableDocumentData.studiableItems){
                        let obj = __NEXT_DATA__.props.pageProps.studyModeData.studiableDocumentData.studiableItems[i];
                        if(obj.cardSides[1].media[0].plainText==question){
                            let selects = questions[q].children[1].children[1];
                            const newValue = obj.cardSides[0].media[0].plainText;
                            for(let j in [0,1,2,3]){
                                const child = selects.children[j].children[1].children[0].children[0].attributes.getNamedItem("aria-label").textContent;
                                if(child == newValue){
                                    selects.children[j].click();
                                }
                            }
                        }
                    }
                }
            };
            document.querySelector("section[data-testid='mcq-test-section']").prepend(button);

        }
    },1000);
})();