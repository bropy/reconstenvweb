interface DamageZone {
    damage: number;
    points: Array<{lat: number, lng: number}>;
  }
  
  interface InfrastructureItem {
    name: string;
    lat: number;
    lon: number;
    type: string;
    id: number;
    damage: number;
  }
  
  interface CategoryData {
    count: number;
    items: InfrastructureItem[];
  }
  
  interface CityInfrastructureData {
    city: string;
    boundary: {
      id: number;
      tags: Record<string, string>;
    };
    results: Record<string, CategoryData>;
  }