// ProgressiveEffects.js

/**
 * ProgressiveEffects Calculation Engine
 * This module supports linear, exponential, and logarithmic growth calculations.
 */

class ProgressiveEffects {
    static linearGrowth(startValue, rate, time) {
        return startValue + (rate * time);
    }

    static exponentialGrowth(startValue, growthRate, time) {
        return startValue * Math.pow((1 + growthRate), time);
    }

    static logarithmicGrowth(startValue, growthFactor, time) {
        return startValue + (growthFactor * Math.log(time + 1)); // Adding 1 to avoid log(0)
    }
}

// Example usages:
// console.log(ProgressiveEffects.linearGrowth(100, 5, 10)); 
// console.log(ProgressiveEffects.exponentialGrowth(100, 0.1, 10)); 
// console.log(ProgressiveEffects.logarithmicGrowth(100, 10, 10)); 

module.exports = ProgressiveEffects;