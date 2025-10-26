(()=>{var e={};e.id=7441,e.ids=[7441],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4936:(e,t,r)=>{"use strict";r.d(t,{A:()=>c});var o=r(79748),a=r(33873);let i=require("os"),n=async()=>{let e=i.homedir();for(let t of[a.join(process.cwd(),".z-ai-config"),a.join(e,".z-ai-config"),"/etc/.z-ai-config"])try{let e=await o.readFile(t,"utf-8"),r=JSON.parse(e);if(r.baseUrl&&r.apiKey)return r}catch(e){"ENOENT"!==e.code&&console.error(`Error reading or parsing config file at ${t}:`,e)}throw Error("Configuration file not found or invalid. Please create .z-ai-config in your project, home directory, or /etc.")};class s{constructor(e){this.config=e,this.chat={completions:{create:this.createChatCompletion.bind(this)}},this.images={generations:{create:this.createImageGeneration.bind(this)}},this.functions={invoke:this.invokeFunction.bind(this)}}static async create(){return new s(await n())}async createChatCompletion(e){let{baseUrl:t,chatId:r,userId:o,apiKey:a}=this.config,i=`${t}/chat/completions`,n={"Content-Type":"application/json",Authorization:`Bearer ${a}`,"X-Z-AI-From":"Z"};r&&(n["X-Chat-Id"]=r),o&&(n["X-User-Id"]=o);try{let t=await fetch(i,{method:"POST",headers:n,body:JSON.stringify(e)});if(!t.ok){let e=await t.text();throw Error(`API request failed with status ${t.status}: ${e}`)}return await t.json()}catch(e){throw console.error("Failed to make API request:",e),e}}async createImageGeneration(e){let{baseUrl:t,apiKey:r,chatId:o,userId:a}=this.config,i=`${t}/images/generations`,n={"Content-Type":"application/json",Authorization:`Bearer ${r}`,"X-Z-AI-From":"Z"};o&&(n["X-Chat-Id"]=o),a&&(n["X-User-Id"]=a);let s={...e};try{let e=await fetch(i,{method:"POST",headers:n,body:JSON.stringify(s)});if(!e.ok){let t=await e.text();throw Error(`API request failed with status ${e.status}: ${t}`)}let t=await e.json(),r=await Promise.all(t.data.map(async e=>e.url?{base64:await this.downloadImageAsBase64(e.url),format:"png"}:e));return{...t,data:r}}catch(e){throw console.error("Failed to make image generation request:",e),e}}async downloadImageAsBase64(e){try{let t=await fetch(e);if(!t.ok)throw Error(`Failed to download image: ${t.status}`);let r=await t.arrayBuffer(),o=Buffer.from(r).toString("base64");return`${o}`}catch(e){throw console.error("Failed to download and convert image to base64:",e),e}}async invokeFunction(e,t){let{baseUrl:r,apiKey:o,chatId:a,userId:i}=this.config,n=`${r}/functions/invoke`,s={"Content-Type":"application/json",Authorization:`Bearer ${o}`,"X-Z-AI-From":"Z"};a&&(s["X-Chat-Id"]=a),i&&(s["X-User-Id"]=i);try{let r=await fetch(n,{method:"POST",headers:s,body:JSON.stringify({function_name:e,arguments:t})});if(!r.ok){let e=await r.text();throw Error(`Function invoke failed with status ${r.status}: ${e}`)}return(await r.json()).result}catch(e){throw console.error("Failed to invoke remote function:",e),e}}}let c=s},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},51425:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>u,serverHooks:()=>p,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>l});var o={};r.r(o),r.d(o,{POST:()=>d});var a=r(96559),i=r(48088),n=r(37719),s=r(32190),c=r(4936);async function d(e){try{let t,{productId:r,userHistory:o,viewedProducts:a,cartItems:i,allProducts:n,recommendationType:d="similar"}=await e.json();if(!n||!Array.isArray(n))return s.NextResponse.json({error:"Products data is required"},{status:400});let u=await c.A.create(),m=n.find(e=>e.id===r),l=`You are an AI recommendation engine for an e-commerce store. 

Current Product: ${m?`
- Name: ${m.name}
- Description: ${m.description||"No description"}
- Price: $${m.price}
- Category: ${m.category?.name||"Uncategorized"}
- Features: ${m.features||"Not specified"}
`:"No current product selected"}

User Context:
- Recently Viewed: ${a?.map(e=>e.name).join(", ")||"None"}
- Cart Items: ${i?.map(e=>e.name).join(", ")||"None"}
- Purchase History: ${o?.map(e=>e.name).join(", ")||"None"}

Available Products:
${n.slice(0,20).map(e=>`
- ${e.name} | $${e.price} | ${e.category?.name||"Uncategorized"} | ${e.description?.slice(0,100)||"No description"}
`).join("\n")}

Recommendation Type: ${d}

Instructions:
1. Analyze the current product and user behavior
2. Recommend 5-8 products that best match the criteria
3. Consider factors like: category compatibility, price range, features, user preferences
4. For "similar" recommendations: Find products with similar characteristics
5. For "complementary" recommendations: Find products that go well together
6. For "trending" recommendations: Find popular and highly-rated products
7. For "personalized" recommendations: Consider user's viewing and purchase history
8. Exclude the current product from recommendations
9. Prioritize in-stock products
10. Provide a brief reason for each recommendation

Format your response as JSON:
{
  "recommendations": [
    {
      "productId": "product_id",
      "reason": "Brief explanation of why this product is recommended",
      "score": 0.95
    }
  ],
  "strategy": "Brief explanation of the recommendation strategy used"
}`,p=await u.chat.completions.create({messages:[{role:"system",content:"You are an expert e-commerce recommendation engine. Always respond with valid JSON only."},{role:"user",content:l}],temperature:.3,max_tokens:1500}),h=p.choices[0]?.message?.content;if(!h)throw Error("No response from AI");try{t=JSON.parse(h)}catch(e){t={recommendations:n.filter(e=>e.id!==r&&"ACTIVE"===e.status).slice(0,6).map(e=>({productId:e.id,reason:"Popular product that matches your interests",score:.8})),strategy:"Fallback recommendation based on product availability"}}let g=t.recommendations.filter(e=>{let t=n.find(t=>t.id===e.productId);return t&&"ACTIVE"===t.status&&t.inventory>0}).slice(0,8).map(e=>{let t=n.find(t=>t.id===e.productId);return{...e,product:{id:t.id,name:t.name,slug:t.slug,price:t.price,comparePrice:t.comparePrice,images:t.images,category:t.category,featured:t.featured}}});return s.NextResponse.json({success:!0,recommendations:g,strategy:t.strategy||"AI-powered personalized recommendations",totalProducts:n.length,recommendationType:d})}catch(e){return console.error("Error generating recommendations:",e),s.NextResponse.json({error:"Failed to generate recommendations",details:e.message},{status:500})}}let u=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/ai/recommendations/route",pathname:"/api/ai/recommendations",filename:"route",bundlePath:"app/api/ai/recommendations/route"},resolvedPagePath:"/home/runner/work/sellor-ai-ecommerce/sellor-ai-ecommerce/src/app/api/ai/recommendations/route.ts",nextConfigOutput:"",userland:o}),{workAsyncStorage:m,workUnitAsyncStorage:l,serverHooks:p}=u;function h(){return(0,n.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:l})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},79748:e=>{"use strict";e.exports=require("fs/promises")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[4447,580],()=>r(51425));module.exports=o})();