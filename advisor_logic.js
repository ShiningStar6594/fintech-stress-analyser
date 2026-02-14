//General recommendation
function tolerance_and_impact(tol,impact){
    if (impact > tol){
        recommendation.innerHTML = ` ⚠️ Warning: The expected return is lower than your target, adjustments maybe needed !`;
    }
    else if (impact == tol){
        recommendation.innerHTML = ` ⚠️ Warning: The expected return is exactly equals to your target, adjustments maybe needed !`;
    }
    else {
        recommendation.innerHTML = ` ✅ Success: The expected return is higher than your target, please go through the following suggestions`;
    }
}


function check_sign(num){
    if (num >= 0){
        return true;
    }
    return false;
}

function update_advisor(sec_arr, have_total,p_beta, t_invest, tol,sharpe_ratio){
    const length = sec_arr.length;
    let worst = 0;
    let best = 0;
    //find best and worst performer that affects the most
    for (let i = 1; i < length ; i++){
        if (sec_arr[i].Weighted_r > sec_arr[best].Weighted_r){
            best = i;
        }
        if (sec_arr[i].Weighted_r < sec_arr[worst].Weighted_r){
            worst = i;
        }
    }
    let best_per = sec_arr[best].Weighted_r.toFixed(2);
    let worst_per = sec_arr[worst].Weighted_r.toFixed(2);

    if (check_sign(best_per)){
        recommendation.innerHTML += `<br>🚀 <strong>Top Performer:</strong> +${sec_arr[best].Name} (${best_per}%)`;
    }
    else{
        recommendation.innerHTML += `<br>🚀 <strong>Top Performer:</strong> -${sec_arr[best].Name} (${best_per}%)`;
    }
    if(check_sign(worst_per)){
        recommendation.innerHTML += `<br>📉 <strong>Biggest Drag:</strong> +${sec_arr[worst].Name} (${worst_per}%)`;
    }
    else{
        recommendation.innerHTML += `<br>📉 <strong>Biggest Drag:</strong> -${sec_arr[worst].Name} (${worst_per}%)`;
    }
    //hedging
    let action = (p_beta > 0) ? "Short" : "Long" ;
    let hedge_amount = 0;
    let hedge_percentage = 0;
    let suggestion = "";
    if (p_beta > 1.2) {
    suggestion = "Your portfolio is <strong>aggressive</strong>. This hedge acts as insurance against a market crash.";
    } 
    else if (p_beta > 0 && p_beta <= 1.2) {
    suggestion = "Your portfolio is <strong>market-aligned</strong>. This hedge will move you toward a 'Market Neutral' strategy.";
    }
    else if (p_beta < 0) {
    suggestion = "Your portfolio is <strong>inverse/Hedged</strong>. This hedge will reduce your bet against the market.";
    }
    else{
        suggestion = "Your portfolio is within your risk tolerance";
    }
    if (Math.abs(p_beta) > tol){
        if (have_total){
        hedge_amount = Math.abs(p_beta * Number(t_invest));
        recommendation.innerHTML += `<br> 🛡️ ${suggestion} <br> <strong>Action:</strong> ${action} $${hedge_amount.toFixed(0)} worth of a market index.`;;
        }
        else{
        hedge_percentage = Math.abs(p_beta * 100);
        recommendation.innerHTML += `<br> 🛡️ ${suggestion} <br> <strong>Action:</strong> ${action} $${hedge_percentage.toFixed(1)}% of your portfolio value.`;
        }
        if (sec_arr[worst].Weighted_r < -2) { 
        recommendation.innerHTML += ` <br> 💡 <strong>Strategy:</strong> Since ${sec_arr[worst].Name} is a major drag (${sec_arr[worst].Weighted_r.toFixed(2)}%), consider trimming this position to reduce your overall market sensitivity. 
        Your biggest liability. Reducing this position could lower your risk.`};
    }
    else{
        recommendation.innerHTML += ` <br> ✅ You are within your risk tolerance`;
    }
    //sharpe ratio recommendations
    if (sharpe_ratio!= null){
        if (sharpe_ratio < 0.5){
           recommendation.innerHTML += `<br>  <strong>Overall:</strong> Your portfolio is sub-optimal. You are taking on high volatility for relatively low returns. Consider diversifying into uncorrelated sectors to improve your risk-adjusted performance.` 
        }
        else if (sharpe_ratio > 0.5 && sharpe_ratio < 1){
           recommendation.innerHTML += `<br>  <strong>Overall:</strong> Your portfolio is efficient. You have a healthy risk-to-reward balance, and your returns are effectively compensating you for the market volatility you are experiencing.`
        }
        else{
           recommendation.innerHTML += `<br>  <strong>Overall:</strong> Your portfolio is highly optimized. You are achieving exceptional returns relative to the risk taken. This setup demonstrates excellent diversification and efficiency.`
        }
    }


}

