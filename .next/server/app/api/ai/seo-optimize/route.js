(()=>{var e={};e.id=2870,e.ids=[2870],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4936:(e,t,r)=>{"use strict";r.d(t,{A:()=>c});var o=r(79748),i=r(33873);let a=require("os"),s=async()=>{let e=a.homedir();for(let t of[i.join(process.cwd(),".z-ai-config"),i.join(e,".z-ai-config"),"/etc/.z-ai-config"])try{let e=await o.readFile(t,"utf-8"),r=JSON.parse(e);if(r.baseUrl&&r.apiKey)return r}catch(e){"ENOENT"!==e.code&&console.error(`Error reading or parsing config file at ${t}:`,e)}throw Error("Configuration file not found or invalid. Please create .z-ai-config in your project, home directory, or /etc.")};class n{constructor(e){this.config=e,this.chat={completions:{create:this.createChatCompletion.bind(this)}},this.images={generations:{create:this.createImageGeneration.bind(this)}},this.functions={invoke:this.invokeFunction.bind(this)}}static async create(){return new n(await s())}async createChatCompletion(e){let{baseUrl:t,chatId:r,userId:o,apiKey:i}=this.config,a=`${t}/chat/completions`,s={"Content-Type":"application/json",Authorization:`Bearer ${i}`,"X-Z-AI-From":"Z"};r&&(s["X-Chat-Id"]=r),o&&(s["X-User-Id"]=o);try{let t=await fetch(a,{method:"POST",headers:s,body:JSON.stringify(e)});if(!t.ok){let e=await t.text();throw Error(`API request failed with status ${t.status}: ${e}`)}return await t.json()}catch(e){throw console.error("Failed to make API request:",e),e}}async createImageGeneration(e){let{baseUrl:t,apiKey:r,chatId:o,userId:i}=this.config,a=`${t}/images/generations`,s={"Content-Type":"application/json",Authorization:`Bearer ${r}`,"X-Z-AI-From":"Z"};o&&(s["X-Chat-Id"]=o),i&&(s["X-User-Id"]=i);let n={...e};try{let e=await fetch(a,{method:"POST",headers:s,body:JSON.stringify(n)});if(!e.ok){let t=await e.text();throw Error(`API request failed with status ${e.status}: ${t}`)}let t=await e.json(),r=await Promise.all(t.data.map(async e=>e.url?{base64:await this.downloadImageAsBase64(e.url),format:"png"}:e));return{...t,data:r}}catch(e){throw console.error("Failed to make image generation request:",e),e}}async downloadImageAsBase64(e){try{let t=await fetch(e);if(!t.ok)throw Error(`Failed to download image: ${t.status}`);let r=await t.arrayBuffer(),o=Buffer.from(r).toString("base64");return`${o}`}catch(e){throw console.error("Failed to download and convert image to base64:",e),e}}async invokeFunction(e,t){let{baseUrl:r,apiKey:o,chatId:i,userId:a}=this.config,s=`${r}/functions/invoke`,n={"Content-Type":"application/json",Authorization:`Bearer ${o}`,"X-Z-AI-From":"Z"};i&&(n["X-Chat-Id"]=i),a&&(n["X-User-Id"]=a);try{let r=await fetch(s,{method:"POST",headers:n,body:JSON.stringify({function_name:e,arguments:t})});if(!r.ok){let e=await r.text();throw Error(`Function invoke failed with status ${r.status}: ${e}`)}return(await r.json()).result}catch(e){throw console.error("Failed to invoke remote function:",e),e}}}let c=n},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},32879:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>d,serverHooks:()=>p,workAsyncStorage:()=>u,workUnitAsyncStorage:()=>m});var o={};r.r(o),r.d(o,{POST:()=>l});var i=r(96559),a=r(48088),s=r(37719),n=r(32190),c=r(4936);async function l(e){try{let t,{productName:r,description:o,category:i,targetKeywords:a,contentType:s="product",existingContent:l}=await e.json();if(!r)return n.NextResponse.json({error:"Product name is required"},{status:400});let d=await c.A.create(),u=`You are an expert SEO specialist specializing in e-commerce optimization. 

Content to Optimize:
- Name: ${r}
- Description: ${o||"No description provided"}
- Category: ${i||"General"}
- Target Keywords: ${a||"Not specified"}
- Content Type: ${s}
- Existing Content: ${l||"None"}

Your task:
1. Generate SEO-optimized content that ranks well on search engines
2. Focus on user intent and search behavior
3. Include relevant keywords naturally
4. Create compelling meta descriptions and titles
5. Optimize for both users and search engines
6. Follow SEO best practices for e-commerce

Requirements:
- Meta title: 50-60 characters, includes primary keyword
- Meta description: 150-160 characters, compelling and clickable
- SEO description: 200-300 words, keyword-rich but natural
- Focus keywords: 5-8 relevant keywords
- Search intent: Identify primary search intent
- Content suggestions: Brief bullet points for content improvement

Format your response as JSON:
{
  "metaTitle": "SEO-optimized meta title",
  "metaDescription": "Compelling meta description",
  "seoDescription": "SEO-optimized detailed description",
  "focusKeywords": ["keyword1", "keyword2", "keyword3"],
  "longTailKeywords": ["long tail keyword 1", "long tail keyword 2"],
  "searchIntent": "informational/commercial/transactional/navigational",
  "contentSuggestions": [
    "Suggestion 1 for content improvement",
    "Suggestion 2 for content improvement"
  ],
  "seoScore": 85,
  "recommendations": [
    "SEO recommendation 1",
    "SEO recommendation 2"
  ]
}`,m=await d.chat.completions.create({messages:[{role:"system",content:"You are a world-class SEO expert with deep knowledge of e-commerce optimization, search engine algorithms, and user behavior. Always provide actionable, data-driven SEO recommendations."},{role:"user",content:u}],temperature:.3,max_tokens:1500}),p=m.choices[0]?.message?.content;if(!p)throw Error("No response from AI");try{t=JSON.parse(p)}catch(e){t={metaTitle:r.length>55?r.slice(0,55):r,metaDescription:o?o.slice(0,160):`Buy ${r} online. High-quality ${i||"products"} at great prices.`,seoDescription:o||`${r} is a premium ${i||"product"} designed for quality and performance.`,focusKeywords:[r.toLowerCase(),i?.toLowerCase()||"product"],longTailKeywords:[`best ${r}`,`${r} for sale`,`buy ${r} online`],searchIntent:"commercial",contentSuggestions:["Add more detailed product specifications","Include customer reviews and testimonials"],seoScore:70,recommendations:["Add more specific details","Include relevant keywords naturally"]}}let h={...t,metaTitle:t.metaTitle||r,metaDescription:t.metaDescription||o?.slice(0,160)||`High-quality ${r} available now.`,seoDescription:t.seoDescription||o||`Discover the benefits of ${r}.`,focusKeywords:Array.isArray(t.focusKeywords)?t.focusKeywords:[r.toLowerCase()],longTailKeywords:Array.isArray(t.longTailKeywords)?t.longTailKeywords:[],contentSuggestions:Array.isArray(t.contentSuggestions)?t.contentSuggestions:[],recommendations:Array.isArray(t.recommendations)?t.recommendations:[],seoScore:Math.min(100,Math.max(0,parseInt(t.seoScore)||75))};return n.NextResponse.json({success:!0,data:h})}catch(e){return console.error("Error generating SEO content:",e),n.NextResponse.json({error:"Failed to generate SEO content",details:e.message},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/ai/seo-optimize/route",pathname:"/api/ai/seo-optimize",filename:"route",bundlePath:"app/api/ai/seo-optimize/route"},resolvedPagePath:"/home/runner/work/sellor-ai-ecommerce/sellor-ai-ecommerce/src/app/api/ai/seo-optimize/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:u,workUnitAsyncStorage:m,serverHooks:p}=d;function h(){return(0,s.patchFetch)({workAsyncStorage:u,workUnitAsyncStorage:m})}},33873:e=>{"use strict";e.exports=require("path")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},79748:e=>{"use strict";e.exports=require("fs/promises")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[4447,580],()=>r(32879));module.exports=o})();