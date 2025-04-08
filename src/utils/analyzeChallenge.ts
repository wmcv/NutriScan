import { supabase } from "../supabaseClient";

async function handleChallengeSuccess(challengeKey: string, challengeAmount: number, updatedChallengeProgress: number[]): Promise<[number, number]> {
    console.log(`Success for ${challengeKey} with out of ${challengeAmount}`);


    if (challengeKey === 'challenge1'){
        if (updatedChallengeProgress[0] >= challengeAmount) {
          return [0,0]
        } else {
            if ((updatedChallengeProgress[0]+1) === challengeAmount){
              return [2,1] 
            }
            return [1,0]    
        }
    } else if (challengeKey === 'challenge2'){
        if (updatedChallengeProgress[1] >= challengeAmount) {
          return [0,0]
        } else {
            if ((updatedChallengeProgress[1]+1) === challengeAmount){
              return [2,1] 
            }
            return [1,0] 
        }
    } else if (challengeKey === 'challenge3'){
        if (updatedChallengeProgress[2] >= challengeAmount) {
          return [0,0]
        } else {
            if ((updatedChallengeProgress[2]+1) === challengeAmount){
              return [2,1] 
            }
            return [1,0] 
        }
    } else if (challengeKey === 'challenge4'){
        if (updatedChallengeProgress[3] >= challengeAmount) {
          return [0,0]
        } else {
            if ((updatedChallengeProgress[3]+1) === challengeAmount){
              return [2,1] 
            }
            return [1,0] 
        }
    } else if (challengeKey === 'challenge5'){
        if (updatedChallengeProgress[4] >= challengeAmount) {
          return [0,0]
        } else {
            if ((updatedChallengeProgress[4]+1) === challengeAmount){
              return [2,1] 
            }
            return [1,0] 
        }
    }

    return [0,0]
}
  

  function convertUnits(value: number, fromUnit: string, toUnit: string): number {
    if (fromUnit === toUnit) {
      return value;
    }

    if (fromUnit === "g" && toUnit === "mg") {
      return value * 1000;
    } else if (fromUnit === "mg" && toUnit === "g") {
      return value / 1000; 
    }
  
    console.warn(`Unit conversion from ${fromUnit} to ${toUnit} is not implemented.`);
    return value; 
  }

  function convertToChallengeUnit(unit: string): string {
    if (unit === "g") {
      return "G"; 
    } else if (unit === "mg") {
      return "M";
    }
    return unit;
  }
  

  export async function analyzeChallenge(
    nutrientName: string,
    challenge: string,
    challengeKey: string,
    updatedChallengeProgress: number[],
    challengeAmount: number,
    nutrients: { [key: string]: number },
    units: { [key: string]: string } 
  ): Promise<[number, number]> {

    console.log('working 1')
    console.log(challenge)
    console.log(challengeKey)
    console.log(nutrients)
    console.log(nutrientName)
    console.log(challengeAmount)
    console.log('working 2')
    const [condition, quantityString, unit] = challenge.split("#");
    const quantity = parseFloat(quantityString);
    
    if (!(nutrientName in nutrients)) {
      console.warn(`Nutrient ${nutrientName} not found in nutrients list.`);
      return [0,0];
    }
  
    const nutrientValue = nutrients[nutrientName];
    const nutrientUnit = units[nutrientName] || "g"; 
    const convertedUnit = convertToChallengeUnit(nutrientUnit);
    
    const targetValue = convertUnits(nutrientValue, convertedUnit, unit);
  
    let challengeSatisfied = false;
    if (condition === "L") {
      challengeSatisfied = targetValue < quantity; 
    } else if (condition === "A") {
      challengeSatisfied = targetValue > quantity;
    }
  
    if (challengeSatisfied) {
      return await handleChallengeSuccess(challengeKey, challengeAmount, updatedChallengeProgress);
    } else {
      return [0,0]
    }
  }