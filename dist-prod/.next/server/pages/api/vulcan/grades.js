"use strict";(()=>{var e={};e.id=233,e.ids=[233],e.modules={1594:e=>{e.exports=require("hebece")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,o){return o in t?t[o]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,o)):"function"==typeof t&&"default"===o?t:void 0}}})},3324:(e,t,o)=>{o.r(t),o.d(t,{config:()=>s,default:()=>u,routeModule:()=>d});var r={};o.r(r),o.d(r,{default:()=>c});var n=o(1802),a=o(7153),l=o(6249),i=o(890);async function c(e,t){try{console.log("[API DEBUG] Grades API called"),console.log("[API DEBUG] Fetching grades");let e=await (0,i.ZN)();return e&&Array.isArray(e)?(console.log(`[API DEBUG] Received ${e.length} grades`),e.length>0&&console.log("[API DEBUG] Sample grade:",e[0])):console.log("[API DEBUG] Unexpected response format:",e),t.status(200).json(e)}catch(e){return console.error("[API DEBUG] Error in grades API:",e),t.status(500).json({error:"Ошибка при получении данных об оценках"})}}let u=(0,l.l)(r,"default"),s=(0,l.l)(r,"config"),d=new n.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/vulcan/grades",pathname:"/api/vulcan/grades",bundlePath:"",filename:""},userland:r})},890:(e,t,o)=>{let r,n,a,l;o.d(t,{ZN:()=>I,_P:()=>s,bh:()=>h,tj:()=>u,w7:()=>d});{let e=o(1594);r=e.Keypair,n=e.VulcanJwtRegister,a=e.VulcanHebeCe}try{let e='<html><head></head><body><input id="ap" type="hidden" value="{&quot;Tokens&quot;:[&quot;eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFrc3ltIE1vcnlrb24gKFpTRS1JKSIsInVpZCI6IjNkYzU3ZWQwLTk2NjgtNDAyZS04MmU5LTUzYzBkYTVmOGFiYSIsInRlbmFudCI6ImxvZHoiLCJ1bml0dWlkIjoiNjdiMTA2NDktOWRjZS00NzM4LTlhMzItODhlM2M3YzFlYzg4IiwidXJpIjoiaHR0cHM6Ly91Y3plbi5lZHV2dWxjYW4ucGwvbG9kei9zdGFydD9wcm9maWw9M2RjNTdlZDAtOTY2OC00MDJlLTgyZTktNTNjMGRhNWY4YWJhIiwic2VydmljZSI6IlRydWUiLCJjYXBzIjoiW1wiRURVVlVMQ0FOX1BSRU1JVU1cIl0iLCJuYmYiOjE3NDIxNTM2NDEsImV4cCI6MTc0MjE1NzI0MSwiaWF0IjoxNzQyMTUzNjQxfQ.T6pn5UFokG21_cd0FbZJ84NInbtpfJn6o5vOEO8phbLJ0uQix86ECEXUNSOcpTQUTjhCbKlcsl4tvXMQ1Sx5X-fRdgritrY-bMSuDMKYzMp5KU-eXINZBhAVXDl71caKs_eNeFnpjXor0UL0NutHCKZet8RIlIiA8uEme8xtbYxrKw1ENd7GmDGnUC8jt4mY3gSfhKdP09OwFYqX6IKwUYHvJSCqE6CmzUJ1sw-vTXSg8jKedMbZ0Z6gVtaevadS-JHiL7FN2EZe36ROBOjOP6PXGAdRdLF1OwfbLUqsHdtR2eM61CflovndB6VsJUM4ucmBEmB1O81OtdBt0OjyGQ&quot;],&quot;Alias&quot;:&quot;artemka141008.9@gmail.com&quot;,&quot;Email&quot;:&quot;artemka141008.9@gmail.com&quot;,&quot;EmailCandidate&quot;:null,&quot;GivenName&quot;:null,&quot;Surname&quot;:null,&quot;IsConsentAccepted&quot;:true,&quot;CanAcceptConsent&quot;:true,&quot;AccessToken&quot;:&quot;eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiOTMzMmU5YmYtOGU1ZS00NDVlLTllNzktOTUxYTYzZjdkNzMyIiwiZ3VpZCI6IjVmMWFkNGE0LTU0NTctNDA3OC05MjQxLWFjMWI3OThkYjAxNSIsImh0dHA6Ly9zY2hlbWFzLnZ1bGNhbi5lZHUucGwvd3MvaWRlbnRpdHkvY2xhaW1zL3Byb21ldGV1c3ovYWxpYXMiOiJhcnRlbWthMTQxMDA4LjlAZ21haWwuY29tIiwibmJmIjoxNzQyMTUzNjQxLCJleHAiOjE3NzM2ODk2NDEsImlhdCI6MTc0MjE1MzY0MX0.ZTtfsi57_7D9kUL_RRwKHjZDhFM4VrB-xyhvjevXBVKHeTbvAsb8M11qXPFx8-g5MG-hj-l9DXe95joIt7M_T4gRVk4PlGZ4uChBX5tsKQLDF-tlPL1lU9KIovVCHvxYO0vBkZ8ClqvWfn3QDa361fh9PfRbSj615QDlMZQb0KW1x_2A_8rb6AB7eXJlK-rZKVN4Tefnpm1s7P9PjhHylqTREn5ScIOFaBM9gip2QN26SLzx9U6AMLkl-MPHCYtkip2kv8KeDoDwx0VMdGpY8MvFWJ8HWrQL8a9DdQQ46zgqGTA8BQwhTzgCOtb5qiIk3CDtMjR0QvNC7eTEikcFPA&quot;,&quot;Capabilities&quot;:[&quot;EMAIL_CONFIRMATION&quot;],&quot;Success&quot;:true,&quot;ErrorMessage&quot;:null}"></body></html>'.match(/<input id="ap" type="hidden" value="(.*?)"><\/body>/);if(e&&e[1]){let t=e[1].replace(/&quot;/g,'"');l=JSON.parse(t)}else console.error("Could not extract JSON from APIAP_VULCAN environment variable"),l={}}catch(e){console.error("Error parsing APIAP_VULCAN:",e),l={}}let i=`<html><head></head><body><input id="ap" type="hidden" value='${JSON.stringify(l)}' /></body></html>`,c=async()=>{try{let e=await new r().init(),t=await new n(e,i,0).init(),o=new a(e,t.Envelope.RestURL);return await o.connect(),o}catch(e){throw console.error("Failed to initialize Vulcan API:",e),Error("Failed to connect to Vulcan API")}},u=async(e,t)=>{try{let o=await c(),r=new Date(e),n=new Date(t);return(await o.getLessons(r,n)).Envelope||[]}catch(e){throw console.error("Error fetching lessons:",e),e}},s=async(e,t)=>{try{let o=await c(),r=new Date(e),n=new Date(t);return(await o.getExams(r,n)).Envelope||[]}catch(e){throw console.error("Error fetching exams:",e),e}},d=async(e,t)=>{try{let o=await c(),r=new Date(e),n=new Date(t);return(await o.getAttendance(r,n)).Envelope||[]}catch(e){throw console.error("Error fetching attendance:",e),e}},I=async()=>{try{let e=await c();return(await e.getGrades()).Envelope||[]}catch(e){throw console.error("Error fetching grades:",e),e}},h=async(e,t)=>{try{console.log(`[API CLIENT DEBUG] getHomework called with dates: ${e} to ${t}`);let o=await c(),r=new Date(e),n=new Date(t);console.log(`[API CLIENT DEBUG] Parsed dates: ${r.toISOString()} to ${n.toISOString()}`),console.log("[API CLIENT DEBUG] Calling hebe.getHomework...");let a=await o.getHomework(r,n);if(console.log("[API CLIENT DEBUG] Raw API response:",a),a&&a.Envelope)return console.log(`[API CLIENT DEBUG] Found Envelope with ${Array.isArray(a.Envelope)?a.Envelope.length:"non-array"} items`),a.Envelope||[];if(a&&Array.isArray(a))return console.log(`[API CLIENT DEBUG] Found array with ${a.length} items`),a;return console.log("[API CLIENT DEBUG] Unexpected data structure:",a),[]}catch(e){throw console.error("[API CLIENT DEBUG] Error fetching homework:",e),e}}},7153:(e,t)=>{var o;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return o}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(o||(o={}))},1802:(e,t,o)=>{e.exports=o(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var o=t(t.s=3324);module.exports=o})();