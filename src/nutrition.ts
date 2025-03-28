/**
 * Nutrition validator for Open Food Facts
 * Implements various checks for nutrition data coherence and validity
 */

// Types for nutrition validation results
export type NutritionWarning = {
  message: string;
  severity: 'low' | 'medium' | 'high';
  type: string;
  details?: Record<string, any>;
};

export type NutritionValidationResult = {
  warnings: NutritionWarning[];
  isValid: boolean;
};

export class NutritionValidator {
  /**
   * Validates nutrition data and returns warnings for potential issues
   * 
   * @param nutriments The nutriments object from the product data
   * @param nutrition_data_per Whether the nutrition data is per 100g or per serving
   * @returns Validation result with warnings
   */
  validate(
    nutriments: Record<string, any>,
    nutrition_data_per?: 'serving' | '100g'
  ): NutritionValidationResult {
    const warnings: NutritionWarning[] = [];
    
    // Run all validation checks
    this.validateEnergyConsistency(nutriments, warnings);
    this.validateEnergyRange(nutriments, warnings);
    this.validateNutrientRanges(nutriments, warnings, nutrition_data_per);
    this.validateFatConsistency(nutriments, warnings);
    this.validateCarbohydratesConsistency(nutriments, warnings);
    this.validateSaltSodiumConsistency(nutriments, warnings);
    
    // A product is considered valid if there are no high severity warnings
    const hasHighSeverityWarnings = warnings.some(w => w.severity === 'high');
    
    return {
      warnings,
      isValid: !hasHighSeverityWarnings
    };
  }
  
  /**
   * Validates that kJ and kCal values are consistent with each other
   * The relation should be approximately: 1 kcal = 4.184 kJ
   */
  private validateEnergyConsistency(nutriments: Record<string, any>, warnings: NutritionWarning[]): void {
    const energyKcal = nutriments['energy-kcal'];
    const energyKj = nutriments['energy-kj'];
    
    if (energyKcal !== undefined && energyKj !== undefined) {
      // Allow for some rounding error (5% tolerance)
      const expectedKj = energyKcal * 4.184;
      const tolerance = expectedKj * 0.05;
      
      if (Math.abs(energyKj - expectedKj) > tolerance) {
        warnings.push({
          message: 'Energy values in kJ and kcal are inconsistent',
          severity: 'medium',
          type: 'energy_inconsistency',
          details: {
            energyKcal,
            energyKj,
            expectedKj
          }
        });
      }
    }
  }
  
  /**
   * Validates that energy doesn't exceed reasonable limits
   * The suggested limit is 3800 kJ per 100g
   */
  private validateEnergyRange(nutriments: Record<string, any>, warnings: NutritionWarning[]): void {
    const energyKj = nutriments['energy-kj'];
    const energy = nutriments['energy']; // Usually the same as energy-kj or converted from energy-kcal
    
    // Check energy-kj first if available
    if (energyKj !== undefined && energyKj > 3800) {
      warnings.push({
        message: 'Energy value exceeds 3800 kJ per 100g',
        severity: 'medium',
        type: 'energy_range',
        details: { energyKj }
      });
    } 
    // If energy-kj is not available, check energy
    else if (energy !== undefined && energy > 3800 && energyKj === undefined) {
      warnings.push({
        message: 'Energy value exceeds 3800 kJ per 100g',
        severity: 'medium',
        type: 'energy_range',
        details: { energy }
      });
    }
  }
  
  /**
   * Validates that nutrient values don't exceed 100g per 100g
   * This checks macronutrients that shouldn't exceed 100g in a 100g serving
   */
  private validateNutrientRanges(
    nutriments: Record<string, any>, 
    warnings: NutritionWarning[],
    nutrition_data_per?: 'serving' | '100g'
  ): void {
    // Only perform this check if the nutrition data is per 100g
    if (nutrition_data_per !== undefined && nutrition_data_per !== '100g') {
      return;
    }
    
    const nutrientsToCheck = [
      'fat', 
      'carbohydrates',
      'proteins',
      'fiber',
      'salt'
    ];
    
    for (const nutrient of nutrientsToCheck) {
      const value = nutriments[nutrient];
      if (value !== undefined && value > 100) {
        warnings.push({
          message: `${nutrient} value exceeds 100g per 100g`,
          severity: 'high',
          type: 'nutrient_range',
          details: { nutrient, value }
        });
      }
    }
  }
  
  /**
   * Validates that saturated fat doesn't exceed total fat
   */
  private validateFatConsistency(nutriments: Record<string, any>, warnings: NutritionWarning[]): void {
    const fat = nutriments['fat'];
    const saturatedFat = nutriments['saturated-fat'];
    
    if (fat !== undefined && saturatedFat !== undefined && saturatedFat > fat) {
      warnings.push({
        message: 'Saturated fat exceeds total fat',
        severity: 'high',
        type: 'fat_consistency',
        details: { fat, saturatedFat }
      });
    }
  }
  
  /**
   * Validates that sugars doesn't exceed total carbohydrates
   */
  private validateCarbohydratesConsistency(nutriments: Record<string, any>, warnings: NutritionWarning[]): void {
    const carbohydrates = nutriments['carbohydrates'];
    const sugars = nutriments['sugars'];
    
    if (carbohydrates !== undefined && sugars !== undefined && sugars > carbohydrates) {
      warnings.push({
        message: 'Sugars exceed total carbohydrates',
        severity: 'high',
        type: 'carbohydrates_consistency',
        details: { carbohydrates, sugars }
      });
    }
  }
  
  /**
   * Validates consistency between sodium and salt values
   * The relation should be: salt = sodium * 2.5
   */
  private validateSaltSodiumConsistency(nutriments: Record<string, any>, warnings: NutritionWarning[]): void {
    const salt = nutriments['salt'];
    const sodium = nutriments['sodium'];
    
    if (salt !== undefined && sodium !== undefined) {
      // Allow for some rounding error (5% tolerance)
      const expectedSalt = sodium * 2.5;
      const tolerance = expectedSalt * 0.05;
      
      if (Math.abs(salt - expectedSalt) > tolerance) {
        warnings.push({
          message: 'Salt and sodium values are inconsistent',
          severity: 'medium',
          type: 'salt_sodium_consistency',
          details: {
            salt,
            sodium,
            expectedSalt
          }
        });
      }
    }
  }
  
  /**
   * Computes sodium from salt or salt from sodium if one is missing
   * 
   * @param nutriments The nutriments object to update
   * @returns Updated nutriments object with computed values
   */
  computeSaltSodium(nutriments: Record<string, any>): Record<string, any> {
    const result = { ...nutriments };
    
    const salt = result['salt'];
    const sodium = result['sodium'];
    
    if (salt !== undefined && sodium === undefined) {
      // Compute sodium from salt
      result['sodium'] = salt / 2.5;
    } else if (sodium !== undefined && salt === undefined) {
      // Compute salt from sodium
      result['salt'] = sodium * 2.5;
    }
    
    return result;
  }
}

export default NutritionValidator; 