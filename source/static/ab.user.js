// ==UserScript==
// @name         Anonymous BetterFlorr
// @namespace    https://littleswift.moe/
// @version      1.6.4
// @description  Use BetterFlorr anonymously
// @author       LittleSwift
// @match        https://florr.io/
// @grant        none
// ==/UserScript==
!function(){const e=window.localStorage;!function(){let t,n,r,c,o,a,u;r=function(t){return"cp6_player_id"===t&&(new Error).stack.match(/_0x[0-9a-zA-Z]{6}/)?crypto.randomUUID():e.getItem(t)},u=function(t,n){e.setItem(t,n)},a=function(t){e.removeItem(t)},t=function(){e.clear()},c={set:function(e,t,n){switch(t){case"length":case"getItem":case"setItem":case"removeItem":break;default:return u(t,n)}},get:function(n,c){switch(c){case"length":return e.length;case"getItem":return r;case"setItem":return u;case"removeItem":return a;case"clear":return t;default:const n=r(c);return null!==n?n:void 0}}},n=window.localStorage,o=new Proxy(n,c),Object.defineProperty(window,"localStorage",{get:function(){return o}})}()}();