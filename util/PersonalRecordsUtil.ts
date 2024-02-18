

export function calculatePr(
    weight:number,
    reps: number
){    
    if (reps < 9) {
        return bryzckiFormula(weight,reps);
    }
    else if (reps < 11) {
        return mayhewFormula(weight, reps);
    }
    else {
        epleyFormula(weight, reps);
    }
}
/**
 * Formula used for <1,8> reps
 * @param weight 
 * @param reps 
 * @returns 
 */
function bryzckiFormula(
    weight: number,
    reps : number
) { return weight / (1.0278 - 0.0278 * reps); }

/**
 * Formula used of <9,10> reps range
 * @param weight 
 * @param reps 
 */
function mayhewFormula(
    weight: number,
    reps: number
) {return (100* weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps)); }

/**
 * Formula used for <10,infinity)
 * @param weight 
 * @param reps 
 * @returns 
 */
function epleyFormula(
    weight: number,
    reps : number
) { return weight * (1 + 0.0333 * reps); }