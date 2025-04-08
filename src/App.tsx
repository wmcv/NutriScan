import { Divider, Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import MenuFrame from "./components/MenuFrame";
import CameraFeed from "./components/CameraFeed";
import { fetchProduct } from "./utils/fetchProduct";
import ProductInfo from "./components/ProductInfo";
import { analyzeProduct } from "./utils/analyzeProduct";
import { getUserPreferences } from "./utils/getUserPreferences";
import AIInfo from "./components/AIInfo";
import WeekChallenges from "./components/WeekChallenges";
import { supabase } from "./supabaseClient";
import { Challenge } from "./types";
import { analyzeChallenge } from "./utils/analyzeChallenge";

function App() {
  const [weeklyChallenges, setWeeklyChallenges] = useState<Challenge[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [barcode, setBarcode] = useState("empty");
  const [AIMessage, setAIMessage] = useState("empty");
  const [productName, setProductName] = useState("Product");
  const [servingSize, setServingSize] = useState("Serving Size");
  const [productIngredients, setProductIngredients] = useState("Ingredients");
  const [ecoscoreGrade, setEcoscoreGrade] = useState("NaN");
  const [foodGroups, setFoodGroups] = useState("NaN");
  const [glutenFree, setGlutenFree] = useState(false);
  const [userChallenges, setUserChallenges] = useState<number[]>([]);
  const [userCompleted, setUserCompleted] = useState<number>(0);
  const [productNutrients, setproductNutrients] = useState<{
    energy_kcal: number;
    fat: number;
    saturated_fat: number;
    trans_fat: number;
    cholesterol: number;
    carbohydrates: number;
    sugars: number;
    fiber: number;
    proteins: number;
    potassium: number;
    salt: number;
    sodium: number;
    iron: number;
    calcium: number;
  } | null>(null);

  const [productUnits, setproductUnits] = useState<{
    energy_kcal: string;
    fat: string;
    saturated_fat: string;
    trans_fat: string;
    cholesterol: string;
    carbohydrates: string;
    sugars: string;
    fiber: string;
    proteins: string;
    potassium: string;
    salt: string;
    sodium: string;
    iron: string;
    calcium: string;
  } | null>(null);

  useEffect(() => {
    const loadWeeklyChallenges = async () => {
      const { data, error } = await supabase
        .from("WeeklyChallenges")
        .select("*");
      if (error) {
        console.error("Error fetching weekly challenges:", error);
      } else {
        setWeeklyChallenges(data);
      }
    };

    const checkAndCreateUserChallenges = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        const userId = user.id;

        const { data, error: checkError } = await supabase
          .from("WeeklyChallengesUsers")
          .select("*")
          .eq("user_id", userId)
          .single();

        console.log(data);
        if (checkError && checkError.code === "PGRST116") {
          const { error: insertError } = await supabase
            .from("WeeklyChallengesUsers")
            .upsert(
              [
                {
                  user_id: userId,
                  challenge1: 0,
                  challenge2: 0,
                  challenge3: 0,
                  challenge4: 0,
                  challenge5: 0,
                  completed: 0,
                },
              ],
              { onConflict: "user_id" }
            );

          if (insertError) {
            console.error("Error creating new row for user:", insertError);
          } else {
            console.log("New row created for user:", userId);
          }
        } else if (checkError) {
          console.error("Error checking for existing user row:", checkError);
        } else {
          console.log("User already has a row in WeeklyChallengesUsers");
        }
      }
    };

    loadWeeklyChallenges();
    checkAndCreateUserChallenges();
  }, []);

  useEffect(() => {
    const getInfo = async () => {
      if (barcode && barcode !== "empty") {
        const product = await fetchProduct(barcode);
        const product_name =
          product.product_name_en || product.product_name || "NaN";
        setProductName(product_name || "NaN");
        const ingredients = product.ingredients_text || "NaN";
        setProductIngredients(ingredients);
        const servingsize = product.serving_size || "NaN";
        setServingSize(servingsize);

        const ecoscoregrade = product.ecoscore_grade || "NaN";
        setEcoscoreGrade(ecoscoregrade);
        const foodgroups = product.food_groups || "NaN";
        setFoodGroups(foodgroups);

        const nutriments = product.nutriments || {};
        const nutrients = {
          energy_kcal: nutriments["energy-kcal"] || 0,
          fat: nutriments.fat || 0,
          saturated_fat: nutriments["saturated-fat"] || 0,
          trans_fat: nutriments["trans-fat"] || 0,
          cholesterol: nutriments.cholesterol || 0,
          carbohydrates: nutriments.carbohydrates || 0,
          sugars: nutriments.sugars || 0,
          fiber: nutriments.fiber || 0,
          proteins: nutriments.proteins || 0,
          potassium:
            nutriments["potassium_100g"] ||
            nutriments["potassium_serving"] ||
            nutriments["potassium"] ||
            0,
          salt: nutriments.salt || 0,
          sodium: nutriments.sodium || 0,
          iron: nutriments.iron || 0,
          calcium: nutriments.calcium || 0,
        };

        const units = {
          energy_kcal: "kcal",
          fat: nutriments["fat_unit"] || "g",
          saturated_fat: nutriments["saturated-fat_unit"] || "g",
          trans_fat: nutriments["trans-fat_unit"] || "g",
          cholesterol: nutriments["cholesterol_unit"] || "g",
          carbohydrates: nutriments["carbohydrates_unit"] || "g",
          sugars: nutriments["sugars_unit"] || "g",
          fiber: nutriments["fiber_unit"] || "g",
          proteins: nutriments["proteins_unit"] || "g",
          potassium: nutriments["potassium_unit"] || "g",
          salt: nutriments["salt_unit"] || "g",
          sodium: nutriments["sodium_unit"] || "g",
          iron: nutriments["iron_unit"] || "g",
          calcium: nutriments["calcium_unit"] || "g",
        };
        setproductUnits(units);
        setproductNutrients(nutrients);

        const isGlutenFree =
          product.labels_tags?.includes("en:no-gluten") ||
          product.ingredients_analysis_tags?.includes("en:gluten-free") ||
          product.labels?.toLowerCase().includes("gluten-free") ||
          false;
        setGlutenFree(isGlutenFree);
        console.log(glutenFree);

        const fetchUserData = async () => {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (user && !error) {
            const userId = user.id;

            const {
              data: weeklyChallengesUsers,
              error: weeklyChallengesError,
            } = await supabase
              .from("WeeklyChallengesUsers")
              .select(
                "challenge1, challenge2, challenge3, challenge4, challenge5, completed"
              )
              .eq("user_id", userId);

            if (weeklyChallengesError) {
              console.error(weeklyChallengesError);
              return;
            }

            if (weeklyChallengesUsers?.length) {
              const userChallengesTemp = [
                weeklyChallengesUsers[0].challenge1,
                weeklyChallengesUsers[0].challenge2,
                weeklyChallengesUsers[0].challenge3,
                weeklyChallengesUsers[0].challenge4,
                weeklyChallengesUsers[0].challenge5,
              ];

              const completedStatus = weeklyChallengesUsers[0].completed;

              setUserChallenges(userChallengesTemp);
              setUserCompleted(completedStatus);
            }
          }
        };

        fetchUserData();
        console.log("check");
        console.log(userChallenges);
        console.log(userCompleted);
        console.log("check");
        const challengeList: { [key: number]: string } = {
          "0": "challenge1",
          "1": "challenge2",
          "2": "challenge3",
          "3": "challenge4",
          "4": "challenge5",
        };

        weeklyChallenges.map((challenge, index) => {
          const [challenge_amount] = challenge.name.split("#");
          const challengeAmount = parseFloat(challenge_amount);

          analyzeChallenge(
            challenge.criteria,
            challenge.value,
            challengeList[index],
            challengeAmount,
            userChallenges,
            userCompleted,
            setUserChallenges,
            setUserCompleted,
            nutrients,
            units
          );
        });

        //analyzeChallenge(
        // nutrientName:
        //challenge: string,
        //challengeKey: string,
        //challengeAmount: number,
        //challengeProgress: number[],
        //challengeComplete: number,
        //setUserChallenges,
        //nutrients,
        //units
        //)

        const preferences = await getUserPreferences();
        //console.log(preferences);
        if (preferences) {
          const aiMsg = await analyzeProduct(
            product_name,
            ingredients,
            ecoscoreGrade,
            foodGroups,
            nutrients || {},
            preferences
          );
          setAIMessage(aiMsg);
        }
      }
    };

    getInfo();
  }, [barcode]);
  return (
    <Grid
      templateAreas={`"nav" "cam" "divider1" "AI" "divider2" "info" "temp"`}
    >
      <GridItem area="nav">
        <NavBar toggleSettings={setSettingsOpen} settingsOpen={settingsOpen} />
        {settingsOpen && <MenuFrame setMenuOpen={setSettingsOpen} />}
      </GridItem>
      <GridItem area="cam">
        <CameraFeed updateBarcode={setBarcode} />
      </GridItem>
      <GridItem area="divider1">
        <Divider borderColor="gray.300" my={2} />
      </GridItem>
      <GridItem area="AI">
        <AIInfo aiResponse={AIMessage} />
      </GridItem>
      <GridItem area="divider2">
        <Divider borderColor="gray.300" my={2} />
      </GridItem>
      <GridItem area="info">
        <ProductInfo
          productName={productName}
          servingSize={servingSize}
          productIngredients={productIngredients}
          productNutrients={productNutrients || {}}
          productUnits={productUnits || {}}
        />
      </GridItem>
      <GridItem area="temp">
        {userCompleted}
        <WeekChallenges
          userChallenge={userChallenges}
          challenges={weeklyChallenges}
        ></WeekChallenges>
      </GridItem>
    </Grid>
  );
}

export default App;
