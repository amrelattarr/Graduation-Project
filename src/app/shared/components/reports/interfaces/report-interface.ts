export enum FoodType {
    CookedMeal = 'CookedMeal',
    Perishable = 'Perishable',
    BakedGoods = 'BakedGoods',
    NonPerishable = 'NonPerishable',
    Beverage = 'Beverage',
    Frozen = 'Frozen'
  }
  
  export enum UnitType {
    Kilos = 'Kilos',
    Meals = 'Meals'
  }
  
  export interface FoodTypeStats {
    foodType: FoodType;
    donationCount: number;
    totalQuantity: number;
    averageShelfLifeRemainingHours: number;
    expiredCount: number;
  }
  
  export interface UnitGroup {
    unitType: UnitType;
    totalDonations: number;
    totalQuantity: number;
    byFoodType: FoodTypeStats[];
  }
  
  /** ⭐ MAIN RESPONSE */
  export interface DonationReport {
    from: string | null;
    to: string | null;
    charityId: number | null;
  
    appliedUnitTypeFilter: UnitType | null;
    appliedFoodTypeFilter: FoodType | null;
  
    generatedAt: string;
  
    grandTotalDonations: number;
    grandTotalQuantity: number;
  
    groups: UnitGroup[];
  }