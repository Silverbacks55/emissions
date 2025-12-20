// Auto-generated emission factors
// Generated: 2025-12-11T23:30:54.043Z
// DO NOT EDIT MANUALLY - regenerate using processFactors.js

const EMISSION_FACTORS = {
  "industries": [
    {
      "id": "tech_software",
      "name": "Technology & Software",
      "revenueIntensity": 84.3,
      "naicsCount": 6,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "financial_services",
      "name": "Financial Services & Insurance",
      "revenueIntensity": 78,
      "naicsCount": 41,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "professional_services",
      "name": "Professional Services",
      "revenueIntensity": 90.5,
      "naicsCount": 45,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "healthcare",
      "name": "Healthcare & Life Sciences",
      "revenueIntensity": 118.5,
      "naicsCount": 30,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "retail",
      "name": "Retail & E-commerce",
      "revenueIntensity": 123.7,
      "naicsCount": 66,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "food_beverage",
      "name": "Food & Beverage Production",
      "revenueIntensity": 486.3,
      "naicsCount": 49,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "hospitality",
      "name": "Restaurant & Hospitality",
      "revenueIntensity": 150.4,
      "naicsCount": 15,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "manufacturing_electronics",
      "name": "Manufacturing - Electronics",
      "revenueIntensity": 95.8,
      "naicsCount": 24,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "manufacturing_machinery",
      "name": "Manufacturing - Machinery",
      "revenueIntensity": 204.8,
      "naicsCount": 39,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "manufacturing_consumer",
      "name": "Manufacturing - Consumer Goods",
      "revenueIntensity": 186.3,
      "naicsCount": 39,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "construction",
      "name": "Construction & Real Estate",
      "revenueIntensity": 226.2,
      "naicsCount": 31,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "transportation",
      "name": "Transportation & Logistics",
      "revenueIntensity": 518.7,
      "naicsCount": 57,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "energy_utilities",
      "name": "Energy & Utilities",
      "revenueIntensity": 566.5,
      "naicsCount": 4,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "telecommunications",
      "name": "Telecommunications",
      "revenueIntensity": 81,
      "naicsCount": 5,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "education",
      "name": "Education",
      "revenueIntensity": 116.4,
      "naicsCount": 17,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "agriculture",
      "name": "Agriculture",
      "revenueIntensity": 726.6,
      "naicsCount": 64,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "pharmaceuticals",
      "name": "Pharmaceuticals",
      "revenueIntensity": 155.3,
      "naicsCount": 4,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "automotive",
      "name": "Automotive",
      "revenueIntensity": 259.1,
      "naicsCount": 15,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "aerospace",
      "name": "Aerospace & Defense",
      "revenueIntensity": 199.2,
      "naicsCount": 6,
      "source": "EPA EEIO v1.3 (2022 data)"
    },
    {
      "id": "media",
      "name": "Media & Entertainment",
      "revenueIntensity": 58.5,
      "naicsCount": 14,
      "source": "EPA EEIO v1.3 (2022 data)"
    }
  ],
"gridFactors": {
    "US": {
      "locationBased": 0.386,
      "upstream": 0.077,
      "tdLoss": 0.06,
      "source": "EPA eGRID 2023",
      "year": 2023
    },
    "CA": {
      "locationBased": 0.12,
      "upstream": 0.024,
      "tdLoss": 0.08,
      "source": "Environment Canada 2023",
      "year": 2023
    },
    "MX": {
      "locationBased": 0.46,
      "upstream": 0.092,
      "tdLoss": 0.12,
      "source": "IEA 2023",
      "year": 2023
    },
    "BR": {
      "locationBased": 0.08,
      "upstream": 0.016,
      "tdLoss": 0.15,
      "source": "IEA 2023 (hydro-dominant)",
      "year": 2023
    },
    "AR": {
      "locationBased": 0.35,
      "upstream": 0.07,
      "tdLoss": 0.13,
      "source": "IEA 2023",
      "year": 2023
    },
    "GB": {
      "locationBased": 0.233,
      "upstream": 0.047,
      "tdLoss": 0.08,
      "source": "UK BEIS 2023",
      "year": 2023
    },
    "DE": {
      "locationBased": 0.42,
      "upstream": 0.084,
      "tdLoss": 0.06,
      "source": "German EPA 2023",
      "year": 2023
    },
    "FR": {
      "locationBased": 0.052,
      "upstream": 0.01,
      "tdLoss": 0.06,
      "source": "IEA 2023 (nuclear-dominant)",
      "year": 2023
    },
    "IT": {
      "locationBased": 0.28,
      "upstream": 0.056,
      "tdLoss": 0.06,
      "source": "IEA 2023",
      "year": 2023
    },
    "ES": {
      "locationBased": 0.21,
      "upstream": 0.042,
      "tdLoss": 0.08,
      "source": "IEA 2023",
      "year": 2023
    },
    "RU": {
      "locationBased": 0.45,
      "upstream": 0.09,
      "tdLoss": 0.10,
      "source": "IEA 2023",
      "year": 2023
    },
    "TR": {
      "locationBased": 0.48,
      "upstream": 0.096,
      "tdLoss": 0.14,
      "source": "IEA 2023",
      "year": 2023
    },
    "SA": {
      "locationBased": 0.62,
      "upstream": 0.124,
      "tdLoss": 0.08,
      "source": "IEA 2023 (oil/gas)",
      "year": 2023
    },
    "CN": {
      "locationBased": 0.555,
      "upstream": 0.111,
      "tdLoss": 0.06,
      "source": "IEA 2023 (coal-heavy)",
      "year": 2023
    },
    "IN": {
      "locationBased": 0.82,
      "upstream": 0.164,
      "tdLoss": 0.08,
      "source": "IEA 2023 (coal-dominant)",
      "year": 2023
    },
    "JP": {
      "locationBased": 0.463,
      "upstream": 0.093,
      "tdLoss": 0.05,
      "source": "IEA 2023",
      "year": 2023
    },
    "KR": {
      "locationBased": 0.436,
      "upstream": 0.087,
      "tdLoss": 0.04,
      "source": "IEA 2023 (South Korea)",
      "year": 2023
    },
    "ID": {
      "locationBased": 0.71,
      "upstream": 0.142,
      "tdLoss": 0.10,
      "source": "IEA 2023 (coal-heavy)",
      "year": 2023
    },
    "AU": {
      "locationBased": 0.71,
      "upstream": 0.142,
      "tdLoss": 0.06,
      "source": "IEA 2023 (coal-heavy)",
      "year": 2023
    },
    "ZA": {
      "locationBased": 0.95,
      "upstream": 0.19,
      "tdLoss": 0.08,
      "source": "IEA 2023 (coal-dominant)",
      "year": 2023
    }
  },
  "fuels": {
    "natural_gas": {
      "combustion": 0.0053,
      "combustionPerTherm": 5.3,
      "upstream": 0.0011,
      "source": "EPA 2025"
    },
    "gasoline": {
      "combustion": 8.89,
      "upstream": 1.78,
      "source": "EPA 2025"
    },
    "diesel": {
      "combustion": 10.21,
      "upstream": 2.04,
      "source": "EPA 2025"
    },
    "heating_oil": {
      "combustion": 10.15,
      "upstream": 2.03,
      "source": "EPA 2025"
    },
    "propane": {
      "combustion": 5.74,
      "upstream": 1.15,
      "source": "EPA 2025"
    }
  },
  "buildingIntensity": {
    "North America": {
      "office": 15.5,
      "warehouse": 8.2,
      "retail": 18.1,
      "manufacturing_light": 25,
      "manufacturing_heavy": 45,
      "data_center": 250
    }
  },
  "transport": {
    "truck": 0.162,
    "rail": 0.022,
    "air": 0.602,
    "sea": 0.011,
    "parcel_local": 0.5,
    "parcel_regional": 1.2,
    "parcel_national": 3.5,
    "parcel_international": 10,
    "source": "DEFRA 2023"
  },
  "spendBased": {
    "raw_materials_general": 0.45,
    "professional_services": 0.12,
    "capital_equipment": 0.5,
    "goods_for_resale_general": 0.35,
    "upstream_transport_domestic": 0.1,
    "upstream_transport_international": 0.2,
    "source": "EPA EEIO 2023"
  },
  "operational": {
    "employee": {
      "commute": 2,
      "waste": 0.5
    },
    "vehicle": {
      "gasoline_annual": 4.6,
      "diesel_annual": 5.2,
      "electric_annual": 1.2,
      "hybrid_annual": 2.5
    },
    "businessTravel": 0.00015
  },
  "useOfProducts": {
    "electric_devices": {
      "high": 200,
      "medium": 50,
      "low": 10
    },
    "fuel_consuming": {
      "vehicles": 4600,
      "generators": 1200,
      "equipment": 800
    },
    "indirect_use": {
      "washing": 5,
      "cooking": 15
    }
  },
  "endOfLife": {
    "landfill": 0.5,
    "incineration": 0.3,
    "recycling": 0.1
  },
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-12-11",
    "sources": [
      "EPA EEIO v1.3 (2022 data)",
      "EPA GHG Emission Factors Hub (2025)",
      "EPA eGRID 2023"
    ]
  }
};

// Helper function for industry names
function getIndustryName(id) {
  const names = {
    tech_software: 'Technology & Software',
    financial_services: 'Financial Services & Insurance',
    professional_services: 'Professional Services',
    healthcare: 'Healthcare & Life Sciences',
    retail: 'Retail & E-commerce',
    food_beverage: 'Food & Beverage Production',
    hospitality: 'Restaurant & Hospitality',
    manufacturing_electronics: 'Manufacturing - Electronics',
    manufacturing_machinery: 'Manufacturing - Machinery',
    manufacturing_consumer: 'Manufacturing - Consumer Goods',
    construction: 'Construction & Real Estate',
    transportation: 'Transportation & Logistics',
    energy_utilities: 'Energy & Utilities',
    telecommunications: 'Telecommunications',
    education: 'Education',
    agriculture: 'Agriculture',
    pharmaceuticals: 'Pharmaceuticals',
    automotive: 'Automotive',
    aerospace: 'Aerospace & Defense',
    media: 'Media & Entertainment'
  };
  return names[id] || id;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EMISSION_FACTORS };
}
