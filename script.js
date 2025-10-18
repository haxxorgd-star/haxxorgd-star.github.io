const units = ["K","M","B","T","Qd","Qn","Sx","Sp","O","N","De","Ud","Dd","TdD","QdD","QnD","SxD","SpD","OcD","NvD","Vgn","UvG","DvG","Tvg","QtV","QnV","SeV","SpG","OvG","NvG","TgN","UTG","DTG","TsTG","QtTG","QnTG","SsTG","SpTG","OcTG","NoTG","QDDR","uQDR","dQDR","tQDR","qdQDR","QnQDR","SxQDR","SpQDR","OQDDR","NQDDR","qQGNT","uQGNT","dQGNT","tQGNT"];
const unitMap = {}; units.forEach((u,i)=>{ unitMap[u.toLowerCase()]=Math.pow(10,3*(i+1)); });

function parseEnergy(input){ 
    input=String(input).trim(); 
    const m=input.match(/^([\d.]+)\s*([a-zA-Z]+)?$/); 
    if(!m)return 0; 
    const n=parseFloat(m[1]); 
    const u=m[2]?m[2].toLowerCase():""; 
    if(!u)return n; 
    if(unitMap.hasOwnProperty(u)) return n*unitMap[u]; 
    return 0; 
}

function formatUnits(value){ 
    for(let i=units.length-1;i>=0;i--){ 
        let uv=Math.pow(10,3*(i+1)); 
        if(value>=uv) return (value/uv).toFixed(3)+" "+units[i]; 
    } 
    return value.toFixed(value >= 1 ? 3 : 6); 
}

