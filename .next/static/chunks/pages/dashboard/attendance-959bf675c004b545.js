(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[655],{2773:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/dashboard/attendance",function(){return a(1906)}])},1906:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return v}});var n=a(5893),r=a(7294),s=a(1464),l=a(6650),c=a(5720),o=a(9648),i=a(4029),m=a(9681),p=a(4221),d=a(9258),u=a(2911),h=a(3172),y=a(6391),f=a(3492);let g=new Map([["bold",r.createElement(r.Fragment,null,r.createElement("path",{d:"M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm12,24.87A84,84,0,0,1,194,76.07L140,107.22ZM50,159.17a83.94,83.94,0,0,1,66-114.3v76.2ZM128,212a83.88,83.88,0,0,1-65.95-32.07L206,96.83A84,84,0,0,1,128,212Z"}))],["duotone",r.createElement(r.Fragment,null,r.createElement("path",{d:"M128,32v96L44.86,176h0A96,96,0,0,1,128,32Z",opacity:"0.2"}),r.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm71.87,53.27L136,114.14V40.37A88,88,0,0,1,199.87,77.27ZM120,40.37v83l-71.89,41.5A88,88,0,0,1,120,40.37ZM128,216a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"}))],["fill",r.createElement(r.Fragment,null,r.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,16a88,88,0,0,1,71.87,37.27L128,118.76Zm0,176a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"}))],["light",r.createElement(r.Fragment,null,r.createElement("path",{d:"M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm74.74,51.92L134,117.61V38.2A90,90,0,0,1,202.74,77.92ZM122,38.2v86.34L47.24,167.7A90,90,0,0,1,122,38.2ZM128,218a90,90,0,0,1-74.74-39.92L208.76,88.3A90,90,0,0,1,128,218Z"}))],["regular",r.createElement(r.Fragment,null,r.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm71.87,53.27L136,114.14V40.37A88,88,0,0,1,199.87,77.27ZM120,40.37v83l-71.89,41.5A88,88,0,0,1,120,40.37ZM128,216a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"}))],["thin",r.createElement(r.Fragment,null,r.createElement("path",{d:"M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm77.58,50.59L132,121.07v-85A92.07,92.07,0,0,1,205.58,78.59ZM124,36.09v89.6L46.42,170.48A92,92,0,0,1,124,36.09ZM128,220a92,92,0,0,1-77.58-42.59L209.58,85.52A92,92,0,0,1,128,220Z"}))]]);var T=Object.defineProperty,b=Object.defineProperties,x=Object.getOwnPropertyDescriptors,j=Object.getOwnPropertySymbols,Z=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable,E=(e,t,a)=>t in e?T(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,A=(e,t)=>{for(var a in t||(t={}))Z.call(t,a)&&E(e,a,t[a]);if(j)for(var a of j(t))L.call(t,a)&&E(e,a,t[a]);return e},P=(e,t)=>b(e,x(t));let N=(0,r.forwardRef)((e,t)=>r.createElement(f.Z,P(A({ref:t},e),{weights:g})));N.displayName="ChartPie";var v=(0,a(4917).Z)(function(){let e=(0,r.useMemo)(()=>new Date,[]),t=(0,r.useMemo)(()=>e.toLocaleDateString("en-US",{day:"numeric",month:"long",year:"numeric"}),[e]),a=e=>{if(e.PresenceType){if("object"==typeof e.PresenceType&&null!==e.PresenceType){if("number"==typeof e.PresenceType.Id)return 1228===e.PresenceType.Id?0:1229===e.PresenceType.Id?1:1231===e.PresenceType.Id?2:(console.log("Using PresenceType.Id:",e.PresenceType.Id),e.PresenceType.Id);if(void 0!==e.PresenceType.Type)return console.log("Using PresenceType.Type:",e.PresenceType.Type),e.PresenceType.Type}if("number"==typeof e.PresenceType)return 1228===e.PresenceType?0:1229===e.PresenceType?1:1231===e.PresenceType?2:(console.log("Using PresenceType as number:",e.PresenceType),e.PresenceType)}if("number"==typeof e.presenceTypeId)return 1228===e.presenceTypeId?0:1229===e.presenceTypeId?1:1231===e.presenceTypeId?2:(console.log("Using presenceTypeId:",e.presenceTypeId),e.presenceTypeId);if(e.presenceType){let t=-1;switch(e.presenceType){case"present":t=0;break;case"absent":t=1;break;case"late":t=2;break;case"excused":t=3;break;default:t=-1}return console.log("Using presenceType string:",e.presenceType,"→",t),t}return e.LessonId&&void 0===e.PresenceType?(console.log("Assuming default presence type 0 for record with LessonId"),0):void 0!==e.Type?(console.log("Using Type field:",e.Type),"number"==typeof e.Type?e.Type:-1):(console.log("Could not determine presence type, defaulting to 0"),0)},{data:f,isLoading:g,error:T}=(0,i.tm)("attendance");(0,r.useEffect)(()=>{if(f&&f.length>0){console.log("Attendance data:",f[0]),console.log("Total number of records:",f.length),console.log("All keys of first record:",Object.keys(f[0]));let t=e.toISOString().split("T")[0];f.forEach((e,a)=>{let n="";if(e.Date){if("string"==typeof e.Date)n=e.Date.split("T")[0];else if(e.Date instanceof Date)n=e.Date.toISOString().split("T")[0];else if("object"==typeof e.Date){let t=(0,m.sG)(e.Date);t&&(n=t.toISOString().split("T")[0])}}else if(e.Lesson&&e.Lesson.Date){let t=(0,m.sG)(e.Lesson.Date);t&&(n=t.toISOString().split("T")[0])}n&&console.log("Record ".concat(a,": date = ").concat(n,", today = ").concat(t,", match: ").concat(n===t))})}},[f,e]);let b=(0,r.useMemo)(()=>f&&f.length?f:[],[f]),x=(0,r.useMemo)(()=>{if(!b||!b.length)return{total:0,present:0,absent:0,late:0,excused:0,presentPercentage:0,absentPercentage:0,latePercentage:0};let e=b.length,t=b.filter(e=>1===a(e)||e.PresenceType&&1229===e.PresenceType.Id).length,n=b.filter(e=>0===a(e)||e.PresenceType&&1228===e.PresenceType.Id).length,r=b.filter(e=>2===a(e)||e.PresenceType&&1231===e.PresenceType.Id).length,s=b.filter(e=>3===a(e)).length,l=t+n+r+s;return{total:e,present:t,absent:n,late:r,excused:s,presentPercentage:l?Math.round(t/l*100):0,absentPercentage:l?Math.round(n/l*100):0,latePercentage:l?Math.round(r/l*100):0}},[b]),j=(0,r.useMemo)(()=>{if(!b||!b.length)return[];let e=new Map;return b.some(e=>e.Date||e.date||e.Lesson&&e.Lesson.Date)?b.forEach(t=>{let a="Today";t.Date?a=(0,m.p6)(t.Date):t.date?a=(0,m.p6)(t.date):t.Lesson&&t.Lesson.Date&&(a=(0,m.p6)(t.Lesson.Date)),e.has(a)||e.set(a,[]),e.get(a).push(t)}):e.set("Today",b),Array.from(e.entries()).sort((e,t)=>{if("Today"===e[0])return -1;if("Today"===t[0]||"No date"===e[0])return 1;if("No date"===t[0])return -1;let a=new Date(e[0].split(".").reverse().join("-"));return new Date(t[0].split(".").reverse().join("-")).getTime()-a.getTime()})},[b]),Z=e=>{switch(e){case 0:return(0,n.jsx)(d.f,{size:20,weight:"fill",className:"text-green-500"});case 1:return(0,n.jsx)(u.a,{size:20,weight:"fill",className:"text-red-500"});case 2:return(0,n.jsx)(h.S,{size:20,weight:"fill",className:"text-orange-500"});case 3:return(0,n.jsx)(d.f,{size:20,weight:"fill",className:"text-blue-500"});default:return(0,n.jsx)(u.a,{size:20,weight:"fill",className:"text-text-secondary"})}};return(0,n.jsx)(s.Z,{title:"Attendance",children:g?(0,n.jsx)(c.Z,{text:"Loading attendance data..."}):T?(0,n.jsx)(o.Z,{message:T.message}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)("div",{className:"mb-5",children:[(0,n.jsx)("div",{className:"flex justify-center items-center mb-4",children:(0,n.jsxs)("h2",{className:"font-mono text-lg flex items-center",children:[(0,n.jsx)(y.f,{size:20,className:"mr-2 text-primary"}),t]})}),(0,n.jsxs)(l.Z,{className:"p-4",children:[(0,n.jsxs)("h3",{className:"text-lg font-mono font-bold mb-3 flex items-center",children:[(0,n.jsx)(N,{size:20,className:"mr-2 text-primary"}),"Attendance Statistics"]}),(0,n.jsxs)("div",{className:"grid grid-cols-2 gap-3 mb-3",children:[(0,n.jsxs)("div",{className:"bg-surface p-3 rounded-lg",children:[(0,n.jsx)("div",{className:"text-text-secondary text-sm mb-1",children:"Absence"}),(0,n.jsxs)("div",{className:"flex items-center",children:[(0,n.jsxs)("div",{className:"text-xl font-bold text-red-500 mr-2",children:[x.presentPercentage,"%"]}),(0,n.jsxs)("div",{className:"text-sm text-text-secondary",children:["(",x.present," of ",x.total,")"]})]})]}),(0,n.jsxs)("div",{className:"bg-surface p-3 rounded-lg",children:[(0,n.jsx)("div",{className:"text-text-secondary text-sm mb-1",children:"Presence"}),(0,n.jsxs)("div",{className:"flex items-center",children:[(0,n.jsxs)("div",{className:"text-xl font-bold text-green-500 mr-2",children:[x.absentPercentage,"%"]}),(0,n.jsxs)("div",{className:"text-sm text-text-secondary",children:["(",x.absent," of ",x.total,")"]})]})]})]})]})]}),(0,n.jsx)("div",{className:"space-y-5",children:j.length>0?j.map(e=>{let[t,r]=e;return(0,n.jsxs)("div",{className:"space-y-2",children:[(0,n.jsx)("h3",{className:"text-lg font-mono font-bold px-1",children:t}),(0,n.jsx)(p.E.div,{initial:{opacity:0},animate:{opacity:1},transition:{staggerChildren:.05},className:"space-y-2",children:r.map((e,t)=>{let r=a(e),s=(0,m._j)(e),c="Lesson";e.Subject?c="object"==typeof e.Subject&&e.Subject.Name?e.Subject.Name:String(e.Subject):e.subject?c=String(e.subject):e.Lesson&&e.Lesson.Subject&&(c="object"==typeof e.Lesson.Subject&&e.Lesson.Subject.Name?e.Lesson.Subject.Name:String(e.Lesson.Subject));let o=(0,m.mr)(e.TimeStart||e.timeStart||(e.TimeSlot&&e.TimeSlot.TimeStart?e.TimeSlot.TimeStart:null)||(e.Lesson&&e.Lesson.TimeStart?e.Lesson.TimeStart:null)||(e.Lesson&&e.Lesson.TimeSlot&&e.Lesson.TimeSlot.TimeStart?e.Lesson.TimeSlot.TimeStart:null)),i=(0,m.mr)(e.TimeEnd||e.timeEnd||(e.TimeSlot&&e.TimeSlot.TimeEnd?e.TimeSlot.TimeEnd:null)||(e.Lesson&&e.Lesson.TimeEnd?e.Lesson.TimeEnd:null)||(e.Lesson&&e.Lesson.TimeSlot&&e.Lesson.TimeSlot.TimeEnd?e.Lesson.TimeSlot.TimeEnd:null)),d="";e.Teacher?d="object"==typeof e.Teacher&&e.Teacher.DisplayName?e.Teacher.DisplayName:String(e.Teacher):e.teacher?d=String(e.teacher):e.TeacherPrimary&&e.TeacherPrimary.DisplayName?d=e.TeacherPrimary.DisplayName:e.Lesson&&(e.Lesson.Teacher?d="object"==typeof e.Lesson.Teacher&&e.Lesson.Teacher.DisplayName?e.Lesson.Teacher.DisplayName:String(e.Lesson.Teacher):e.Lesson.TeacherPrimary&&e.Lesson.TeacherPrimary.DisplayName&&(d=e.Lesson.TeacherPrimary.DisplayName));let u=e.LessonId||(e.Lesson?e.Lesson.Id:null);return(0,n.jsx)(p.E.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},transition:{duration:.3},children:(0,n.jsx)(l.Z,{className:"p-4",children:(0,n.jsxs)("div",{className:"flex items-center gap-3",children:[(0,n.jsx)("div",{className:"flex-shrink-0",children:Z(r)}),(0,n.jsxs)("div",{className:"flex-1",children:[(0,n.jsxs)("div",{className:"flex justify-between",children:[(0,n.jsx)("h4",{className:"font-medium",children:c}),(0,n.jsx)("span",{className:"text-sm ".concat(s.color),children:s.status})]}),(0,n.jsxs)("div",{className:"text-sm text-text-secondary",children:["N/A"!==o&&"N/A"!==i?(0,n.jsxs)("span",{children:[o," - ",i]}):(0,n.jsx)("span",{children:"n/a"}),d&&(0,n.jsxs)("span",{className:"ml-2",children:["• ",d]}),u&&(0,n.jsxs)("span",{className:"ml-2 text-xs",children:["ID: ",u]})]})]})]})})},t)})})]},t)}):(0,n.jsx)(l.Z,{className:"p-6 text-center",children:(0,n.jsx)("p",{className:"text-text-secondary",children:"No attendance data"})})})]})})})},9258:function(e,t,a){"use strict";a.d(t,{f:function(){return y}});var n=a(7294),r=a(3492);let s=new Map([["bold",n.createElement(n.Fragment,null,n.createElement("path",{d:"M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"}))],["duotone",n.createElement(n.Fragment,null,n.createElement("path",{d:"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z",opacity:"0.2"}),n.createElement("path",{d:"M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"}))],["fill",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"}))],["light",n.createElement(n.Fragment,null,n.createElement("path",{d:"M172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"}))],["regular",n.createElement(n.Fragment,null,n.createElement("path",{d:"M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"}))],["thin",n.createElement(n.Fragment,null,n.createElement("path",{d:"M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"}))]]);var l=Object.defineProperty,c=Object.defineProperties,o=Object.getOwnPropertyDescriptors,i=Object.getOwnPropertySymbols,m=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable,d=(e,t,a)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,u=(e,t)=>{for(var a in t||(t={}))m.call(t,a)&&d(e,a,t[a]);if(i)for(var a of i(t))p.call(t,a)&&d(e,a,t[a]);return e},h=(e,t)=>c(e,o(t));let y=(0,n.forwardRef)((e,t)=>n.createElement(r.Z,h(u({ref:t},e),{weights:s})));y.displayName="CheckCircle"},3172:function(e,t,a){"use strict";a.d(t,{S:function(){return y}});var n=a(7294),r=a(3492);let s=new Map([["bold",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z"}))],["duotone",n.createElement(n.Fragment,null,n.createElement("path",{d:"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z",opacity:"0.2"}),n.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"}))],["fill",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"}))],["light",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm62-90a6,6,0,0,1-6,6H128a6,6,0,0,1-6-6V72a6,6,0,0,1,12,0v50h50A6,6,0,0,1,190,128Z"}))],["regular",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"}))],["thin",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm60-92a4,4,0,0,1-4,4H128a4,4,0,0,1-4-4V72a4,4,0,0,1,8,0v52h52A4,4,0,0,1,188,128Z"}))]]);var l=Object.defineProperty,c=Object.defineProperties,o=Object.getOwnPropertyDescriptors,i=Object.getOwnPropertySymbols,m=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable,d=(e,t,a)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,u=(e,t)=>{for(var a in t||(t={}))m.call(t,a)&&d(e,a,t[a]);if(i)for(var a of i(t))p.call(t,a)&&d(e,a,t[a]);return e},h=(e,t)=>c(e,o(t));let y=(0,n.forwardRef)((e,t)=>n.createElement(r.Z,h(u({ref:t},e),{weights:s})));y.displayName="Clock"},2911:function(e,t,a){"use strict";a.d(t,{a:function(){return y}});var n=a(7294),r=a(3492);let s=new Map([["bold",n.createElement(n.Fragment,null,n.createElement("path",{d:"M168.49,104.49,145,128l23.52,23.51a12,12,0,0,1-17,17L128,145l-23.51,23.52a12,12,0,0,1-17-17L111,128,87.51,104.49a12,12,0,0,1,17-17L128,111l23.51-23.52a12,12,0,0,1,17,17ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"}))],["duotone",n.createElement(n.Fragment,null,n.createElement("path",{d:"M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z",opacity:"0.2"}),n.createElement("path",{d:"M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"}))],["fill",n.createElement(n.Fragment,null,n.createElement("path",{d:"M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"}))],["light",n.createElement(n.Fragment,null,n.createElement("path",{d:"M164.24,100.24,136.48,128l27.76,27.76a6,6,0,1,1-8.48,8.48L128,136.48l-27.76,27.76a6,6,0,0,1-8.48-8.48L119.52,128,91.76,100.24a6,6,0,0,1,8.48-8.48L128,119.52l27.76-27.76a6,6,0,0,1,8.48,8.48ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"}))],["regular",n.createElement(n.Fragment,null,n.createElement("path",{d:"M165.66,101.66,139.31,128l26.35,26.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"}))],["thin",n.createElement(n.Fragment,null,n.createElement("path",{d:"M162.83,98.83,133.66,128l29.17,29.17a4,4,0,0,1-5.66,5.66L128,133.66,98.83,162.83a4,4,0,0,1-5.66-5.66L122.34,128,93.17,98.83a4,4,0,0,1,5.66-5.66L128,122.34l29.17-29.17a4,4,0,1,1,5.66,5.66ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"}))]]);var l=Object.defineProperty,c=Object.defineProperties,o=Object.getOwnPropertyDescriptors,i=Object.getOwnPropertySymbols,m=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable,d=(e,t,a)=>t in e?l(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,u=(e,t)=>{for(var a in t||(t={}))m.call(t,a)&&d(e,a,t[a]);if(i)for(var a of i(t))p.call(t,a)&&d(e,a,t[a]);return e},h=(e,t)=>c(e,o(t));let y=(0,n.forwardRef)((e,t)=>n.createElement(r.Z,h(u({ref:t},e),{weights:s})));y.displayName="XCircle"}},function(e){e.O(0,[403,690,435,2,888,774,179],function(){return e(e.s=2773)}),_N_E=e.O()}]);