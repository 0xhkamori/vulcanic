if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>a(e,i),o={module:{uri:i},exports:c,require:r};s[i]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/2dU9DNY-yj0NjQI8-i2ic/_buildManifest.js",revision:"93119bbc4487066c7488f970590fae46"},{url:"/_next/static/2dU9DNY-yj0NjQI8-i2ic/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/290-da240a756ded416a.js",revision:"da240a756ded416a"},{url:"/_next/static/chunks/319-68d533c9403b9234.js",revision:"68d533c9403b9234"},{url:"/_next/static/chunks/356-38e593c881205643.js",revision:"38e593c881205643"},{url:"/_next/static/chunks/403-1424c5d40e4ba7cf.js",revision:"1424c5d40e4ba7cf"},{url:"/_next/static/chunks/420-e2d85e4e5a5cb4cb.js",revision:"e2d85e4e5a5cb4cb"},{url:"/_next/static/chunks/662-70cf7ed657269b77.js",revision:"70cf7ed657269b77"},{url:"/_next/static/chunks/framework-64ad27b21261a9ce.js",revision:"64ad27b21261a9ce"},{url:"/_next/static/chunks/main-f22189049e90ad47.js",revision:"f22189049e90ad47"},{url:"/_next/static/chunks/pages/_app-b880417c0cbbc1da.js",revision:"b880417c0cbbc1da"},{url:"/_next/static/chunks/pages/_error-7a92967bea80186d.js",revision:"7a92967bea80186d"},{url:"/_next/static/chunks/pages/dashboard-9249adab58d679a2.js",revision:"9249adab58d679a2"},{url:"/_next/static/chunks/pages/dashboard/attendance-17332176366b8648.js",revision:"17332176366b8648"},{url:"/_next/static/chunks/pages/dashboard/grades-9cea663a3ef8a7de.js",revision:"9cea663a3ef8a7de"},{url:"/_next/static/chunks/pages/dashboard/homework-848c178d927b2dbe.js",revision:"848c178d927b2dbe"},{url:"/_next/static/chunks/pages/dashboard/profile-72f959344da25038.js",revision:"72f959344da25038"},{url:"/_next/static/chunks/pages/dashboard/schedule-96ba71408decd51a.js",revision:"96ba71408decd51a"},{url:"/_next/static/chunks/pages/dashboard/test-64b84ee6b5dacf5a.js",revision:"64b84ee6b5dacf5a"},{url:"/_next/static/chunks/pages/index-44754563d3a96c1d.js",revision:"44754563d3a96c1d"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-87b3a303122f2f0d.js",revision:"87b3a303122f2f0d"},{url:"/_next/static/css/50c4905e33a4c6d3.css",revision:"50c4905e33a4c6d3"},{url:"/images/gitkeep",revision:"68b329da9893e34099c7d8ad5cb9c940"},{url:"/images/ico.png",revision:"3968b1d06d8ef5f5a60737af9bb8f924"},{url:"/manifest.json",revision:"bf888645705d72b6ff05a112f19c3ac4"},{url:"/manifest.ts",revision:"9f00c428e6c9db2d94ff3e2deb741055"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