function formatTime(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(2)} s`;
    }
    
    const minutes = seconds / 60;
    if (minutes < 60) {
        return `${seconds.toFixed(2)} s / ${minutes.toFixed(2)} min`;
    }

    const hours = minutes / 60;
    return `${seconds.toFixed(2)} s / ${minutes.toFixed(2)} min / ${hours.toFixed(2)} hr`;
}

function calcPerClick(){ 
    const e=parseEnergy(document.getElementById("pcEnergy").value); 
    const t=parseFloat(document.getElementById("pcTime").value); 
    const out=document.getElementById("output"); 
    if(e>0 && t>0){ 
        const eps=e*5.5; 
        const total=eps*t; 
        out.innerHTML=`⚡ <strong>Energy per second:</strong> ${formatUnits(eps)}<br>⏱️ <strong>Energy after ${t} s:</strong> ${formatUnits(total)}`; 
        return;
    } 
    out.innerHTML="⚠️ Enter valid Energy per Click and Time."; 
}

function calcTarget(){ 
    const e=parseEnergy(document.getElementById("teEnergy").value); 
    const target=parseEnergy(document.getElementById("targetEnergyInput").value); 
    const current=parseEnergy(document.getElementById("currentEnergyTarget").value); 
    const out=document.getElementById("output"); 
    if(e>0 && target>0){ 
        const eps=e*5.5; 
        const remaining=Math.max(target-current, 0); 
        if (remaining === 0) {
            out.innerHTML = `✅ <strong>Target Reached!</strong>`;
            return;
        }
        const time=remaining/eps; 
        const formattedTime = formatTime(time);
        out.innerHTML=`🎯 <strong>Energy Needed:</strong> ${formatUnits(remaining)}<br>⚡ <strong>Energy per second:</strong> ${formatUnits(eps)}<br>⏱️ <strong>Time required:</strong> ${formattedTime}`; 
        return;
    } 
    out.innerHTML="⚠️ Enter valid Energy per Click and Target Energy."; 
}

const rankEnergyMap = { 
    100: parseEnergy("100ovg"), 
    101: parseEnergy("750ovg"),
    102: parseEnergy("3nvg"),
    103: parseEnergy("30nvg"),
    104: parseEnergy("250nvg"),
    105: parseEnergy("1tgn"),
    106: parseEnergy("10tgn"),
    107: parseEnergy("150tgn"),
    108: parseEnergy("750tgn"),
    109: parseEnergy("5utg"),
    110: parseEnergy("50utg"),
    111: parseEnergy("500utg"),
    112: parseEnergy("10dtg"),
    113: parseEnergy("50dtg"),
    114: parseEnergy("250dtg"),
    115: parseEnergy("1tstg"),
    116: parseEnergy("30tsTG"),
    117: parseEnergy("150tsTG"),
    118: parseEnergy("750tsTG"),
    119: parseEnergy("90qtTG"),
    120: parseEnergy("900qtTG") 
};
function calcRank(){ 
    const r=parseInt(document.getElementById("rankInput").value); 
    const e=parseEnergy(document.getElementById("rankEnergy").value); 
    const current=parseEnergy(document.getElementById("currentEnergy").value); 
    const out=document.getElementById("output"); 
    if(r <= 0 || isNaN(r)) { out.innerHTML="⚠️ Enter a valid Rank number."; return; }
    if(!rankEnergyMap[r]){ 
        out.innerHTML=`⚠️ Rank ${r} energy cost not defined. (Only Ranks 100-120 supported)`; 
        return; 
    } 
    if(e<=0){ 
        out.innerHTML="⚠️ Enter valid Energy per Click."; 
        return; 
    } 
    const eps=e*5.5; 
    const req=rankEnergyMap[r]; 
    const remaining=Math.max(req-current,0); 
    const time=remaining/eps; 
    const formattedTime = formatTime(time);
    out.innerHTML=`🏆 <strong>Rank ${r} Energy Required:</strong> ${formatUnits(req)}<br>⚡ <strong>Energy per second:</strong> ${formatUnits(eps)}<br>⏱️ <strong>Time to reach Rank ${r}:</strong> ${formattedTime}`; 
}

function calcTimeKill(){ 
  const dps=parseEnergy(document.getElementById("dpsTime").value);
  const health=parseEnergy(document.getElementById("healthTime").value);
  const out=document.getElementById("damageOutput");
  if(dps>0 && health>0){
    const time=health/dps;
    const formattedTime = formatTime(time);
    out.innerHTML=`🩸 <strong class="damage-output">Time to kill:</strong> <span class="damage-output">${formattedTime}</span>`;
  } else out.innerHTML="⚠️ Enter valid DPS and Mob Health values.";
}

function calcRequiredDps(){
  const time=parseFloat(document.getElementById("desiredTimeDps").value);
  const health=parseEnergy(document.getElementById("healthDps").value);
  const out=document.getElementById("damageOutput");
  if(time>0 && health>0){
    const requiredDPS=health/time;
    out.innerHTML=`⚡ <strong class="damage-output">Required DPS for ${time}s:</strong> <span class="damage-output">${formatUnits(requiredDPS)}</span>`;
  } else out.innerHTML="⚠️ Enter valid Mob Health and Desired Time values.";
}

function handleInputEvent() {
    localStorage.setItem(this.id, this.value);
    
    if (this.classList.contains('sync-energy')) {
        syncEnergyInputs(this.value, this.id);
    }
    
    const parentTab = this.closest('.tab-content').id;
    if (parentTab === 'perClickTab') calcPerClick();
    else if (parentTab === 'targetTab') calcTarget();
    else if (parentTab === 'rankTab') calcRank();
    else if (parentTab === 'timeKillTab') calcTimeKill();
    else if (parentTab === 'requiredDpsTab') calcRequiredDps();
}

function syncEnergyInputs(value, sourceId) {
    const energyInputs = document.querySelectorAll('.sync-energy');
    energyInputs.forEach(input => {
        if (input.id !== sourceId && input.value !== value) {
            input.value = value;
            localStorage.setItem(input.id, value); 
        }
    });
}

function handleMobSelection(e, skipCalculation = false) { 
    const isTimeKill = e.target.id === 'mobSelectTime';
    const healthInput = document.getElementById(isTimeKill ? "healthTime" : "healthDps");
    const calcFunction = isTimeKill ? calcTimeKill : calcRequiredDps;

    localStorage.setItem(e.target.id, e.target.value);
    
    if(e.target.value) {
        healthInput.value = e.target.value;
        localStorage.setItem(healthInput.id, e.target.value);
    } else {
        healthInput.value = "";
        localStorage.setItem(healthInput.id, "");
    }

    if (!skipCalculation) {
        calcFunction();
    }
}

function selectSectionAndTab(section, tabId) {
    const energySection = document.getElementById("energySection");
    const damageSection = document.getElementById("damageSection");
    const energyBtn = document.getElementById("energyBtn");
    const damageBtn = document.getElementById("damageBtn");
    
    if (section === 'energy') {
        energySection.classList.add("active"); damageSection.classList.remove("active");
        energyBtn.classList.add("active-btn", "energy"); damageBtn.classList.remove("active-btn", "damage");
        localStorage.setItem('activeSection', 'energy');
    } else {
        damageSection.classList.add("active"); energySection.classList.remove("active");
        damageBtn.classList.add("active-btn", "damage"); energyBtn.classList.remove("active-btn", "energy");
        localStorage.setItem('activeSection', 'damage');
    }
    
    const tabsContainerId = (section === 'energy') ? 'energySection' : 'damageSection';
    const tabBtns = document.querySelectorAll(`#${tabsContainerId} .tab-btn`);
    const tabContents = document.querySelectorAll(`#${tabsContainerId} .tab-content`);
    const isDamage = section === 'damage';

    tabBtns.forEach(t => t.classList.remove("active-tab", "energy", "damage"));
    tabContents.forEach(c => c.classList.remove("active"));
    
    const targetTabBtn = document.querySelector(`[data-tab="${tabId}"]`);
    const targetTabContent = document.getElementById(tabId);
    
    if (targetTabBtn && targetTabContent) {
        targetTabBtn.classList.add("active-tab");
        targetTabBtn.classList.add(isDamage ? "damage" : "energy");
        targetTabContent.classList.add("active");
        
        localStorage.setItem(`${section}Tab`, tabId); 

        if(tabId === 'perClickTab') calcPerClick();
        else if(tabId === 'targetTab') calcTarget();
        else if(tabId === 'rankTab') calcRank();
        else if(tabId === 'timeKillTab') calcTimeKill();
        else if(tabId === 'requiredDpsTab') calcRequiredDps();
    }
}


