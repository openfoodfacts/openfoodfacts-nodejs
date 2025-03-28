import { NutritionValidator } from "../src/nutrition";

describe("NutritionValidator", () => {
  let validator: NutritionValidator;

  beforeEach(() => {
    validator = new NutritionValidator();
  });

  describe("validate", () => {
    it("should return valid result when all nutrition data is valid", () => {
      const nutriments = {
        "energy-kcal": 240,
        "energy-kj": 1004,
        energy: 1004,
        fat: 10,
        "saturated-fat": 5,
        carbohydrates: 30,
        sugars: 15,
        proteins: 5,
        salt: 1.25,
        sodium: 0.5,
      };

      const result = validator.validate(nutriments, "100g");

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it("should detect inconsistent energy values", () => {
      const nutriments = {
        "energy-kcal": 240,
        "energy-kj": 1200,
      };

      const result = validator.validate(nutriments);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe("energy_inconsistency");
      expect(result.warnings[0].severity).toBe("medium");
    });

    it("should detect energy values exceeding limits", () => {
      const nutriments = {
        "energy-kj": 4000, // exceeds 3800 kJ limit
      };

      const result = validator.validate(nutriments);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe("energy_range");
    });

    it("should detect nutrient values exceeding 100g per 100g", () => {
      const nutriments = {
        fat: 120, // exceeds 100g per 100g
      };

      const result = validator.validate(nutriments, "100g");

      expect(result.isValid).toBe(false);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe("nutrient_range");
      expect(result.warnings[0].severity).toBe("high");
    });

    it("should not check nutrient ranges for per-serving data", () => {
      const nutriments = {
        fat: 120,
      };

      const result = validator.validate(nutriments, "serving");

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it("should detect saturated fat exceeding total fat", () => {
      const nutriments = {
        fat: 10,
        "saturated-fat": 15, // exceeds total fat
      };

      const result = validator.validate(nutriments);

      expect(result.isValid).toBe(false); // High severity warning
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe("fat_consistency");
      expect(result.warnings[0].severity).toBe("high");
    });

    it("should detect sugars exceeding total carbohydrates", () => {
      const nutriments = {
        carbohydrates: 20,
        sugars: 25, // exceeds total carbohydrates
      };

      const result = validator.validate(nutriments);

      expect(result.isValid).toBe(false);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe("carbohydrates_consistency");
      expect(result.warnings[0].severity).toBe("high");
    });

    it("should detect inconsistent salt and sodium values", () => {
      const nutriments = {
        salt: 2,
        sodium: 0.5, // should be 2/2.5 = 0.8
      };

      const result = validator.validate(nutriments);

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].type).toBe("salt_sodium_consistency");
      expect(result.warnings[0].severity).toBe("medium");
    });

    it("should report multiple warnings when multiple issues exist", () => {
      const nutriments = {
        "energy-kcal": 240,
        "energy-kj": 1200,
        fat: 10,
        "saturated-fat": 15, // exceeds total fat
        carbohydrates: 20,
        sugars: 25, // exceeds carbohydrates
      };

      const result = validator.validate(nutriments);

      expect(result.isValid).toBe(false);
      expect(result.warnings).toHaveLength(3);
    });
  });

  describe("computeSaltSodium", () => {
    it("should compute sodium from salt when sodium is missing", () => {
      const nutriments = {
        salt: 2.5,
        // sodium is missing
      };

      const result = validator.computeSaltSodium(nutriments);

      expect(result.sodium).toBe(1);
      expect(result.salt).toBe(2.5);
    });

    it("should compute salt from sodium when salt is missing", () => {
      const nutriments = {
        sodium: 0.4,
      };

      const result = validator.computeSaltSodium(nutriments);

      expect(result.salt).toBe(1); // 0.4 * 2.5
      expect(result.sodium).toBe(0.4);
    });

    it("should not modify values when both salt and sodium are present", () => {
      const nutriments = {
        salt: 2.5,
        sodium: 1,
      };

      const result = validator.computeSaltSodium(nutriments);

      expect(result.salt).toBe(2.5);
      expect(result.sodium).toBe(1); // unchanged
    });

    it("should not modify other nutrients", () => {
      const nutriments = {
        salt: 2.5,
        fat: 10,
        carbohydrates: 20,
      };

      const result = validator.computeSaltSodium(nutriments);

      expect(result.sodium).toBe(1);
      expect(result.salt).toBe(2.5);
      expect(result.fat).toBe(10);
      expect(result.carbohydrates).toBe(20);
    });
  });
});
