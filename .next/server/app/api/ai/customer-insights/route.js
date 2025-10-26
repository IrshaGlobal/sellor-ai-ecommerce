(()=>{var e={};e.id=2623,e.ids=[2623],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4936:(e,t,r)=>{"use strict";r.d(t,{A:()=>c});var a=r(79748),o=r(33873);let s=require("os"),i=async()=>{let e=s.homedir();for(let t of[o.join(process.cwd(),".z-ai-config"),o.join(e,".z-ai-config"),"/etc/.z-ai-config"])try{let e=await a.readFile(t,"utf-8"),r=JSON.parse(e);if(r.baseUrl&&r.apiKey)return r}catch(e){"ENOENT"!==e.code&&console.error(`Error reading or parsing config file at ${t}:`,e)}throw Error("Configuration file not found or invalid. Please create .z-ai-config in your project, home directory, or /etc.")};class n{constructor(e){this.config=e,this.chat={completions:{create:this.createChatCompletion.bind(this)}},this.images={generations:{create:this.createImageGeneration.bind(this)}},this.functions={invoke:this.invokeFunction.bind(this)}}static async create(){return new n(await i())}async createChatCompletion(e){let{baseUrl:t,chatId:r,userId:a,apiKey:o}=this.config,s=`${t}/chat/completions`,i={"Content-Type":"application/json",Authorization:`Bearer ${o}`,"X-Z-AI-From":"Z"};r&&(i["X-Chat-Id"]=r),a&&(i["X-User-Id"]=a);try{let t=await fetch(s,{method:"POST",headers:i,body:JSON.stringify(e)});if(!t.ok){let e=await t.text();throw Error(`API request failed with status ${t.status}: ${e}`)}return await t.json()}catch(e){throw console.error("Failed to make API request:",e),e}}async createImageGeneration(e){let{baseUrl:t,apiKey:r,chatId:a,userId:o}=this.config,s=`${t}/images/generations`,i={"Content-Type":"application/json",Authorization:`Bearer ${r}`,"X-Z-AI-From":"Z"};a&&(i["X-Chat-Id"]=a),o&&(i["X-User-Id"]=o);let n={...e};try{let e=await fetch(s,{method:"POST",headers:i,body:JSON.stringify(n)});if(!e.ok){let t=await e.text();throw Error(`API request failed with status ${e.status}: ${t}`)}let t=await e.json(),r=await Promise.all(t.data.map(async e=>e.url?{base64:await this.downloadImageAsBase64(e.url),format:"png"}:e));return{...t,data:r}}catch(e){throw console.error("Failed to make image generation request:",e),e}}async downloadImageAsBase64(e){try{let t=await fetch(e);if(!t.ok)throw Error(`Failed to download image: ${t.status}`);let r=await t.arrayBuffer(),a=Buffer.from(r).toString("base64");return`${a}`}catch(e){throw console.error("Failed to download and convert image to base64:",e),e}}async invokeFunction(e,t){let{baseUrl:r,apiKey:a,chatId:o,userId:s}=this.config,i=`${r}/functions/invoke`,n={"Content-Type":"application/json",Authorization:`Bearer ${a}`,"X-Z-AI-From":"Z"};o&&(n["X-Chat-Id"]=o),s&&(n["X-User-Id"]=s);try{let r=await fetch(i,{method:"POST",headers:n,body:JSON.stringify({function_name:e,arguments:t})});if(!r.ok){let e=await r.text();throw Error(`Function invoke failed with status ${r.status}: ${e}`)}return(await r.json()).result}catch(e){throw console.error("Failed to invoke remote function:",e),e}}}let c=n},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29192:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>h,routeModule:()=>m,serverHooks:()=>p,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var a={};r.r(a),r.d(a,{POST:()=>u});var o=r(96559),s=r(48088),i=r(37719),n=r(32190),c=r(4936);async function u(e){try{let t,{storeId:r,timeRange:a="30d",insightTypes:o=["all"],customerData:s,salesData:i,productData:u}=await e.json();if(!r)return n.NextResponse.json({error:"Store ID is required"},{status:400});let m=await c.A.create(),d=`You are an advanced AI business analyst specializing in e-commerce customer insights and behavior analysis.

Store Data Analysis:
- Time Range: ${a}
- Store ID: ${r}
- Analysis Types: ${o.join(", ")}

Customer Data Summary:
${s?`
- Total Customers: ${s.totalCustomers||0}
- New Customers: ${s.newCustomers||0}
- Returning Customers: ${s.returningCustomers||0}
- Average Order Value: $${s.averageOrderValue||0}
- Customer Lifetime Value: $${s.customerLifetimeValue||0}
- Top Customer Locations: ${s.topLocations?.join(", ")||"Not available"}
`:"No customer data available"}

Sales Performance:
${i?`
- Total Revenue: $${i.totalRevenue||0}
- Total Orders: ${i.totalOrders||0}
- Conversion Rate: ${i.conversionRate||0}%
- Average Order Value: $${i.averageOrderValue||0}
- Top Selling Products: ${i.topProducts?.map(e=>`${e.name} (${e.sales} units)`).join(", ")||"Not available"}
- Sales by Category: ${Object.entries(i.salesByCategory||{}).map(([e,t])=>`${e}: $${t}`).join(", ")||"Not available"}
`:"No sales data available"}

Product Performance:
${u?`
- Total Products: ${u.totalProducts||0}
- Active Products: ${u.activeProducts||0}
- Low Stock Products: ${u.lowStockProducts||0}
- Out of Stock Products: ${u.outOfStockProducts||0}
- Top Rated Products: ${u.topRated?.map(e=>`${e.name} (${e.rating}⭐)`).join(", ")||"Not available"}
- Most Viewed Products: ${u.mostViewed?.map(e=>e.name).join(", ")||"Not available"}
`:"No product data available"}

Your task:
1. Analyze the provided data to generate actionable customer insights
2. Identify trends, patterns, and opportunities
3. Provide specific recommendations for business growth
4. Highlight potential issues or areas for improvement
5. Predict future trends based on current data

Generate insights in these categories:
- Customer Behavior Analysis
- Purchase Patterns and Preferences
- Product Performance Insights
- Sales and Revenue Trends
- Marketing and Engagement Recommendations
- Growth Opportunities

Format your response as JSON:
{
  "customerBehavior": {
    "summary": "Overall customer behavior analysis",
    "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "purchasePatterns": {
    "summary": "Purchase pattern analysis",
    "trends": ["Trend 1", "Trend 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2"]
  },
  "productInsights": {
    "summary": "Product performance insights",
    "topPerformers": ["Product 1", "Product 2"],
    "underperformers": ["Product 1", "Product 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "salesTrends": {
    "summary": "Sales trend analysis",
    "growthAreas": ["Area 1", "Area 2"],
    "concerns": ["Concern 1", "Concern 2"]
  },
  "marketingInsights": {
    "summary": "Marketing and engagement insights",
    "channels": ["Channel 1", "Channel 2"],
    "campaigns": ["Campaign idea 1", "Campaign idea 2"]
  },
  "growthOpportunities": {
    "summary": "Growth opportunities",
    "immediateActions": ["Action 1", "Action 2"],
    "longTermStrategies": ["Strategy 1", "Strategy 2"]
  },
  "overallScore": 85,
  "keyMetrics": {
    "customerSatisfaction": "High",
    "growthPotential": "Medium",
    "marketPosition": "Strong"
  }
}`,l=await m.chat.completions.create({messages:[{role:"system",content:"You are an expert business analyst with deep expertise in e-commerce, customer behavior analysis, and data-driven insights. Provide actionable, specific recommendations based on the data provided."},{role:"user",content:d}],temperature:.4,max_tokens:2e3}),p=l.choices[0]?.message?.content;if(!p)throw Error("No response from AI");try{t=JSON.parse(p)}catch(e){t={customerBehavior:{summary:"Limited customer data available",keyInsights:["Focus on customer acquisition","Improve retention strategies"],recommendations:["Implement loyalty program","Enhance customer support"]},purchasePatterns:{summary:"Basic purchase patterns observed",trends:["Seasonal variations detected"],opportunities:["Cross-selling opportunities","Upselling potential"]},productInsights:{summary:"Product performance analysis",topPerformers:["Product A","Product B"],underperformers:["Product C","Product D"],recommendations:["Optimize product mix","Focus on high-margin items"]},salesTrends:{summary:"Sales trend analysis",growthAreas:["Online sales","Mobile commerce"],concerns:["Seasonal fluctuations","Competition"]},marketingInsights:{summary:"Marketing insights",channels:["Social media","Email marketing"],campaigns:["Seasonal promotion","New product launch"]},growthOpportunities:{summary:"Growth opportunities",immediateActions:["Optimize conversion rate","Expand product range"],longTermStrategies:["Market expansion","Brand development"]},overallScore:70,keyMetrics:{customerSatisfaction:"Medium",growthPotential:"High",marketPosition:"Developing"}}}return n.NextResponse.json({success:!0,insights:t,timeRange:a,generatedAt:new Date().toISOString()})}catch(e){return console.error("Error generating customer insights:",e),n.NextResponse.json({error:"Failed to generate customer insights",details:e.message},{status:500})}}let m=new o.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/ai/customer-insights/route",pathname:"/api/ai/customer-insights",filename:"route",bundlePath:"app/api/ai/customer-insights/route"},resolvedPagePath:"/home/runner/work/sellor-ai-ecommerce/sellor-ai-ecommerce/src/app/api/ai/customer-insights/route.ts",nextConfigOutput:"",userland:a}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:p}=m;function h(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},79748:e=>{"use strict";e.exports=require("fs/promises")},96487:()=>{}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[4447,580],()=>r(29192));module.exports=a})();