//get IDs
// 1. Portfolio Inputs
const nameInputs = document.getElementsByClassName("sector-name");
const weightInputs = document.getElementsByClassName("sector-weight");
const container = document.getElementById("portfolio-inputs");

// 2. Main Control Buttons
const add = document.getElementById("addSectorBtn");
const del = document.getElementById("deleteSectorBtn");
const re = document.getElementById("resetBtn");

// 3. Shock System (Dynamic)
const shock_container = document.getElementById("shock_container");
const shock_rows = document.getElementsByClassName("scenario-controls");
const add_shock = document.getElementById("addShockBtn"); 
const del_shock = document.getElementById("deleteShockBtn");
const runBtn = document.getElementById("runBtn");
const target = document.getElementsByClassName("target");
const shock = document.getElementsByClassName("shock");

// 4. Display/UI Elements
const chart = document.getElementById("piechart");
const label = document.getElementById("label");
const impact = document.getElementById("resultText"); 
const recommendation = document.getElementById("adviceText");

// 5. Risk system
const tolerance = document.getElementById("risk-tolerance");
const tolerance_value = document.getElementById("tolerance-val");

// 6. Marco system
const market_move = document.getElementById("market-move");
const total_investment = document.getElementById("total-investment");
const risk_free = document.getElementById("risk_free_return");

//colour tables
const colors = [
    "#dade05", "#ef0909", "#17cf10", "#11d6e0", "#e91fe9", 
    "#ab7d29", "#100ccf", "#2d7934", "#859332", "#eb6a00", 
    "#670dcf", "#4f3e3e",
    "#ff7f50", "#00ced1", "#ff1493", "#00ff00", "#ffd700", 
    "#4b0082", "#00fbff", "#7cfc00"
];

//chart logic
function update_chart() {
    let c = 0;
    let gradient_string = "";
    let label_html = "";

    for (let i = 0; i < weightInputs.length; i++) {
        let weight = Number(weightInputs[i].value) || 0;
        let temp = nameInputs[i].value.trim();
        if (temp === "") temp = "Sector " + (i + 1); 
        
        if (weight > 0) {
            let start = c;
            let end = c + weight;
            let color = colors[i % colors.length];

            gradient_string += `${colors[i % colors.length]} ${start}% ${end}%, `;
            label_html += `<div><span style="color:${color}">■</span> ${temp}: ${weight}%</div>`;
            c = end; 
        }
    }
    if (gradient_string === "") {
        chart.style.background = "#ddd";
    } else {
        let final_list = gradient_string.slice(0, -2);
        chart.style.background = `conic-gradient(${final_list}, #ddd ${c}% 100%)`;
    }
    label.innerHTML = label_html;
}

function reset_chart(){
    chart.style.background = "#ddd";
    label.innerHTML = "";
}

//input tolerance bar
tolerance.addEventListener("input",function(){
    tolerance_value.textContent = tolerance.value;
})

//total investment check
total_investment.addEventListener("input", function(){
    this.value = this.value.replace(/[^0-9]/g, '');
})

//input check
container.addEventListener("input", function(e) {
    if (e.target.classList.contains("sector-weight")) {
        let value = Number(e.target.value);
        if (value > 100) {
            e.target.value = 100;
        }
        if (value < 0) {
            e.target.value = 0;
        }
    }
    update_chart();
});


//total check
function check_total_investment(){
    if (total_investment.value < 0){
        total_investment.value = 0;
    }
    if (total_investment == ""){
        return false;
    }
    return true;
}

//buttons function
function addSector(){
    const newRow = `
        <div class="sector-row">
            <input type="text" class="sector-name" placeholder="Sector Name">
            <input type="number" class="sector-weight" min="0" placeholder="Weight %">
            <input type="number" class="sector_SD" placeholder="Standard deviation">
        </div>`;
        if (nameInputs.length == 20){
            alert(" The maximum number of sectors is 20 !");
            return false;
        }
        else {
            container.insertAdjacentHTML('beforeend', newRow);
            return true;
        }    
}

function deleteSector(){
    if (nameInputs.length <2){
        alert(" The minimum number of sectors is 1 ! ");
        return false;
    }
    else{
        const rows = document.getElementsByClassName("sector-row");
        rows[rows.length - 1].remove();
        return true;
    }
}

function add_shock_sec() {
    if (shock_rows.length >= nameInputs.length) {
        alert("You cannot exceed the number of sector inputs!");
        return false;
    }

    const newRow = `
        <div class="scenario-controls">
            <input type="text" class="target" placeholder="Sector to Shock">
            <input type="number" class="shock" min="0" placeholder="Shock %">
        </div>`;
    
    shock_container.insertAdjacentHTML('beforeend', newRow);
    return true;
}

