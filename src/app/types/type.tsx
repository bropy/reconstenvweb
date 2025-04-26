// Типи для зон пошкодження
export interface LatLng {
    lat: number;
    lng: number;
  }
  
  export interface ZoneData {
    id: string;
    points: LatLng[];
    damage: number;
  }
  
  // Типи для об'єктів інфраструктури
  export interface InfrastructureItem {
    name: string;
    lat: number;
    lon: number;
    type: string;
    id: number;
    damage?: number;
  }
  
  export interface CategoryData {
    count: number;
    items: InfrastructureItem[];
  }
  
  export interface InfrastructureResults {
    [key: string]: CategoryData;
  }
  
  export interface AnalysisResponse {
    city: string;
    boundary: {
      id: number;
      tags: Record<string, string>;
    };
    results: InfrastructureResults;
  }
  
  // Типи для розрахунку вартості відновлення
  export interface ReconstructionCosts {
    [key: string]: {
      build: number;
      reconstruct: number;
    };
  }
  
  export interface DamageAnalysis {
    totalDamage: number;
    damagedFacilities: number;
    approximateReconstructionCost: number;
    approximateReconstructionTime: number;
    facilitiesByDamage: {
      [key: string]: number;
    };
  }