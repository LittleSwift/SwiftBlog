// ==UserScript==
// @name         College Board自动答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成答题
// @author       LittleSwift
// @match        https://apclassroom.collegeboard.org/*
// @match        *.learnosity.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.top === window.self) {
        window.addEventListener("message", function(event) {
            if (event.data && event.data.type === "XHR_INTERCEPT") {
                let questions = JSON.parse(event.data.response).data.apiActivity.questionsApiActivity.questions;
                for(let i=0;i<questions.length;i++){
                    setTimeout((e=questions[i])=>{
                        e.validation.valid_response.value.forEach(f=>{
                            document.querySelector('input[name="'+e.response_id+'"][value="'+f+'"]').click();
                        });
                        document.querySelector('button[data-cy="next-button"]').click();
                    }, 5000+i*1000);
                };
            }
        });

    } else {

        const _XMLHttpRequest = window.XMLHttpRequest;

        class MyXMLHttpRequest extends _XMLHttpRequest {
            open(method, url, async, user, password) {
                this._requestURL = url; // 记录请求 URL
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