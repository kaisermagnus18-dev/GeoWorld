
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import {
  doc, getDoc, setDoc, runTransaction, collection, getDocs,
  query, orderBy, limit, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const $ = id => document.getElementById(id);
const MODES = {
  easy:{label:"EASY",time:25,xp:10,mult:1},
  normal:{label:"NORMAL",time:20,xp:15,mult:1.2},
  hard:{label:"HARD",time:16,xp:20,mult:1.5},
  nightmare:{label:"NIGHTMARE",time:12,xp:30,mult:2},
  hell:{label:"HELL",time:9,xp:50,mult:3}
};

/* Each question has four options, correct answer index, category and hint. */
const BANK = [
["COUNTRIES","Which country has the largest land area?",["Canada","Russia","China","United States"],1,"It spans northern Eurasia."],
["OCEANS","Which is the largest ocean?",["Atlantic","Indian","Pacific","Arctic"],2,"It lies between Asia and the Americas."],
["MOUNTAINS","What is Earth's highest mountain above sea level?",["K2","Everest","Kangchenjunga","Lhotse"],1,"It is in the Himalayas."],
["RIVERS","Which river flows through Egypt?",["Amazon","Nile","Danube","Mekong"],1,"It was central to ancient Egyptian civilization."],
["CAPITALS","What is the capital of Japan?",["Kyoto","Osaka","Tokyo","Sapporo"],2,"It is Japan's largest metropolitan area."],
["CONTINENTS","Which continent has the most countries?",["Asia","Africa","Europe","South America"],1,"It has more than 50 countries."],
["LANDMARKS","Petra is located in which country?",["Jordan","Egypt","Greece","Lebanon"],0,"Its capital is Amman."],
["ISLANDS","What is the world's largest island, excluding continents?",["Borneo","Madagascar","Greenland","New Guinea"],2,"It is part of the Kingdom of Denmark."],
["DESERTS","What is the largest hot desert?",["Gobi","Sahara","Kalahari","Arabian"],1,"It spans North Africa."],
["CAPITALS","What is Australia's capital?",["Sydney","Melbourne","Canberra","Perth"],2,"It was chosen as a compromise between two larger cities."],
["RIVERS","Which river flows through Paris?",["Rhine","Seine","Thames","Loire"],1,"It is also the name of a French department."],
["LAKES","Which is the deepest freshwater lake?",["Superior","Baikal","Victoria","Tanganyika"],1,"It is in Siberia."],
["CONTINENTS","Which is the smallest continent by area?",["Europe","Antarctica","Australia","South America"],2,"It is also a country-continent."],
["GEOGRAPHY","At what latitude is the Equator?",["0°","23.5° N","66.5° S","90°"],0,"It divides Earth into two hemispheres."],
["CAPITALS","What is Canada's capital?",["Toronto","Vancouver","Ottawa","Montreal"],2,"It is in Ontario."],
["COUNTRIES","Which country has the largest population in the mid-2020s?",["China","India","USA","Indonesia"],1,"It overtook China in 2023 estimates."],
["MOUNTAINS","The Andes are mainly in which continent?",["Asia","Africa","South America","Europe"],2,"They run along the western edge."],
["OCEANS","Which ocean lies between Africa and Australia?",["Atlantic","Pacific","Indian","Arctic"],2,"It is named after a country."],
["LANDMARKS","The Great Pyramid of Giza is in which country?",["Mexico","Egypt","Iraq","Sudan"],1,"Giza is near Cairo."],
["CAPITALS","What is Brazil's capital?",["Rio de Janeiro","São Paulo","Brasília","Salvador"],2,"It became the capital in 1960."],
["COUNTRIES","Which country is completely surrounded by South Africa?",["Eswatini","Lesotho","Botswana","Namibia"],1,"It is a mountainous kingdom."],
["GEOGRAPHY","What is a narrow strip of land connecting two larger land areas?",["Strait","Isthmus","Delta","Fjord"],1,"Panama is a famous example."],
["CLIMATE","Which line marks the southern limit of the tropics?",["Arctic Circle","Tropic of Cancer","Tropic of Capricorn","Prime Meridian"],2,"It is about 23.5° south."],
["CAPITALS","What is Kenya's capital?",["Mombasa","Nairobi","Kampala","Kigali"],1,"It is a major East African city."],
["RIVERS","Which river gives the Amazon rainforest its name?",["Orinoco","Paraná","Amazon","Colorado"],2,"It has the world's greatest river discharge."],
["COUNTRIES","Which country is often described as boot-shaped?",["Greece","Italy","Portugal","Croatia"],1,"Rome is its capital."],
["CITIES","Istanbul is in which country?",["Greece","Türkiye","Bulgaria","Georgia"],1,"It spans the Bosporus."],
["GEOGRAPHY","What is the Prime Meridian's longitude?",["0°","90° E","180°","23.5° N"],0,"It passes through Greenwich."],
["ISLANDS","Madagascar lies off which continent?",["Asia","Africa","Europe","South America"],1,"It is east of Mozambique."],
["COUNTRIES","Marrakech is in which country?",["Morocco","Tunisia","Algeria","Libya"],0,"It is in northwest Africa."],
["CAPITALS","What is Argentina's capital?",["Lima","Santiago","Buenos Aires","Montevideo"],2,"It lies by the Río de la Plata."],
["OCEANS","Which ocean is the smallest?",["Indian","Southern","Arctic","Atlantic"],2,"It surrounds the North Pole."],
["GEOGRAPHY","What is a river-mouth deposit called?",["Plateau","Delta","Peninsula","Canyon"],1,"The Nile has a famous example."],
["COUNTRIES","Angkor is a historic site in which country?",["Laos","Cambodia","Vietnam","Myanmar"],1,"Phnom Penh is its capital."],
["CAPITALS","What is New Zealand's capital?",["Auckland","Christchurch","Wellington","Hamilton"],2,"It is at the south of the North Island."],
["GEOGRAPHY","What is land almost surrounded by water called?",["Peninsula","Archipelago","Plateau","Basin"],0,"Iberia is an example."],
["MOUNTAINS","Mount Kilimanjaro is in which country?",["Kenya","Tanzania","Uganda","Ethiopia"],1,"It is near the Kenyan border."],
["COUNTRIES","The Atacama Desert is mainly in which country?",["Peru","Chile","Bolivia","Ecuador"],1,"It is along South America's Pacific coast."],
["CAPITALS","What is Egypt's capital?",["Alexandria","Giza","Cairo","Luxor"],2,"It is one of Africa's largest cities."],
["CLIMATE","Which atmospheric layer contains most weather?",["Stratosphere","Troposphere","Mesosphere","Thermosphere"],1,"It is the lowest layer."],
["COUNTRIES","Dubrovnik is in which country?",["Croatia","Slovenia","Albania","Serbia"],0,"It has a long Adriatic coastline."],
["RIVERS","Which river flows through London?",["Severn","Thames","Trent","Clyde"],1,"It empties into the North Sea."],
["GEOGRAPHY","What is an archipelago?",["Group of islands","Steep valley","River basin","Mountain"],0,"Indonesia is an example."],
["COUNTRIES","Which country is famous for having an enormous number of lakes?",["Finland","Canada","Russia","Spain"],1,"Its lakes stretch across many provinces and territories."],
["CAPITALS","What is Thailand's capital?",["Phuket","Chiang Mai","Bangkok","Pattaya"],2,"Its Thai name begins Krung Thep."],
["GEOGRAPHY","What is a large, elevated flat area called?",["Delta","Plateau","Dune","Valley"],1,"The Deccan is one in India."],
["COUNTRIES","Bergen's famous fjords are in which country?",["Sweden","Norway","Iceland","Denmark"],1,"It occupies western Scandinavia."],
["GEOGRAPHY","What does a map scale show?",["Map colours","Map distance versus real distance","Elevation only","Political borders"],1,"It converts measured distance."],
["CAPITALS","What is the capital of South Korea?",["Busan","Seoul","Incheon","Daegu"],1,"It is on the Han River."],
["COUNTRIES","Which country has the ancient city of Timbuktu?",["Mali","Niger","Chad","Senegal"],0,"It is a landlocked West African country."]
];

const DAILY_KEY="gw_quiz_daily_v3";
const POWER_KEY="gw_quiz_powerups_v3";
const today=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`};
const readStore=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
let daily=readStore(DAILY_KEY,{});
if(daily.date!==today())daily={date:today(),answered:0,correct:0,boss:0,claimed:[]};
let powers=readStore(POWER_KEY,{});
if(powers.date!==today())powers={date:today(),fifty:1,freeze:1,second:1};

let currentUser=null, profile={xp:0,displayName:"Explorer"},mode="easy";
let questions=[],index=0,score=0,correct=0,earned=0,timer=null,timeLeft=0;
let locked=false,secondArmed=false,secondUsed=false,freezeEnd=0,hintUsed=false;
let bossQuestion=null,bossSolved=false,bossBonus=0,toastTimer=null;

function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function level(xp){return Math.floor(Math.max(0,xp)/250)+1}
function rank(l){return l>=50?"PLANETARY LEGEND":l>=30?"COSMIC CARTOGRAPHER":l>=20?"MASTER EXPLORER":l>=10?"ELITE NAVIGATOR":l>=5?"FIELD SPECIALIST":"ROOKIE EXPLORER"}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2500)}
function show(id){["lobbyScreen","gameScreen","resultScreen","leaderboardScreen"].forEach(s=>$(s).classList.toggle("hidden",s!==id));window.scrollTo({top:0,behavior:"smooth"})}
function saveDaily(){localStorage.setItem(DAILY_KEY,JSON.stringify(daily))}
function savePowers(){localStorage.setItem(POWER_KEY,JSON.stringify(powers))}
function updateProfile(){const xp=Number(profile.xp)||0,l=level(xp);$("levelValue").textContent=`LEVEL ${l}`;$("rankValue").textContent=rank(l);$("xpProgress").style.width=`${xp%250/2.5}%`;$("xpLabel").textContent=`${xp.toLocaleString()} XP · ${250-xp%250} TO NEXT LEVEL`}
function updatePowers(){for(const [key,label] of [["fifty","Fifty"],["freeze","Freeze"],["second","Second"]]){$(`${key}Count`).textContent=`${powers[key]} LEFT`;$(`lobby${label}`).textContent=powers[key];$(`${key}Btn`).disabled=locked||powers[key]<=0||!questions.length}}
function missionRender(){
 const defs=[
  ["answers","Answer 10 questions",daily.answered,10,"fifty"],
  ["correct","Get 5 correct answers",daily.correct,5,"second"],
  ["boss","Defeat the Atlas Guardian",daily.boss,1,"freeze"]
 ];
 $("missionList").innerHTML=defs.map(([id,title,value,target,reward])=>{
 const done=value>=target,claimed=daily.claimed.includes(id);
 return `<div class="mission"><div class="mission-copy"><strong>${title}</strong><small>${Math.min(value,target)} / ${target} · Reward: +1 ${reward} charge</small><div class="track"><span style="width:${Math.min(100,value/target*100)}%"></span></div></div><button class="reward" data-claim="${id}" ${!done||claimed?"disabled":""}>${claimed?"CLAIMED":done?"CLAIM":"LOCKED"}</button></div>`;
 }).join("");
 $("missionList").querySelectorAll("[data-claim]").forEach(b=>b.addEventListener("click",()=>claimMission(b.dataset.claim)));
 updatePowers();
}
function claimMission(id){
 if(daily.claimed.includes(id))return;
 const ready={answers:daily.answered>=10,correct:daily.correct>=5,boss:daily.boss>=1};
 if(!ready[id])return;
 daily.claimed.push(id);
 const target={answers:"fifty",correct:"second",boss:"freeze"}[id];
 powers[target]=(powers[target]||0)+1;
 if(id==="boss")powers.fifty++;
 saveDaily();savePowers();missionRender();toast("Daily mission reward claimed!");
}
function missionEvent(kind){daily[kind]=(daily[kind]||0)+1;saveDaily();missionRender()}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function runTimer(){
 stopTimer();timeLeft=MODES[mode].time;$("timerValue").textContent=timeLeft;
 timer=setInterval(()=>{if(Date.now()<freezeEnd)return;timeLeft--;$("timerValue").textContent=timeLeft;if(timeLeft<=0){stopTimer();answer(null,false,true)}},1000);
}
function startGame(){
 stopTimer();mode=document.querySelector(".mode.selected")?.dataset.mode||mode;
 questions=shuffle(BANK).slice(0,50);index=0;score=0;correct=0;earned=0;bossBonus=0;bossSolved=false;
 $("gameModeTag").textContent=MODES[mode].label;$("scoreValue").textContent="0";show("gameScreen");renderQuestion();
}
function renderQuestion(){
 if(index>=questions.length){startBoss();return}
 locked=false;secondArmed=false;secondUsed=false;hintUsed=false;
 const q=questions[index];$("questionNumber").textContent=index+1;$("questionCategory").textContent=q[0];$("questionText").textContent=q[1];
 $("questionProgress").style.width=`${index/50*100}%`;$("feedbackBox").className="feedback hidden";$("hintText").classList.add("hidden");$("hintText").textContent="";$("hintBtn").disabled=false;$("nextQuestionBtn").disabled=true;
 $("nextQuestionBtn").textContent=index===49?"FINAL BOSS →":"NEXT →";
 const opts=shuffle(q[2].map((text,i)=>({text,correct:i===q[3]})));
 $("answerOptions").innerHTML=opts.map((o,i)=>`<button class="answer-option" data-correct="${o.correct}" data-text="${escapeHTML(o.text)}"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${escapeHTML(o.text)}</span></button>`).join("");
 $("answerOptions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>answer(b,b.dataset.correct==="true",false)));
 updatePowers();runTimer();
}
function answer(button,isCorrect,timeout=false){
 if(locked)return;
 if(!timeout&&button&&button.dataset.correct!=="true"&&secondArmed&&!secondUsed){
   secondUsed=true;button.disabled=true;button.classList.add("wrong");
   $("feedbackBox").className="feedback bad";$("feedbackBox").textContent="Second Chance: choose another answer.";
   return;
 }
 locked=true;stopTimer();missionEvent("answered");
 const q=questions[index];
 $("answerOptions").querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.correct==="true")b.classList.add("correct")});
 if(isCorrect){correct++;score+=100;const xp=Math.round(MODES[mode].xp*MODES[mode].mult);earned+=xp;missionEvent("correct");$("feedbackBox").className="feedback good";$("feedbackBox").textContent=`Correct! +${xp} XP.`}
 else{$("feedbackBox").className="feedback bad";$("feedbackBox").textContent=timeout?`Time expired. Correct answer: ${q[2][q[3]]}`:`Incorrect. Correct answer: ${q[2][q[3]]}`;if(button)button.classList.add("wrong")}
 $("scoreValue").textContent=score;$("questionProgress").style.width=`${(index+1)/50*100}%`;$("nextQuestionBtn").disabled=false;updatePowers();
}
function useFifty(){
 if(locked||powers.fifty<=0)return;
 const wrong=shuffle([...$("answerOptions").querySelectorAll("button")].filter(b=>b.dataset.correct!=="true"&&!b.disabled)).slice(0,2);
 if(wrong.length<2)return toast("50/50 is unavailable.");
 wrong.forEach(b=>{b.disabled=true;b.style.opacity=".2"});
 powers.fifty--;savePowers();updatePowers();toast("Two wrong answers removed.");
}
function useFreeze(){if(locked||powers.freeze<=0)return;powers.freeze--;freezeEnd=Date.now()+8000;savePowers();updatePowers();toast("Timer frozen for 8 seconds.")}
function useSecond(){if(locked||powers.second<=0||secondArmed)return;powers.second--;secondArmed=true;secondUsed=false;savePowers();updatePowers();toast("Second Chance armed for this question.")}
function startBoss(){
 stopTimer();$("bossModal").classList.remove("hidden");bossSolved=false;
 bossQuestion=shuffle(BANK)[0];$("bossPrompt").textContent=`${bossQuestion[0]} // ${bossQuestion[1]}`;
 $("bossFeedback").className="feedback hidden";$("bossContinueBtn").classList.add("hidden");
 const opts=shuffle(bossQuestion[2].map((text,i)=>({text,correct:i===bossQuestion[3]})));
 $("bossOptions").innerHTML=opts.map((o,i)=>`<button class="answer-option" data-correct="${o.correct}"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span>${escapeHTML(o.text)}</span></button>`).join("");
 $("bossOptions").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>bossAnswer(b,b.dataset.correct==="true")));
}
function bossAnswer(button,good){
 if(bossSolved)return;bossSolved=true;
 $("bossOptions").querySelectorAll("button").forEach(b=>{b.disabled=true;if(b.dataset.correct==="true")b.classList.add("correct")});
 const fb=$("bossFeedback");
 if(good){bossBonus=Math.round(200*MODES[mode].mult);earned+=bossBonus;score+=500;daily.boss=1;saveDaily();missionRender();fb.className="feedback good";fb.textContent=`Guardian defeated! +${bossBonus} bonus XP and +500 score.`;toast("Atlas Guardian defeated!")}
 else{fb.className="feedback bad";fb.textContent=`Guardian survived. Correct answer: ${bossQuestion[2][bossQuestion[3]]}.`}
 $("bossResult").textContent=good?`ATLAS GUARDIAN DEFEATED · +${bossBonus} BONUS XP`:"ATLAS GUARDIAN SURVIVED · TRAIN AND RETURN";
 $("bossContinueBtn").classList.remove("hidden");
}
async function finishGame(){
 $("bossModal").classList.add("hidden");stopTimer();
 const accuracy=Math.round(correct/questions.length*100);
 $("resultTitle").textContent=accuracy>=80?"ELITE EXPLORER":accuracy>=50?"MISSION COMPLETE":"TRAINING COMPLETE";
 $("resultMessage").textContent=`${MODES[mode].label} protocol completed. Your exploration continues.`;
 $("finalScore").textContent=score.toLocaleString();$("accuracyValue").textContent=`${accuracy}%`;
 $("xpEarned").textContent=`+${earned.toLocaleString()}`;$("correctValue").textContent=`${correct} / ${questions.length}`;
 $("bossResult").classList.toggle("hidden",!bossSolved);
 show("resultScreen");
 if(currentUser&&earned>0){try{await saveXP(earned);toast(`+${earned} XP synced to Firebase.`)}catch(e){console.error(e);toast("XP sync failed. Check Firestore rules.")}}
}
async function saveXP(amount){
 const userRef=doc(db,"users",currentUser.uid);let updated={};
 await runTransaction(db,async tx=>{
   const snap=await tx.get(userRef);const old=snap.exists()?snap.data():{};
   const xp=(Number(old.xp)||0)+amount;
   updated={xp,level:level(xp),displayName:old.displayName||old.username||currentUser.displayName||currentUser.email?.split("@")[0]||"Explorer"};
   tx.set(userRef,{...old,...updated,email:currentUser.email||"",updatedAt:serverTimestamp()},{merge:true});
 });
 profile={...profile,...updated};
 await setDoc(doc(db,"leaderboard",currentUser.uid),{
   uid:currentUser.uid,displayName:profile.displayName,xp:profile.xp,level:profile.level,
   rank:rank(profile.level),updatedAt:serverTimestamp()
 },{merge:true});
 updateProfile();
}
async function loadProfile(u){
 const snap=await getDoc(doc(db,"users",u.uid));const d=snap.exists()?snap.data():{};
 profile={xp:Number(d.xp)||0,displayName:d.displayName||d.username||u.displayName||u.email?.split("@")[0]||"Explorer"};
 $("userLabel").textContent=profile.displayName;updateProfile();
}
async function loadLeaderboard(){
 show("leaderboardScreen");$("leaderboardList").textContent="Loading leaderboard...";
 try{
  const snap=await getDocs(query(collection(db,"leaderboard"),orderBy("xp","desc"),limit(25)));
  if(snap.empty){$("leaderboardList").textContent="No scores yet. Be the first explorer!";return}
  $("leaderboardList").innerHTML=snap.docs.map((d,i)=>{const p=d.data();return `<div class="leaderrow"><span class="rank">${String(i+1).padStart(2,"0")}</span><span>${escapeHTML(p.displayName||"Explorer")}${p.uid===currentUser?.uid?" (YOU)":""}</span><span class="level">LVL ${Number(p.level)||1}</span><span class="xp">${(Number(p.xp)||0).toLocaleString()} XP</span></div>`}).join("");
 }catch(e){console.error(e);$("leaderboardList").textContent="Leaderboard unavailable. Check Firestore access."}
}
function bind(){
 document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("selected",x===b))}));
 $("startQuizBtn").addEventListener("click",startGame);
 $("nextQuestionBtn").addEventListener("click",()=>{if(!locked)return;index++;renderQuestion()});
 $("hintBtn").addEventListener("click",()=>{if(hintUsed)return;hintUsed=true;$("hintText").textContent=questions[index][4];$("hintText").classList.remove("hidden");$("hintBtn").disabled=true});
 $("fiftyBtn").addEventListener("click",useFifty);$("freezeBtn").addEventListener("click",useFreeze);$("secondBtn").addEventListener("click",useSecond);
 $("bossContinueBtn").addEventListener("click",finishGame);
 $("retryQuizBtn").addEventListener("click",startGame);$("returnLobbyBtn").addEventListener("click",()=>{show("lobbyScreen");missionRender()});
 $("openLeaderboardBtn").addEventListener("click",loadLeaderboard);$("resultsLeaderboardBtn").addEventListener("click",loadLeaderboard);
 $("backToLobbyBtn").addEventListener("click",()=>show("lobbyScreen"));
 $("exitQuizBtn").addEventListener("click",()=>{stopTimer();if(confirm("Exit this mission? Current progress will be lost.")){questions=[];show("lobbyScreen")}else runTimer()});
 $("logoutBtn").addEventListener("click",async()=>{try{await signOut(auth);location.href="login.html"}catch(e){console.error(e);toast("Logout failed.")}});
}
onAuthStateChanged(auth,async u=>{
 if(!u){location.href="login.html";return}
 currentUser=u;
 try{await loadProfile(u)}catch(e){console.error(e);$("userLabel").textContent=u.email||"EXPLORER"}
});
bind();missionRender();updatePowers();updateProfile();
