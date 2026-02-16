//General recommendation
function tolerance_and_impact(tol, impact) {
    const rf = Number(risk_free.value);
    const mm = Number(market_move.value);
    const expected_return = rf + tol * (mm - rf);
    if (rf == "" || mm == ""){
        alert("Error, please enter the risk free and market rate ! ");
        return;
    }
    if (impact < expected_return) {
        recommendation.innerHTML = ` ⚠️ Warning: The expected return is lower than your target, adjustments maybe needed !`;
    }
    else if (impact == expected_return) {
        recommendation.innerHTML = ` ✅ Success: Your return perfectly matches the risk-adjusted target!`;
    }
    else {
        recommendation.innerHTML = ` ✅ Success: The expected return is higher than your target, please go through the following suggestions`;
    }
}


function check_sign(num) {
    if (num >= 0) {
        return true;
    }
    return false;
}

function format_name(str) {
    if (str == "") {
        return "";
    }
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return str;
}

function update_advisor(sec_arr, have_total, p_beta, t_invest, tol, sharpe_ratio, market_move) {
    const length = sec_arr.length;
    let worst = 0;
    let best = 0;
    let to_short = [];
    let to_long = [];
    //classify the stocks first
    for (let i = 0; i < length; i++) {
        let stock = sec_arr[i];
        if (p_beta > tol && stock.Beta > 1.0) {
            to_short.push(stock.Name);
        }
        else if (p_beta < tol && stock.Beta > 0.5) {
            to_long.push(stock.Name);
        }
        if (sec_arr[i].Weighted_r > sec_arr[best].Weighted_r) { best = i; }
        if (sec_arr[i].Weighted_r < sec_arr[worst].Weighted_r) { worst = i; }
    }
    //find best and worst performer that affects the most
    let best_per = sec_arr[best].Weighted_r.toFixed(2);
    let worst_per = sec_arr[worst].Weighted_r.toFixed(2);

    if (check_sign(best_per)) {
        recommendation.innerHTML += `<br>🚀 <strong>Top Performer:</strong> ${format_name(sec_arr[best].Name)} (+${best_per}%)`;
    }
    else {
        recommendation.innerHTML += `<br>🚀 <strong>Top Performer:</strong> ${format_name(sec_arr[best].Name)} (${best_per}%)`;
    }
    if (check_sign(worst_per)) {
        recommendation.innerHTML += `<br>📉 <strong>Worst Performer:</strong> ${format_name(sec_arr[worst].Name)} (+${worst_per}%)`;
    }
    else {
        recommendation.innerHTML += `<br>📉 <strong>Worst Performer:</strong> ${format_name(sec_arr[worst].Name)} (${worst_per}%)`;
    }
    //portfolio risk
    let risk_label = "";
    if (p_beta > 1.2) {
        risk_label = " 🛡️ Your portfolio is <strong>aggressive</strong>. This hedge acts as insurance against a market crash.";
    }
    else if (p_beta > 0 && p_beta <= 1.2) {
        risk_label = " 📊 Your portfolio is <strong>market-aligned</strong>. This hedge will move you toward a 'Market Neutral' strategy.";
    }
    else if (p_beta < 0) {
        risk_label = " ⚠️ Your portfolio is <strong>inverse/Hedged</strong>. This hedge will reduce your bet against the market.";
    }
    else {
        risk_label = " 🛡️ Your portfolio is within your risk tolerance";
    }
    recommendation.innerHTML += `<br> ${risk_label}`;
    //base on portfolio beta
    if (p_beta > tol) {
        let highBetaSectors = [];
        for (let i = 0; i < sec_arr.length; i++) {
            if (sec_arr[i].Beta > 1.0) {
                highBetaSectors.push(format_name(sec_arr[i].Name));
            }
        }
        if (highBetaSectors.length > 0) {
            recommendation.innerHTML += `<br> 💡 <strong>Optimization:</strong> To lower your risk to your target level, consider <strong>reducing</strong> your weight in: ${highBetaSectors.join(", ")}.`;
            if (have_total) {
                let reduction_estimate = ((p_beta - tol) / p_beta) * Number(t_invest);
                recommendation.innerHTML += `<br> 💰 <em>Estimated action: Sell approximately <strong>$${reduction_estimate.toFixed(0)}</strong> total from these sectors.</em>`;
            }
            else {
                let reduction_pct = ((p_beta - tol) / p_beta) * 100;
                recommendation.innerHTML += `<br> 📊 <em>Estimated action: Reduce your total exposure to these sectors by <strong>${reduction_pct.toFixed(1)}%</strong>.</em>`;
            }
        }
    }
    else if (p_beta < (tol * 0.7)) {
        let growthSectors = [];
        let defensiveSectors = [];

        for (let i = 0; i < sec_arr.length; i++) {
            let stock = sec_arr[i];
            let name = format_name(stock.Name);
            if (stock.Beta > 1.2) { growthSectors.push(name); }
            else if (stock.Beta < 0.5) { defensiveSectors.push(name); }
        }
        if (growthSectors.length > 0 && defensiveSectors.length > 0) {
            recommendation.innerHTML += `<br> ⚖️ <strong>Strategic Pivot:</strong> Consider reducing defensive assets (<strong>${defensiveSectors.join(", ")}</strong>) to fund higher beta positions in: ${growthSectors.join(", ")}.`;
        }
        // --- Rotation fallback ---
        else {
            let sorted = [...sec_arr].sort(function (a, b) { return a.Weighted_r - b.Weighted_r; });
            let exit1 = format_name(sorted[0].Name);
            let best_index = length - 1;
            while (best_index > 0 && sorted[best_index].Beta < 0.8) {
                best_index--;
            }
            let top_performer_obj = sorted[best_index];
            let top_performer = format_name(top_performer_obj.Name);

            recommendation.innerHTML += `<br> 🔄 <strong>Rotation:</strong> Swap your laggard <strong>${exit1}</strong> for higher beta growth sectors.`;

            if (top_performer_obj.Beta >= 0.8) {
                recommendation.innerHTML += `<br> 📈 <strong>Momentum:</strong> Consider investing more in <strong>${top_performer}</strong> to boost your market exposure.`;
            }
        }
    }
    else {
        recommendation.innerHTML += ` <br> ✅ Your current stock mix is well-aligned with your risk tolerance.`;
    }
    //recommendation on each stock
    if (to_short.length > 0) {
        recommendation.innerHTML += `<br>✂️ <strong>Suggested Trims:</strong> ${to_short.join(", ")} (Reducing these will help hit your Beta target of ${tol}).`;
    }

    if (to_long.length > 0 && p_beta < (tol * 0.8)) {
        recommendation.innerHTML += `<br>➕ <strong>Suggested Adds:</strong> ${to_long.join(", ")} (Increasing these can capture more market upside).`;
    }
    if (sec_arr[worst].Beta < 0 && Number(market_move.value) > 0) {
        recommendation.innerHTML += `<br>⚠️ <strong>Liability Alert:</strong> ${sec_arr[worst].Name} is shorting a rising market. This is a strategic drag.`;
    }
    //sharpe ratio
    if (sharpe_ratio != null) {
        if (sharpe_ratio < 0) {
            recommendation.innerHTML += `<br>🛑 <strong>Strategic Pivot:</strong> Your risk-adjusted return is negative. It is mathematically better to hold <strong>Risk-Free Assets</strong> (Cash) until efficiency improves.`;
        }
        else if (sharpe_ratio < 0.5) {
            recommendation.innerHTML += `<br>⚖️ <strong>Overall:</strong> Your portfolio is <strong>sub-optimal</strong>. You are taking on high volatility for relatively low returns. Consider diversifying.`;
        }
        else if (sharpe_ratio < 1.0) {
            recommendation.innerHTML += `<br>✨ <strong>Overall:</strong> Your portfolio is <strong>efficient</strong>. You have a healthy risk-to-reward balance.`;
        }
        else {
            recommendation.innerHTML += `<br>💎 <strong>Overall:</strong> Your portfolio is <strong>highly optimized</strong>. Excellent risk management.`;
        }
    }
}










