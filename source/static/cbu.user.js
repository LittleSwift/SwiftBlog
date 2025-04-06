// ==UserScript==
// @name         College Board自动答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成答题
// @author       LittleSwift
// @match        https://apclassroom.collegeboard.org/*
// @match        *.learnosity.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    if (window.top === window.self) {
        let questions;
        window.addEventListener("message", function(event) {
            if (event.data && event.data.type === "XHR_INTERCEPT") {
                console.error(event);
                questions = JSON.parse(event.data.response).data.apiActivity.questionsApiActivity.questions;
            }
        });
        let slashCount=0;
        let currentString="";
        const commandList=["/ans"];
        document.addEventListener("keydown",(e)=>{
            if(slashCount<1){
                if(e.key=="/"){
                    if(slashCount==0&&currentString.length!=0){
                        currentString="";
                    }
                    slashCount++;
                    setString(currentString+"/");
                    span.focus();
                }else{
                    slashCount=0;
                    setString("");
                }
            }else{
                if(e.metaKey && e.key=="v"){
                    navigator.clipboard.readText().then(text=>{
                        if(text[0]=="/" || slashCount>=1){
                            setString(currentString+text);
                        }
                    });
                }else if(e.key=="Enter"){
                    slashCount=0;
                    proceedCommand();
                }else if(e.key=="Backspace"){
                    setString(currentString.slice(0,currentString.length-1));
                    if(currentString.length<=2){
                        slashCount=0;
                        setString("");
                    }
                }else if(e.key=="Tab"){
                    commandList.forEach(element=>{
                        if(element.startsWith(currentString)){
                            setString(element);
                        }
                    });
                    span.focus();
                }else if(e.key.length>1){
                }else{
                    setString(currentString+e.key);
                }
            }
        });
        let span=document.createElement("span");
        span.style.position="fixed";
        span.style.right="0";
        span.style.bottom="0";
        span.style.fontSize="32px";
        span.style.color="#00000066";
        span.style.zIndex="1000000000";
        document.body.append(span);
        function setString(s){
            currentString=s;
            span.innerText=s;
        }
        function proceedCommand(){
            let commands=currentString.slice(1).split(" ");
            let cmd=commands[0];
            if(cmd=="ans"){
                const index = document.querySelectorAll('div.item').values().find(e=>e.style.visibility=="visible").attributes.getNamedItem("data-index").value;
                const question = questions[index];
                setString(question.validation.valid_response.value);
            }else{
                setString("Unknown command!");
            }
        }

    } else {

        const _XMLHttpRequest = window.XMLHttpRequest;

        class MyXMLHttpRequest extends _XMLHttpRequest {
            open(method, url, async, user, password) {
                this._requestURL = url;
                super.open(method, url, async, user, password);
            }

            send(body) {
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4) {
                        if(this._requestURL.includes("https://items-va.learnosity.com/v2023.2.LTS/activity?")){
                            window.top.postMessage({
                                type: "XHR_INTERCEPT",
                                url: this._requestURL,
                                response: this.responseText
                            }, "*");
                        }
                    }
                });

                super.send(body);
            }
        }
        window.XMLHttpRequest = MyXMLHttpRequest;
    }
})();