function setupListeners() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"]');
    
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(input.id);
        
        if (savedValue !== null) {
            input.value = savedValue;
        }

        input.addEventListener("input", handleInputEvent);

        const label = document.getElementById(`label-${input.id}`);
        if (label) {
            const isDamage = input.classList.contains('damage-input');
            const activeClass = isDamage ? 'active-label-damage' : 'active-label-color';
            
            input.addEventListener('focus', () => label.classList.add(activeClass));
            input.addEventListener('blur', () => label.classList.remove(activeClass));
        }
    });

    const mobSelectTime = document.getElementById("mobSelectTime");
    const mobSelectDps = document.getElementById("mobSelectDps");
    
    [mobSelectTime, mobSelectDps].forEach(select => {
        const savedValue = localStorage.getItem(select.id);
        if (savedValue !== null) {
            select.value = savedValue;
        }
        select.addEventListener("change", handleMobSelection);

        if (select.value) {
            handleMobSelection({ target: select }, true);
        }
    });

    const energyBtn = document.getElementById("energyBtn");
    const damageBtn = document.getElementById("damageBtn");
    
    energyBtn.addEventListener("click",()=>{
        const savedTab = localStorage.getItem('energyTab') || 'perClickTab';
        selectSectionAndTab('energy', savedTab);
    });

    damageBtn.addEventListener("click",()=>{
        const savedTab = localStorage.getItem('damageTab') || 'timeKillTab';
        selectSectionAndTab('damage', savedTab);
    });

    function setupTabs(tabParentId, isDamage=false){
      const tabBtns = document.querySelectorAll(`#${tabParentId} .tab-btn`);
      const section = isDamage ? 'damage' : 'energy';
      
      tabBtns.forEach(tab=>{
        tab.addEventListener("click", ()=>{
          selectSectionAndTab(section, tab.dataset.tab);
        });
      });
    }
    setupTabs('energySection', false);
    setupTabs('damageSection', true);

    document.querySelectorAll(".collapsible").forEach(c=>{
      c.addEventListener("click",()=>{ 
        const cont=c.nextElementSibling; 
        cont.classList.toggle('open');
      });
    });

    const savedSection = localStorage.getItem('activeSection') || 'energy';
    let initialTab = (savedSection === 'energy') 
        ? (localStorage.getItem('energyTab') || 'perClickTab')
        : (localStorage.getItem('damageTab') || 'timeKillTab');
    
    selectSectionAndTab(savedSection, initialTab); 
    
    const firstEnergyInput = document.querySelector('.sync-energy');
    if (firstEnergyInput) {
        syncEnergyInputs(firstEnergyInput.value, firstEnergyInput.id);
    }
}

document.addEventListener('DOMContentLoaded', setupListeners);
