//get IDs
// 1. Portfolio Inputs
const nameInputs = document.getElementsByClassName("sector_name");
const weightInputs = document.getElementsByClassName("sector_weight");
const container = document.getElementById("portfolio_inputs");
const standard_deviation = document.getElementsByClassName("sector_SD");

// 2. Main Control Buttons
const add = document.getElementById("addSectorBtn");
const del = document.getElementById("deleteSectorBtn");
const re = document.getElementById("resetBtn");

// 3. Shock System (Dynamic)
const shock_container = document.getElementById("shock_container");
const shock_rows = document.getElementsByClassName("scenario_controls");
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
const tolerance = document.getElementById("risk_tolerance");
const tolerance_value = document.getElementById("tolerance_val");

// 6. Marco system
const market_move = document.getElementById("market_move");
const total_investment = document.getElementById("total_investment");
const risk_free = document.getElementById("risk_free_return");

// 7. windows
const modal_instructions = document.getElementById("modal_instructions");
const modal_update = document.getElementById("modal_update");
const modal_author = document.getElementById("modal_author");
const popup_update = document.getElementById("popup_update");
const popup_instructions = document.getElementById("popup_instructions");
const popup_author = document.getElementById("popup_author");



//colour tables
const colors = [
    "#dade05", "#ef0909", "#17cf10", "#11d6e0", "#e91fe9", 
    "#ab7d29", "#100ccf", "#2d7934", "#859332", "#eb6a00", 
    "#670dcf", "#4f3e3e",
    "#ff7f50", "#00ced1", "#ff1493", "#00ff00", "#ffd700", 
    "#4b0082", "#00fbff", "#7cfc00"
];
const cash_colour = "#ddd";

