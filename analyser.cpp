#include <iostream>
#include <vector>
#include <string>
#include <map>

struct AssetBucket {
    std::string name;
    double weight; // Percentage of portfolio (0 to 100)
};

class StressTestEngine {
public:
    void inputCurrentPortfolio() {
        for (int i = 0; i < 5; i++){
            AssetBucket temp;
            std::cout << "Enter Sector name: " << std::endl;
            std::cin >> temp.name;
            std::cout << "Enter valid Weight: " << std::endl;
            std::cin >> temp.weight;
            total += temp.weight;
            if (total == 100){
                break;
            }
            while (temp.weight < 0 || total > 100){
                total -= temp.weight;
                std::cout << "Please enter valid Weight: " << std::endl;
                std::cin >> temp.weight;
                total += temp.weight;
            }
            portfolio.push_back(temp); //push into portfolio
        }
    }

    void runScenario() {
        double shockValue;
        std::string target;
        //Ask user: "Which sector/currency to shock?" (e.g., Financials)
        std::cout << "What sector to shock?" << std::endl;
        std::cin >> target;
        //Ask user: "Magnitude of shock in %?" (e.g., -0.20 for a 20% drop)
        for (int i = 0; i < 5; i++){
            if (target == portfolio[i].name){
                std::cout << "What is the magnitude of shock in %?" << std::endl;
                std::cin >> shockValue;
                double change = portfolio[i].weight * shockValue /100;
                std::cout << "Total portfolio impact:" << change << "%" << std::endl;
                total -= change;
                loss = change;
            }
        }
        
    }
    // If the loss exceeds a certain "Risk Tolerance", suggest a trade.
    void suggestAction(double calculatedLoss) {
        // "Hedge" or "Rebalance" specific buckets.
        if (threshold < calculatedLoss){
            std::cout << "Recommendation: Reduce exposure or buy Put Options to hedge." << std::endl;
        }
        else{
            std::cout << "Portfolio is resilient. Loss is within your " << threshold << "% tolerance." << std::endl;
        }
    }

    double getPortfolioHealth() const {
        return total;
    }
    double getloss() const {
        return loss;
    }
private:
std::vector<AssetBucket> portfolio;
double total = 0;
const int threshold = 5;
double loss = 0;    
};

int main() {
    // STEP 6: Execute the workflow.
    // 1. Initialize Engine
    StressTestEngine engine;
    // 2. Input Data
    engine.inputCurrentPortfolio();
    // 3. Run Scenario
    engine.runScenario();
    // 4. Show Decision
    engine.suggestAction(engine.getloss());
    return 0;
}