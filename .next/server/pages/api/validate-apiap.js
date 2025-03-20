"use strict";(()=>{var e={};e.id=154,e.ids=[154],e.modules={1594:e=>{e.exports=require("hebece")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},2615:(e,t,r)=>{r.r(t),r.d(t,{config:()=>A,default:()=>P,routeModule:()=>u});var o={};r.r(o),r.d(o,{default:()=>c});var n=r(1802),a=r(7153),l=r(6249);let i=async e=>{try{let t,o={};if(!e.startsWith("<html>"))return console.error("APIAP string is not in HTML format"),!1;{let t=e.match(/<input id="ap" type="hidden" value="(.*?)"><\/body>/);if(!t||!t[1])return console.error("Failed to extract value attribute from APIAP HTML"),!1;try{let e=t[1].replace(/&quot;/g,'"');o=JSON.parse(e),console.log("Successfully extracted and parsed JSON data from APIAP HTML")}catch(e){return console.error("Failed to parse JSON from APIAP HTML:",e),!1}}let n=`<html><head></head><body><input id="ap" type="hidden" value='${JSON.stringify(o)}' /></body></html>`;try{t=await Promise.resolve().then(r.t.bind(r,1594,23))}catch(e){return console.error("Failed to import hebece module:",e),!1}let a=t.Keypair,l=t.VulcanJwtRegister,i=t.VulcanHebeCe,s=await new a().init();console.log("Keypair initialized, attempting JWT register...");let c=await new l(s,n,0).init();console.log("JWT Register successful, connecting HebeCe...");let P=new i(s,c.Envelope.RestURL);return await P.connect(),global.__APIAP__=n,process.env.RUNTIME_APIAP=n,console.log("APIAP stored in server-side global state and process.env with length:",n.length),!0}catch(e){return console.error("APIAP validation failed:",e),!1}};var s=r(890);async function c(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{apiap:r}=e.body;if(!r)return t.status(400).json({error:"Missing APIAP string in request body"});if("string"!=typeof r||""===r.trim())return t.status(400).json({error:"Invalid APIAP format. The string must be a non-empty string"});if(!r.startsWith("<html>"))return t.status(400).json({error:"Invalid APIAP format. The string must start with <html>"});if(!r.includes('<input id="ap" type="hidden" value="'))return t.status(400).json({error:'Invalid APIAP format. The string must contain an input element with id="ap" and type="hidden"'});if(!r.includes("</body></html>"))return t.status(400).json({error:"Invalid APIAP format. The string must end with </body></html>"});if(console.log("Validating APIAP string of length:",r.length),await i(r))return console.log("APIAP validated and ready for API requests"),global.__APIAP__&&(0,s.G5)(global.__APIAP__),t.status(200).json({success:!0});return t.status(401).json({error:"Invalid API key. Please check the APIAP string and try again."})}catch(e){return console.error("Error validating APIAP:",e),t.status(500).json({error:"Failed to validate APIAP. Please try again."})}}let P=(0,l.l)(o,"default"),A=(0,l.l)(o,"config"),u=new n.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/validate-apiap",pathname:"/api/validate-apiap",bundlePath:"",filename:""},userland:o})},890:(e,t,r)=>{let o,n,a;r.d(t,{G5:()=>i,ZN:()=>u,_P:()=>P,bh:()=>d,gq:()=>g,tj:()=>c,w7:()=>A});let l=async()=>{try{let e=await Promise.resolve().then(r.t.bind(r,1594,23));return o=e.Keypair,n=e.VulcanJwtRegister,a=e.VulcanHebeCe,!0}catch(e){console.error("Failed to import hebece module:",e)}return!1};l().catch(e=>{console.error("Failed to initialize server modules:",e)});let i=e=>{e&&(console.log("Setting server-side APIAP cache"),global.__APIAP__=e,process.env.RUNTIME_APIAP=e,console.log("APIAP stored in both global state and process.env"))};(e=>{if(e)try{if(e.startsWith("<html>"))return e;let t={};if(e.trim().startsWith("{"))try{t=JSON.parse(e)}catch(e){console.error("Failed to parse APIAP as JSON:",e)}else{let r=e.match(/<input id="ap" type="hidden" value="(.*?)"><\/body>/);if(r&&r[1]){let e=r[1].replace(/&quot;/g,'"');try{t=JSON.parse(e)}catch(e){console.error("Failed to parse extracted HTML value as JSON:",e)}}}return`<html><head></head><body><input id="ap" type="hidden" value='${JSON.stringify(t)}' /></body></html>`}catch(e){return console.error("Error formatting APIAP string:",e),null}})(process.env.RUNTIME_APIAP?(console.log("Using APIAP from process.env"),global.__APIAP__=process.env.RUNTIME_APIAP,process.env.RUNTIME_APIAP):global.__APIAP__?(console.log("Using server-side cached APIAP from global state"),process.env.RUNTIME_APIAP=global.__APIAP__,global.__APIAP__):(console.warn("No APIAP available on server without explicit configuration"),null));let s=async()=>{let e=process.env.RUNTIME_APIAP||global.__APIAP__;if(console.log("[API CLIENT] APIAP state check:",e?`APIAP found with length: ${e.length}`:"No APIAP found in available state"),!e)throw console.error("No valid APIAP string available. Cannot initialize Vulcan API."),console.log("[API CLIENT] Available global properties:",Object.keys(global).join(", ")),Error("No valid API key found. Please authenticate first.");try{if((!o||!n||!a)&&(console.log("[API CLIENT] Initializing server modules..."),!await l()))throw Error("Failed to initialize required modules");console.log("[API CLIENT] Using server-side APIAP for API initialization...");let t=await new o().init();console.log("[API CLIENT] Keypair initialized, creating JWT register with APIAP...");let r=await new n(t,e,0).init();console.log("[API CLIENT] JWT register successful, RestURL:",r.Envelope.RestURL);let i=new a(t,r.Envelope.RestURL);return console.log("[API CLIENT] Connecting HebeCe..."),await i.connect(),console.log("[API CLIENT] HebeCe connected successfully"),global.__APIAP__=e,process.env.RUNTIME_APIAP=e,i}catch(e){throw console.error("[API CLIENT] Failed to initialize Vulcan API:",e),Error("Failed to connect to Vulcan API")}},c=async(e,t)=>{try{let r=await s(),o=new Date(e),n=new Date(t);return(await r.getLessons(o,n)).Envelope||[]}catch(e){throw console.error("Error fetching lessons:",e),e}},P=async(e,t)=>{try{let r=await s(),o=new Date(e),n=new Date(t);return(await r.getExams(o,n)).Envelope||[]}catch(e){throw console.error("Error fetching exams:",e),e}},A=async(e,t)=>{try{let r=await s(),o=new Date(e),n=new Date(t);return(await r.getAttendance(o,n)).Envelope||[]}catch(e){throw console.error("Error fetching attendance:",e),e}},u=async()=>{try{let e=await s();return(await e.getGrades()).Envelope||[]}catch(e){throw console.error("Error fetching grades:",e),e}},d=async(e,t)=>{try{console.log(`[API CLIENT DEBUG] getHomework called with dates: ${e} to ${t}`);let r=await s(),o=new Date(e),n=new Date(t);console.log(`[API CLIENT DEBUG] Parsed dates: ${o.toISOString()} to ${n.toISOString()}`),console.log("[API CLIENT DEBUG] Calling hebe.getHomework...");let a=await r.getHomework(o,n);if(console.log("[API CLIENT DEBUG] Raw API response:",a),a&&a.Envelope)return console.log(`[API CLIENT DEBUG] Found Envelope with ${Array.isArray(a.Envelope)?a.Envelope.length:"non-array"} items`),a.Envelope||[];if(a&&Array.isArray(a))return console.log(`[API CLIENT DEBUG] Found array with ${a.length} items`),a;return console.log("[API CLIENT DEBUG] Unexpected data structure:",a),[]}catch(e){throw console.error("[API CLIENT DEBUG] Error fetching homework:",e),e}},g=async(e,t)=>{try{console.log(`[API CLIENT DEBUG] getChangedLessons called with dates: ${e} to ${t}`);let r=await s(),o=new Date(e),n=new Date(t);console.log(`[API CLIENT DEBUG] Parsed dates for substitutions: ${o.toISOString()} to ${n.toISOString()}`),console.log("[API CLIENT DEBUG] Calling hebe.getChangedLessons...");let a=await r.getChangedLessons(o,n);if(console.log("[API CLIENT DEBUG] Raw API response for substitutions:",a),a&&a.Envelope)return console.log(`[API CLIENT DEBUG] Found Envelope with ${Array.isArray(a.Envelope)?a.Envelope.length:"non-array"} substitutions`),a.Envelope||[];if(a&&Array.isArray(a))return console.log(`[API CLIENT DEBUG] Found array with ${a.length} substitutions`),a;return console.log("[API CLIENT DEBUG] Unexpected data structure for substitutions:",a),[]}catch(e){throw console.error("[API CLIENT DEBUG] Error fetching substitutions:",e),e}}},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=2615);module.exports=r})();