//chart logic
function update_chart() {
    let c = 0;
    let gradient_string = "";
    let label_html = "";
    let t_weight = 0;

    // 1. Calculate total weight 
    for (let i = 0; i < weightInputs.length; i++) {
        t_weight += Number(weightInputs[i].value) || 0;
    }

    // 2. Build the chart segments
    for (let i = 0; i < weightInputs.length; i++) {
        let weight = Number(weightInputs[i].value) || 0;
        let temp = nameInputs[i].value.trim();
        if (temp === "") temp = "Sector " + (i + 1); 
        
        if (weight > 0) {
            let start = c;
            let end = c + weight;
            let color = colors[i % colors.length];
            gradient_string += `${color} ${start}% ${end}%, `;
            label_html += `<div><span style="color:${color}">■</span> ${temp}: ${weight}%</div>`;
            c = end; 
        }
    }

    // 3. Render logic
    if (gradient_string === "") {
        chart.style.background = "#ddd";
        label.innerHTML = "No data entered";
    } else {
        let final_list = gradient_string.slice(0, -2); // Remove trailing comma and space
        chart.style.background = `conic-gradient(${final_list}, #ddd ${c}% 100%)`;
        if (t_weight < 100) {
            let cash_amount = (100 - t_weight).toFixed(1);
            label_html += `<div><span style="color:#ddd">■</span> Cash/Reserve: ${cash_amount}%</div>`;
        }
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
    if (total_investment.value == ""){
        return false;
    }
    return true;
}

//buttons function
function addSector(){
    const newRow = `
        <div class="sector-row">
            <input type="text" class="sector_name" placeholder="Sector Name">
            <input type="number" class="sector_weight" min="0" placeholder="Weight %">
            <input type="number" class="sector_SD" placeholder="SD (Optional)">
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
        const rows = document.getElementsByClassName("sector_row");
        rows[rows.length - 1].remove();
        if (shock_rows.length > nameInputs.length){
            shock_container.lastElementChild.remove();
        }
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
            <input type="text" class="target" placeholder="Sector to shock">
            <input type="number" class="shock" step="0.1" placeholder="Beta " min="-5" max="5" >
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
        if (weightInputs[i].value <= 0){
            alert("Error: All weight should be positive");
            return false;
        }
        total += Number(weightInputs[i].value);
    }
    if (total != 100){
        alert("Error, the total weight should be 100% !");
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
    if (rf == "" || mm == ""){
        alert("Error, please enter the risk free and market rate ! ");
        return;
    }
    return w / 100 *(rf + beta*(mm - rf)) ;
}

//SD logics
function portfolio_SD_check(){
    let count = 0;
    for (let i = 0; i < standard_deviation.length; i++){
        if (standard_deviation[i].value.trim() != ""){
            count++;            
        }
    }
    if (count != 0 && count != standard_deviation.length){
        alert("Error, please either fill all SD or leave all empty !");
        return false;
    }
    return true;
}

function portfolio_SD_val(){
    if (standard_deviation[0].value.trim() == ""){
        return null;
    }    
    let port_sd = 0;
    for (let i = 0; i < standard_deviation.length;i++){
        port_sd = Math.abs((Number(weightInputs[i].value) / 100)) * Number(standard_deviation[i].value) + port_sd;
    }
    return port_sd;
}

function cal_sharper_ratio(port_sd,impact){
    if (portfolio_SD_val() == null || port_sd == 0){
        return null;
    }
    const rf = Number(risk_free.value);
    let sharpe_ratio = (impact - rf) / port_sd;
    return sharpe_ratio;
}
// Attach listeners

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
        standard_deviation[i].value = "";
    }
    market_move.value = "";
    risk_free.value = "";
    total_investment.value = "";
    tolerance_value.textContent = 5;
    tolerance.value = 5;
    reset_chart();
})
runBtn.addEventListener("click", function(){
    // 1. implement all the checkings
    if (!valid_inputs() ||!check_duplicate_names(nameInputs) ||!check_duplicate_names(target) ||!check_for_names()
    || !portfolio_SD_check()){
        return;
    }
    // 2. calculation and logic
    let total_impact = 0;
    let portfolio_beta = 0;
    let total_weight = 0;
    const sector_arr = [];
    const portfolio_map = new Map();
    for (let i = 0; i < nameInputs.length; i++) {
    let name = nameInputs[i].value.toLowerCase().trim();
    total_weight += Number(weightInputs[i].value);
    //portofolio map object set up and pass into array
    portfolio_map.set(name, {weight: Number(weightInputs[i].value), beta: 0});
    }
    let remaining_cash = 100 - total_weight;

    for (let j = 0; j < shock_rows.length; j++) {
    let tName = target[j].value.toLowerCase().trim();
    let sVal = Number(shock[j].value);

    if (portfolio_map.has(tName)) {
        portfolio_map.get(tName).beta = sVal;
    }
    }

    portfolio_map.forEach((data,name) => {
      let sector_return = getshockvalue(100,data.beta);
      let weighted_return = getshockvalue(data.weight, data.beta);
      
      sector_arr.push({
        Name: name,
        Sector_r: sector_return,
        Weighted_r: weighted_return,
        Beta: data.beta
      });

      total_impact += weighted_return
      portfolio_beta += (data.weight / 100) * data.beta;
    });
    // 3. UI update
    let final_vol = portfolio_SD_val();
    total_impact += remaining_cash * risk_free.value / 100;
    let final_sharpe_ratio = cal_sharper_ratio(final_vol, total_impact);
    let expected_value = Number(total_investment.value)*(1+total_impact/100);
    if (total_impact >= 0){
        if (check_total_investment()){
            impact.innerHTML = `The total expected gain is ${total_impact.toFixed(2)} % <br>
            The expected value of the portfolio will be ${expected_value.toFixed(0)}(by CAPM)`;
        }
        else{
            impact.innerHTML = `The total expected gain is ${total_impact.toFixed(2)} % (by CAPM)`;
        }
    }
    else{
        total_impact *= -1;
        
        if (check_total_investment()){
            
            impact.innerHTML = `The total expected loss is ${total_impact.toFixed(2)} % <br>
            The expected value of the portfolio will be ${expected_value.toFixed(0)} (by CAPM)`;            
        }
        else{
            impact.innerHTML = `The total expected gain is ${total_impact.toFixed(2)} %(by CAPM)`;
        }
        total_impact *= -1;
    }
    if (final_vol != null){
        impact.innerHTML += `<br> The portfolio volatlity is ${final_vol.toFixed(2)}`;
    }
    if (final_sharpe_ratio != null){
        impact.innerHTML += `<br> The portfolio sharpe ratio is ${final_sharpe_ratio.toFixed(2)}`;
    }
    impact.innerHTML += `<br> The portfolio beta is ${portfolio_beta.toFixed(2)}`;
    recommendation.innerHTML = "";
    tolerance_and_impact(Number(tolerance.value),total_impact);
    update_advisor(sector_arr,check_total_investment(),portfolio_beta,total_investment.value,tolerance.value,final_sharpe_ratio,
    market_move.value);
});  



