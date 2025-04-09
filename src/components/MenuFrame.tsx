import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, IconButton, Text, Divider } from "@chakra-ui/react";
import TableSelectionBtn from "./TableSelectionBtn";
import { useState, useEffect } from "react";
import DietOptionsTable from "./DietOptionsTable";
import DietCustomTable from "./DietCustomTable";
import DietLimitTable from "./DietLimitTable";
import { NutrientLimit, Option } from "@/types";
import { supabase } from "../supabaseClient";

const effectMap: { [key: number]: "Ignore" | "Below" | "Above" } = {
  0: "Ignore",
  1: "Below",
  2: "Above",
};

interface NavBarProps {
  setMenuOpen: (isOpen: boolean) => void;
}

const MenuFrame: React.FC<NavBarProps> = ({ setMenuOpen }) => {
  const [isA, setA] = useState(true);
  const [isB, setB] = useState(false);
  const [isC, setC] = useState(false);

  const options = [
    { name: "None", details: [] },
    {
      name: "Keto Diet",
      details: ["Low carb", "High fat", "Moderate protein"],
    },
    {
      name: "Vegan",
      details: ["No animal products", "Plant-based", "High fiber"],
    },
    {
      name: "Paleo",
      details: ["Whole foods", "No processed sugar", "Grass-fed meats"],
    },
    {
      name: "Mediterranean",
      details: ["Olive oil", "Lean meats", "Lots of veggies"],
    },
    { name: "Carnivore", details: ["Only meat", "No plants", "High protein"] },
  ];

  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [limits, setLimits] = useState<NutrientLimit[]>([
    { name: "Calories", effect: "Ignore", limit: 0, unit: "kcal" },
    { name: "Total Fat", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Saturated Fat", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Trans Fat", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Cholesterol", effect: "Ignore", limit: 0, unit: "mg" },
    { name: "Carbohydrates", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Sugars", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Fiber", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Protein", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Salt", effect: "Ignore", limit: 0, unit: "g" },
    { name: "Sodium", effect: "Ignore", limit: 0, unit: "mg" },
    { name: "Iron", effect: "Ignore", limit: 0, unit: "mg" },
    { name: "Calcium", effect: "Ignore", limit: 0, unit: "mg" },
  ]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user && !error) {
        const userId = user.id;

        const { data: dietOptions } = await supabase
          .from("DietOptions")
          .select("*")
          .eq("user_id", userId);
        if (dietOptions?.length) {
          setSelectedOption({
            name: dietOptions[0].diet_name,
            details: dietOptions[0].details,
          });
        }

        const { data: customIngredients } = await supabase
          .from("DietCustomAddons")
          .select("*")
          .eq("user_id", userId);
        if (customIngredients?.length) {
          setIngredients(customIngredients[0].ingredients);
        }

        const { data: nutrientLimits } = await supabase
          .from("DietNutrientLimits")
          .select("*")
          .eq("user_id", userId);
        if (nutrientLimits?.length) {
          setLimits(
            nutrientLimits.map((item) => ({
              name: item.nutrient_name,
              effect: effectMap[item.effect],
              limit: item.limit_value,
              unit: "mg",
            }))
          );
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="rgba(0, 0, 0, 0.6)"
      zIndex="overlay"
    >
      <Box
        w="90%"
        maxW="500px"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        p={5}
        m="auto"
        maxH="90vh"
        overflowY="auto"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Box mr={5} />
          <Text
            fontFamily="Vagabondfed"
            fontSize="lg"
            fontWeight="bold"
            color="gray.700"
          >
            Dietary Preferences
          </Text>
          <IconButton
            icon={<CloseIcon />}
            aria-label="Close menu"
            onClick={async () => {
              const {
                data: { user },
                error,
              } = await supabase.auth.getUser();
              if (!user || error) return;

              const userId = user.id;

              if (selectedOption) {
                await supabase.from("DietOptions").upsert(
                  [
                    {
                      user_id: userId,
                      diet_name: selectedOption.name,
                      details: selectedOption.details,
                    },
                  ],
                  { onConflict: "user_id" }
                );
              }

              await supabase
                .from("DietCustomAddons")
                .upsert([{ user_id: userId, ingredients }], {
                  onConflict: "user_id",
                });

              await supabase.from("DietNutrientLimits").upsert(
                limits.map((item) => ({
                  user_id: userId,
                  nutrient_name: item.name,
                  effect: { Ignore: 0, Below: 1, Above: 2 }[item.effect],
                  limit_value: item.limit,
                })),
                { onConflict: "user_id,nutrient_name" }
              );

              setMenuOpen(false);
            }}
            size="sm"
            colorScheme="red"
          />
        </Flex>

        <Divider />

        <HStack spacing={3} justify="center" my={3}>
          <TableSelectionBtn
            setTrue={setA}
            setFalse1={setB}
            setFalse2={setC}
            label="Diet"
          />
          <TableSelectionBtn
            setTrue={setB}
            setFalse1={setA}
            setFalse2={setC}
            label="Restrict"
          />
          <TableSelectionBtn
            setTrue={setC}
            setFalse1={setB}
            setFalse2={setA}
            label="Limits"
          />
        </HStack>

        <Divider />

        <Box mt={3}>
          {isA && (
            <DietOptionsTable
              options={options}
              selected={selectedOption}
              onSelect={setSelectedOption}
            />
          )}
          {isB && (
            <DietCustomTable
              ingredients={ingredients}
              setIngredients={setIngredients}
            />
          )}
          {isC && <DietLimitTable limits={limits} setLimits={setLimits} />}
        </Box>
      </Box>
    </Flex>
  );
};

export default MenuFrame;
