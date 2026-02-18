//General recommendation
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






function update_advisor(sec_arr, have_total, p_beta, t_invest, tol, sharpe_ratio) {
    const length = sec_arr.length;
    let worst = 0;
    let best = 0;
    let high_beta_trims = [];
    let growth_adds = [];

    // 1. Identify key performers and move-makers
    for (let i = 0; i < length; i++) {
        let stock = sec_arr[i];
        
        // Logic for rebalancing suggestions
        if (p_beta > tol && stock.Beta > 1.0) {
            high_beta_trims.push(format_name(stock.Name));
        } else if (p_beta < tol && stock.Beta > 0.5) {
            growth_adds.push(format_name(stock.Name));
        }

        if (sec_arr[i].Weighted_r > sec_arr[best].Weighted_r) { best = i; }
        if (sec_arr[i].Weighted_r < sec_arr[worst].Weighted_r) { worst = i; }
    }

    let best_per = sec_arr[best].Weighted_r.toFixed(2);
    let worst_per = sec_arr[worst].Weighted_r.toFixed(2);

    // 2. Output Contributors
    if (check_sign(best_per)) {
        recommendation.innerHTML += `<br>🚀 <strong>Top Performer:</strong> ${format_name(sec_arr[best].Name)} (+${best_per}%)`;
    } else {
        recommendation.innerHTML += `<br>🚀 <strong>Top Performer:</strong> ${format_name(sec_arr[best].Name)} (${best_per}%)`;
    }

    if (check_sign(worst_per)) {
        recommendation.innerHTML += `<br>📉 <strong>Worst Performer:</strong> ${format_name(sec_arr[worst].Name)} (+${worst_per}%)`;
    } else {
        recommendation.innerHTML += `<br>📉 <strong>Worst Performer:</strong> ${format_name(sec_arr[worst].Name)} (${worst_per}%)`;
    }

    // 3. Risk Labeling (Long-only logic)
    let risk_label = "";
    if (p_beta > 1.2) {
        risk_label = "🛡️ Your portfolio is <strong>aggressive</strong>. It is highly sensitive to market swings and aims for high growth.";
    } else if (p_beta > 0 && p_beta <= 1.2) {
        risk_label = "📊 Your portfolio is <strong>market-aligned</strong>. It is designed to track broader market performance closely.";
    } else if (p_beta < 0) {
        risk_label = "⚠️ Your portfolio is <strong>Inverse-Correlated</strong>. These assets act as a natural safety buffer by moving opposite to the market.";
    } else {
        risk_label = "✅ Your portfolio is within a conservative risk range.";
    }
    recommendation.innerHTML += `<br>${risk_label}`;

    // 4. Rebalancing Logic
    if (p_beta > tol) {
        recommendation.innerHTML += `<br>💡 <strong>Optimization:</strong> To lower risk to your ${tol} target, consider <strong>reducing</strong> exposure in: ${high_beta_trims.join(", ")}.`;
        if (have_total) {
            let reduction_estimate = ((p_beta - tol) / p_beta) * Number(t_invest);
            recommendation.innerHTML += `<br>💰 <em>Action: Sell approx. <strong>$${reduction_estimate.toFixed(0)}</strong> from these sectors.</em>`;
        }
    } else if (p_beta < (tol * 0.7)) {
        recommendation.innerHTML += `<br>⚖️ <strong>Strategic Pivot:</strong> Your portfolio is significantly more defensive than your tolerance. Consider redirecting funds to capture more upside.`;
    } else {
        recommendation.innerHTML += `<br>✅ Your current sector mix is well-aligned with your risk tolerance.`;
    }

    // 5. Asset-Specific Warnings
    if (sec_arr[worst].Beta < 0 && Number(market_move.value) > 0) {
        recommendation.innerHTML += `<br>⚠️ <strong>Liability Alert:</strong> ${format_name(sec_arr[worst].Name)} is providing protection but acting as a drag during this market rally.`;
    }

    // 6. Sharpe Ratio Grading (The "Efficiency" Score)
    if (sharpe_ratio != null) {
        let efficiency_msg = "";
        if (sharpe_ratio < 0) {
            efficiency_msg = "🛑 <strong>Strategic Pivot:</strong> Risk-adjusted return is negative. It is mathematically better to hold cash until efficiency improves.";
        } else if (sharpe_ratio < 0.5) {
            efficiency_msg = "⚖️ <strong>Overall:</strong> Portfolio is <strong>sub-optimal</strong>. You are taking high volatility for low relative returns.";
        } else if (sharpe_ratio < 1.0) {
            efficiency_msg = "✨ <strong>Overall:</strong> Portfolio is <strong>efficient</strong>. Good risk-to-reward balance.";
        } else {
            efficiency_msg = "💎 <strong>Overall:</strong> Portfolio is <strong>highly optimized</strong>. Excellent risk management.";
        }
        recommendation.innerHTML += `<br><br>${efficiency_msg}`;
    }
}















