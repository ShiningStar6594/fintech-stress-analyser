Portfolio stress analyser


A web-based financial tool to calculate expected returns using the Capital Asset Pricing Model (CAPM) and optimize portfolio distribution.

🌟 Key Features
CAPM Analysis: Calculates expected gain/loss based on asset Beta, Market Move, and Risk-Free Rate.

Risk Metrics: Computes Portfolio Volatility, Sharpe Ratio, and Weighted Portfolio Beta.

Precision Control: User-defined tolerance settings for asset allocation and error margins.

Dynamic Visualization: Interactive charts showing wealth distribution across the portfolio.

📐 Engineering & Financial Logic
The CAPM Algorithm
The core of this application uses the Capital Asset Pricing Model formula to determine the expected return of an investment:
expected return = risk free rate + beta (market move - risk free rate)
target return = risk free rate + tolerance (market move - risk free rate)

📊 Investment Recommendations
The tool doesn't just crunch numbers; it provides a simple investment recommendation by comparing the calculated sharpe ratio against industry benchmarks. This demonstrates an understanding of "Risk-Adjusted Returns"—a key concept for any fintech hiring manager.
! Assumption: The volatility is calculated assuming there is no correlation between different assets, actual volatiltiy is likely to be higher
🛠 Tech Stack
Frontend: HTML, CSS , javascript 

Math Logic: Custom JavaScript implementation of CAPM and Sharpe Ratio and weighted beta and volatility formulas.


📜 License
This project is licensed under the MIT License—see the LICENSE file for details.
