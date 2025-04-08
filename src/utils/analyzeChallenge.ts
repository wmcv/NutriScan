import { supabase } from "../supabaseClient";

async function handleChallengeSuccess(challengeKey: string, challengeAmount: number) {
    console.log(`Success for ${challengeKey} with out of ${challengeAmount}`);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (!user || error) return;
  
    const userId = user.id;
  
    // ✅ 1. Fetch latest challenge progress from DB
    const { data, error: fetchError } = await supabase
      .from("WeeklyChallengesUsers")
      .select("challenge1, challenge2, challenge3, challenge4, challenge5, completed")
      .eq("user_id", userId)
      .single();
  
    if (fetchError || !data) {
      console.error("Failed to fetch challenge progress", fetchError);
      return;
    }
  
    const updatedChallengeProgress = [
      data.challenge1 || 0,
      data.challenge2 || 0,
      data.challenge3 || 0,
      data.challenge4 || 0,
      data.challenge5 || 0,
      data.completed || 0,
    ];

    console.log('you see')
    console.log(updatedChallengeProgress)
    console.log('you see2')

    if (challengeKey === 'challenge1'){
        if (updatedChallengeProgress[0] > challengeAmount) {
        } else {
            updatedChallengeProgress[0] += 1;
            if (updatedChallengeProgress[0] === challengeAmount){
                updatedChallengeProgress[5] += 1;
                updatedChallengeProgress[0] += 1;
            }   
        }
    } else if (challengeKey === 'challenge2'){
        if (updatedChallengeProgress[1] > challengeAmount) {
        } else {
            updatedChallengeProgress[1] += 1;
            if (updatedChallengeProgress[1] === challengeAmount){
                updatedChallengeProgress[5] += 1;
                updatedChallengeProgress[1] += 1;
            }   
        }
    } else if (challengeKey === 'challenge3'){
        if (updatedChallengeProgress[2] > challengeAmount) {
        } else {
            updatedChallengeProgress[2] += 1;
            if (updatedChallengeProgress[2] === challengeAmount){
                updatedChallengeProgress[5] += 1;
                updatedChallengeProgress[2] += 1;
            }   
        }
    } else if (challengeKey === 'challenge4'){
        if (updatedChallengeProgress[3] > challengeAmount) {
        } else {
            updatedChallengeProgress[3] += 1;
            if (updatedChallengeProgress[3] === challengeAmount){
                updatedChallengeProgress[5] += 1;
                updatedChallengeProgress[3] += 1;
            }   
        }
    } else if (challengeKey === 'challenge5'){
        if (updatedChallengeProgress[4] > challengeAmount) {
        } else {
            updatedChallengeProgress[4] += 1;
            if (updatedChallengeProgress[4] === challengeAmount){
                updatedChallengeProgress[5] += 1;
                updatedChallengeProgress[4] += 1;
            }   
        }
    }


    const updateDatabase = async () => {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!user || error) return;

        const userId = user.id;
        console.log(updatedChallengeProgress)        
        await supabase.from("WeeklyChallengesUsers").upsert(
            [
              {
                user_id: userId,
                [challengeKey]: updatedChallengeProgress[0] || 0,
                challenge2: updatedChallengeProgress[1] || 0,
                challenge3: updatedChallengeProgress[2] || 0,
                challenge4: updatedChallengeProgress[3] || 0,
                challenge5: updatedChallengeProgress[4] || 0,
                completed: updatedChallengeProgress[5] || 0
              },
            ],
            { onConflict: "user_id" }
          );
  }

  updateDatabase()
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
  

  export function analyzeChallenge(
    nutrientName: string,
    challenge: string,
    challengeKey: string,
    challengeAmount: number,
    nutrients: { [key: string]: number },
    units: { [key: string]: string } 
  ) {

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
      return;
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
      handleChallengeSuccess(challengeKey, challengeAmount);
    } else {
      //console.log(`Challenge for ${nutrientName} not satisfied. Current value: ${targetValue}`);
    }
  }