function del_shock_sec() {
    if (shock_rows.length < 2) {
        alert("The minimum number of shock sectors is 1!");
        return false;
    } else {
        shock_container.lastElementChild.remove();
        return true;
    }
}


//names checking
function check_duplicate_names(a){
    for (let i = 0; i < a.length;i++){
        let text1 = a[i].value;
        text1 = text1.toLowerCase();
        for (let j = i+1 ;j < a.length;j++){
            let text2 = a[j].value;
            text2 = text2.toLowerCase();
            if (text1 == text2){
                alert("Error, there are duplicate names in your sectors input !");
                return false;
            }
        }
    }
    return true;
}

function check_for_names(){
    const N = new Set();
    for (let j = 0; j < nameInputs.length; j++){
        N.add(nameInputs[j].value);
    }
    for (let i = 0; i < shock_rows.length; i++){
        if (! N.has(target[i].value)){
            alert (" The name in the shock does not exist in the input ! ");
            return false;
        }
    }
    return true;
}

//valid inputs
function valid_inputs() {
    let total = 0;

    // 1. Check Portfolio Side
    for (let i = 0; i < weightInputs.length; i++) {
        if (nameInputs[i].value.trim() === "" || weightInputs[i].value === "") {
            alert("Error: All Sector names and weights must be filled!");
            return false;
        }
        total += Number(weightInputs[i].value);
    }

    if (total > 100) {
        alert("Error: Total weight is more than 100%!");
        return false;
    }
    else if(total < 100){
        alert("Error: Total weight is less than 100%!");
        return false;
    }

    // 2. Check Shock Side
    for (let j = 0; j < shock_rows.length; j++) {
        // Check raw strings for emptiness
        if (target[j].value.trim() === "" || shock[j].value === "") {
            alert("Error: Shock targets and values cannot be empty!");
            return false;
        }

        let sVal = Number(shock[j].value);
        if (sVal < -5 || sVal > 5) {
            alert("Error: Beta must be between -5 and 5!");
            return false;
        }
    }

    return true; 
}

function getshockvalue(w,beta){
    const rf = Number(risk_free.value);
    const mm = Number(market_move.value);
    return w / 100 *(rf + beta*(mm - rf)) ;
}


// Attach listeners
add.addEventListener("click", addSector);
del.addEventListener("click", deleteSector);
add_shock.addEventListener("click", add_shock_sec);
del_shock.addEventListener("click", del_shock_sec);
total_investment.addEventListener("input", check_total_investment);
re.addEventListener("click",function(){
    impact.textContent = "Impact: --";
    recommendation.textContent = "Recommendation: --";
    while(shock_rows.length > 1){
        del_shock_sec();
    }
    shock[0].value = "";
    target[0].value ="";
    while (nameInputs.length > 1){
        deleteSector();
    }
    for (let i = 0; i < nameInputs.length;i++){
        nameInputs[i].value = "";
        weightInputs[i].value = "";
    }
    tolerance_value.textContent = 5;
    tolerance.value = 5;
    reset_chart();
})
runBtn.addEventListener("click", function(){
    // 1. implement all the checkings
    if (!valid_inputs() ||!check_duplicate_names(nameInputs) ||!check_duplicate_names(target) ||!check_for_names()){
        return;
    }
    // 2. calculation and logic
    let total_impact = 0;
    const portfolio_map = new Map();
    for (let i = 0; i < nameInputs.length; i++) {
    let name = nameInputs[i].value.toLowerCase().trim();
    let weight = Number(weightInputs[i].value);
    portfolio_map.set(name, weight);
    }

    for (let j = 0; j < shock_rows.length; j++) {
    let tName = target[j].value.toLowerCase().trim();
    let sVal = Number(shock[j].value);

    if (portfolio_map.has(tName)) {
        let weight = portfolio_map.get(tName);
        total_impact += getshockvalue(weight, sVal);
    }
    }
    // 3. UI update
    if (total_impact >= 0){
        if (check_total_investment()){
            impact.innerHTML = `The total expected gain is ${total_impact.toFixed(2)} % <br>
            The expected value of the portfolio will be ${Number(total_investment.value)*(1+total_impact/100)}`;
        }
        else{
            impact.innerHTML = `The total expected gain is ${total_impact.toFixed(2)} %`;
        }
    }
    else{
        total_impact *= -1;
        if (check_total_investment()){
            impact.innerHTML = `The total expected loss is ${total_impact.toFixed(2)} % <br>
            The expected value of the portfolio will be ${Number(total_investment.value)*(1-total_impact/100)}`;
        }
        else{
            impact.innerHTML = `The total expected gain is ${total_impact.toFixed(2)} %`;
        }
    }

});  