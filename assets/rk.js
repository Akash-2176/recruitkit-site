{
const SK=[["Java",/\bjava\b(?!\s*script)/i,["Java","J2EE"]],["Spring Boot",/spring\s*boot|\bspring\b/i,["Spring Boot","Spring"]],["Microservices",/micro-?services/i,["Microservices"]],["Python",/\bpython\b/i,["Python"]],["Django",/\bdjango\b/i,["Django"]],["JavaScript",/javascript|\bjs\b/i,["JavaScript"]],["TypeScript",/typescript/i,["TypeScript"]],["React",/\breact(\.?js)?\b/i,["React","ReactJS"]],["Angular",/\bangular/i,["Angular"]],["Node.js",/node\.?js|\bnode\b/i,["Node.js","NodeJS"]],[".NET",/\.net\b|dotnet/i,[".NET","dotnet"]],["C#",/c#|c\s*sharp/i,["C#"]],["Go",/\bgolang\b|\bgo\s+lang/i,["Golang","Go"]],["SQL",/\bsql\b/i,["SQL"]],["PostgreSQL",/postgres/i,["PostgreSQL","Postgres"]],["Oracle",/\boracle\b/i,["Oracle"]],["MongoDB",/mongo/i,["MongoDB"]],["AWS",/\baws\b|amazon web services/i,["AWS","Amazon Web Services"]],["Azure",/\bazure\b/i,["Azure"]],["GCP",/\bgcp\b|google cloud/i,["GCP","Google Cloud"]],["Kubernetes",/kubernetes|\bk8s\b|\beks\b|\baks\b/i,["Kubernetes","K8s"]],["Docker",/docker/i,["Docker"]],["Terraform",/terraform/i,["Terraform"]],["Jenkins",/jenkins/i,["Jenkins"]],["CI/CD",/ci\s*\/\s*cd/i,["CI/CD"]],["Kafka",/kafka/i,["Kafka"]],["Spark",/\bspark\b|pyspark/i,["Spark","PySpark"]],["Snowflake",/snowflake/i,["Snowflake"]],["Databricks",/databricks/i,["Databricks"]],["Airflow",/airflow/i,["Airflow"]],["Power BI",/power\s*bi/i,["Power BI"]],["Tableau",/tableau/i,["Tableau"]],["Salesforce",/salesforce|\bsfdc\b|apex/i,["Salesforce","SFDC"]],["ServiceNow",/servicenow/i,["ServiceNow"]],["SAP",/\bsap\b/i,["SAP"]],["Selenium",/selenium/i,["Selenium"]],["Linux",/linux|unix/i,["Linux"]],["REST APIs",/\brest(ful)?\b/i,["REST","RESTful"]],["Hibernate",/hibernate/i,["Hibernate"]],["Machine Learning",/machine learning|\bml\b/i,["Machine Learning","ML"]],["Guidewire",/guidewire/i,["Guidewire"]],["Workday",/workday/i,["Workday"]],["Mainframe",/mainframe|cobol|\bjcl\b/i,["Mainframe","COBOL"]],["Informatica",/informatica/i,["Informatica"]],["Dynamics 365",/dynamics\s*365|\bd365\b/i,["Dynamics 365","D365"]],["Ansible",/ansible/i,["Ansible"]],["Splunk",/splunk/i,["Splunk"]],["LLM / GenAI",/\bllm|gen\s*ai|generative ai/i,["LLM","GenAI"]]];
const TT=[[/gen\s*ai|llm|ai engineer/i,["GenAI Engineer","AI Engineer","Machine Learning Engineer","LLM Engineer"]],[/java (developer|engineer)|full stack java/i,["Java Developer","Java Engineer","Java Full Stack Developer","Software Engineer"]],[/python (developer|engineer)/i,["Python Developer","Python Engineer","Software Engineer"]],[/data engineer/i,["Data Engineer","Big Data Engineer","ETL Developer"]],[/devops|site reliability|\bsre\b/i,["DevOps Engineer","Site Reliability Engineer","SRE","Cloud Engineer"]],[/data scientist/i,["Data Scientist","Machine Learning Engineer"]],[/data analyst/i,["Data Analyst","BI Analyst","Business Intelligence Analyst"]],[/front ?end|react developer|angular developer/i,["Frontend Developer","Front End Developer","UI Developer"]],[/\.net developer|c# developer/i,[".NET Developer","C# Developer","Software Engineer"]],[/salesforce/i,["Salesforce Developer","Salesforce Engineer","SFDC Developer"]],[/system admin|sysadmin/i,["System Administrator","Systems Administrator","Linux Administrator"]],[/qa|test(ing)? engineer|automation tester/i,["QA Engineer","Automation Tester","SDET"]],[/full ?stack/i,["Full Stack Developer","Full Stack Engineer"]],[/software engineer|developer/i,["Software Engineer","Software Developer"]]];
const ST={AL:"Alabama",AZ:"Arizona",CA:"California",CO:"Colorado",CT:"Connecticut",FL:"Florida",GA:"Georgia",IL:"Illinois",IN:"Indiana",MA:"Massachusetts",MD:"Maryland",MI:"Michigan",MN:"Minnesota",MO:"Missouri",NC:"North Carolina",NJ:"New Jersey",NY:"New York",OH:"Ohio",OR:"Oregon",PA:"Pennsylvania",TN:"Tennessee",TX:"Texas",UT:"Utah",VA:"Virginia",WA:"Washington",WI:"Wisconsin"};
const SAMPLE=`Job Title: Senior Java Developer
Location: Dallas, TX (Hybrid, 3 days onsite)
Duration: 12+ months contract
Visa: USC, GC, H1B. W2 / C2C accepted.

Must have:
- 8+ years of experience in Java and Spring Boot
- Strong hands-on with Microservices and REST APIs
- AWS (EC2, Lambda, S3) and Docker / Kubernetes
- Kafka for event streaming

Nice to have:
- React or Angular
- Jenkins CI/CD
- PostgreSQL or Oracle`;
const $=id=>document.getElementById(id);
let skills=[],width="strict";
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const q=s=>/\s|[\/#.+]/.test(s)?`"${s}"`:s;
const toast=m=>{const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("on"),1400)};
function parse(){
 const jd=$("jd").value;
 const niceIdx=jd.search(/nice to have|good to have|preferred|plus:/i);
 skills=SK.filter(s=>s[1].test(jd)).map(s=>{const i=jd.search(s[1]);return{name:s[0],syn:s[2],pos:i,state:(niceIdx>-1&&i>niceIdx)?"nice":"must"}}).sort((a,b)=>a.pos-b.pos);
 let titles=[];const tl=(jd.match(/(job\s*)?title\s*[:\-]\s*(.+)/i)||[])[2]||jd.split("\n")[0];
 for(const [re,list] of TT){if(re.test(tl)){titles=list;break}}
 if(!titles.length)for(const [re,list] of TT){if(re.test(jd.slice(0,300))){titles=list;break}}
 if(!titles.length&&tl)titles=[tl.trim().slice(0,60)];
 $("titles").value=titles.join(", ");
 const lm=jd.match(/([A-Z][a-zA-Z.]+(?:\s[A-Z][a-zA-Z.]+)?),\s*([A-Z]{2})\b/);
 $("loc").textContent=lm?`${lm[1]}, ${lm[2]}`:(/remote/i.test(jd)?"Remote":"—");
 $("loc").dataset.city=lm?lm[1]:"";$("loc").dataset.st=lm?lm[2]:"";
 const em=jd.match(/(\d{1,2})\s*\+?\s*(?:years|yrs)/i);$("exp").textContent=em?em[1]+"+ years":"—";
 const v=["USC","GC","H1B","H-1B","EAD","OPT","CPT","TN","W2","C2C","1099"].filter(x=>new RegExp("\\b"+x.replace("-","\\-")+"\\b","i").test(jd));
 $("visa").textContent=v.length?[...new Set(v.map(x=>x.replace("H-1B","H1B")))].join(", "):"—";
 render();
}
function chips(){
 $("chips").innerHTML=skills.length?skills.map((s,i)=>`<button class="chip ${s.state}" data-i="${i}" aria-label="${esc(s.name)}: ${s.state}">${esc(s.name)}</button>`).join(""):`<span class="hint" style="margin:0">No known skills found yet. Paste a JD and press Generate.</span>`;
}
function grp(list,op){return list.length>1?"("+list.join(` ${op} `)+")":list[0]||""}
function build(){
 const titles=$("titles").value.split(",").map(s=>s.trim()).filter(Boolean);
 const ex=$("excl").value.split(",").map(s=>s.trim()).filter(Boolean);
 const must=skills.filter(s=>s.state==="must");
 const sk=s=>grp(s.syn.map(q),"OR");
 let core=must.map(sk);
 if(width==="broad"&&core.length>2){core=[...core.slice(0,2),grp(must.slice(2).flatMap(s=>s.syn.slice(0,1)).map(q),"OR")]}
 const t=grp(titles.map(x=>`"${x}"`),"OR");
 const parts=[t,...core].filter(Boolean);
 const std=parts.join(" AND ");
 const nots=ex.map(e=>"NOT "+q(e)).join(" ");
 const city=$("loc").dataset.city,st=$("loc").dataset.st;
 const locG=city?grp([`"${city}"`,st?`"${ST[st]||st}"`:""].filter(Boolean),"OR"):"";
 const li=[std,nots].filter(Boolean).join(" ");
 const dice=[std,locG?"AND "+locG:""].filter(Boolean).join(" ");
 const indeed=[std.replace(/ AND /g," AND "),nots.replace(/NOT /g,"-")].filter(Boolean).join(" ");
 const xt=grp(titles.slice(0,3).map(x=>`"${x}"`),"OR");
 const xs=must.slice(0,width==="broad"?2:4).map(s=>q(s.syn[0])).join(" ");
 const xray=[`site:linkedin.com/in`,xt,xs,locG,`-intitle:jobs -inurl:jobs`].filter(Boolean).join(" ");
 const gh=[`site:github.com`,must.slice(0,3).map(s=>q(s.syn[0])).join(" "),city?`"${city}"`:"","-inurl:repositories"].filter(Boolean).join(" ");
 return [
  {b:"LinkedIn",n:"People search / Recruiter",s:li,u:"https://www.linkedin.com/search/results/people/?keywords="+encodeURIComponent(std)},
  {b:"Dice",n:"Talent search",s:dice},
  {b:"Monster / Indeed",n:"Resume search",s:indeed},
  {b:"Google X-ray",n:"LinkedIn profiles via Google",s:xray,u:"https://www.google.com/search?q="+encodeURIComponent(xray)},
  {b:"GitHub X-ray",n:"Developers with public code",s:gh,u:"https://www.google.com/search?q="+encodeURIComponent(gh)}
 ];
}
function render(){
 chips();
 const rows=skills.length||$("titles").value.trim()?build():[];
 $("out").innerHTML=rows.length?rows.map((r,i)=>`<tr><td class="b">${r.b}<small>${r.n}</small></td><td><code>${esc(r.s)}</code></td><td class="act"><button class="ghost" data-c="${i}">Copy</button>${r.u?`<a class="btn" href="${r.u}" target="_blank" rel="noopener">Open</a>`:""}</td></tr>`).join(""):`<tr><td colspan="3" class="hint" style="margin:0">Strings appear here once a JD is parsed.</td></tr>`;
 $("out")._rows=rows;
}
$("go").addEventListener("click",()=>{$("smpnote").hidden=$("jd").value!==SAMPLE;parse()});
$("smp").addEventListener("click",()=>{$("jd").value=SAMPLE;$("smpnote").hidden=false;parse()});
$("clr").addEventListener("click",()=>{$("jd").value="";skills=[];$("titles").value="";["loc","exp","visa"].forEach(k=>{$(k).textContent="—";$(k).dataset.city="";$(k).dataset.st=""});$("smpnote").hidden=true;render();$("jd").focus()});
$("chips").addEventListener("click",e=>{const b=e.target.closest(".chip");if(!b)return;const s=skills[+b.dataset.i];s.state={must:"nice",nice:"off",off:"must"}[s.state];render()});
["titles","excl"].forEach(id=>$(id).addEventListener("input",render));
[["strict","broad"],["broad","strict"]].forEach(([a,o])=>$(a).addEventListener("click",()=>{width=a;$(a).setAttribute("aria-pressed","true");$(o).setAttribute("aria-pressed","false");render()}));
$("out").addEventListener("click",async e=>{const b=e.target.closest("[data-c]");if(!b)return;const s=$("out")._rows[+b.dataset.c].s;try{await navigator.clipboard.writeText(s);toast("Copied")}catch(_){const r=document.createRange();r.selectNodeContents(b.closest("tr").querySelector("code"));const sel=getSelection();sel.removeAllRanges();sel.addRange(r);toast("Selected — press copy")}});
window.RK={SAMPLE,parse};if(!window.RK_NOAUTO){$("jd").value=SAMPLE;$("smpnote").hidden=false;parse();}
}
