// calculations.js - Core emission calculation engine

function calculateFootprint(formData, emissionFactors) {
  console.log('Starting footprint calculation...');
  
  const results = {
    summary: { total: 0, scope1: 0, scope2: 0, scope3: 0 },
    breakdown: {
      scope1: { facilities: 0, fleet: 0, onSiteCombustion: 0 },
      scope2: { purchasedElectricity: 0 },
      scope3: {
        purchasedGoods: 0, capitalGoods: 0, fuelEnergy: 0,
        upstreamTransport: 0, waste: 0, businessTravel: 0,
        commuting: 0, downstreamTransport: 0, useOfProducts: 0,
        endOfLife: 0, investments: 0
      }
    },
    intensityMetrics: { perEmployee: 0, perRevenue: 0 },
    industryComparison: {},
    confidence: {},
    assumptions: [],
    warnings: [],
    metadata: {
      calculatedAt: new Date().toISOString(),
      calculationVersion: '1.0.0'
    }
  };
  
  const assumptions = [];
  
  // Calculate each scope
  const scope1 = calculateScope1(formData, emissionFactors, assumptions);
  const scope2 = calculateScope2(formData, emissionFactors, assumptions);
  const scope3 = calculateScope3(formData, emissionFactors, assumptions, scope1, scope2);
  
  results.breakdown.scope1 = scope1;
  results.breakdown.scope2 = scope2;
  results.breakdown.scope3 = scope3;
  
  results.summary.scope1 = scope1.facilities + scope1.fleet + scope1.onSiteCombustion;
  results.summary.scope2 = scope2.purchasedElectricity;
  results.summary.scope3 = scope3.purchasedGoods + scope3.capitalGoods + scope3.fuelEnergy + 
                           scope3.upstreamTransport + scope3.waste + scope3.businessTravel + 
                           scope3.commuting + scope3.downstreamTransport + scope3.useOfProducts + 
                           scope3.endOfLife + scope3.investments;
  
  results.summary.total = results.summary.scope1 + results.summary.scope2 + results.summary.scope3;
  
  const revenue = parseFloat(formData.companyBasics.revenue) || 1;
  const employees = parseFloat(formData.companyBasics.employees) || 1;
  
  results.intensityMetrics.perEmployee = results.summary.total / employees;
  results.intensityMetrics.perRevenue = (results.summary.total / revenue) * 1000000;
  
  results.industryComparison = calculateIndustryComparison(formData, emissionFactors, results.summary.total);
  results.confidence = calculateConfidence(formData);
  results.warnings = performSanityChecks(formData, results);
  results.assumptions = assumptions;
  
  console.log('Calculation complete!');
  return results;
}

function calculateScope1(formData, factors, assumptions) {
  const scope1 = { facilities: 0, fleet: 0, onSiteCombustion: 0 };
  
  const totalSqft = Object.values(formData.operations?.squareFootage || {})
    .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  
  if (totalSqft > 0 && formData.operations?.hvac?.heating) {
    const heatingSource = formData.operations.hvac.heatingSource;
    
    if (heatingSource && heatingSource !== 'electric' && heatingSource !== 'dont_know') {
      const region = formData.companyBasics.primaryRegion || 'North America';
      let heatingIntensity = 0.5;
      
      if (region === 'North America' || region === 'Europe') {
        heatingIntensity = 0.8;
      } else if (region === 'South America' || region === 'Africa') {
        heatingIntensity = 0.2;
      }
      
      const therms = totalSqft * heatingIntensity;
      const fuelFactor = factors.fuels[heatingSource];
      
      if (fuelFactor) {
        scope1.facilities = (therms * fuelFactor.combustionPerTherm) / 1000;
        
        assumptions.push({
          category: 'Scope 1 - Facilities Heating',
          assumption: `${totalSqft.toLocaleString()} sqft × ${heatingIntensity} therms/sqft × ${fuelFactor.combustionPerTherm} kg CO2e/therm`,
          source: fuelFactor.source,
          userProvided: true,
          dataPoint: `${totalSqft} sqft, ${heatingSource} heating`
        });
      }
    }
  }
  
  if (formData.operations?.fleet?.hasFleet === 'yes' && formData.operations.fleet.numVehicles) {
    const numVehicles = parseFloat(formData.operations.fleet.numVehicles);
    const electricPercent = parseFloat(formData.operations.fleet.electricPercent) || 0;
    const iceVehicles = numVehicles * (1 - electricPercent / 100);
    
    if (iceVehicles > 0) {
      const annualEmissionPerVehicle = 4.6;
      scope1.fleet = iceVehicles * annualEmissionPerVehicle;
      
      assumptions.push({
        category: 'Scope 1 - Vehicle Fleet',
        assumption: `${iceVehicles.toFixed(1)} ICE vehicles × ${annualEmissionPerVehicle} tCO2e/vehicle/year`,
        source: 'EPA 2023',
        userProvided: true,
        dataPoint: `${iceVehicles.toFixed(0)} ICE vehicles`
      });
    }
  }
  
  return scope1;
}

function calculateScope2(formData, factors, assumptions) {
  const scope2 = { purchasedElectricity: 0 };
  let totalElectricity = 0;
  
  if (formData.operations?.squareFootage) {
    const sqftByType = formData.operations.squareFootage;
    const region = formData.companyBasics.primaryRegion || 'North America';
    const buildingTypes = ['office', 'warehouse', 'retail', 'manufacturing_light', 'manufacturing_heavy'];
    
    for (const buildingType of buildingTypes) {
      const sqft = parseFloat(sqftByType[buildingType]) || 0;
      
      if (sqft > 0) {
        const baseIntensity = factors.buildingIntensity[region]?.[buildingType] || 
                              factors.buildingIntensity['North America'][buildingType];
        
        let intensityMultiplier = 1.0;
        if (formData.operations.hvac) {
          if (formData.operations.hvac.airConditioning) {
            const coolingIntensity = formData.operations.hvac.coolingIntensity || 'moderate';
            if (coolingIntensity === 'high') {
              intensityMultiplier += 0.3;
            } else if (coolingIntensity === 'moderate') {
              intensityMultiplier += 0.15;
            }
          }
          
          if (formData.operations.hvac.heatingSource === 'electric') {
            intensityMultiplier += 0.3;
          }
        }
        
        const annualKWh = sqft * baseIntensity * intensityMultiplier;
        totalElectricity += annualKWh;
        
        assumptions.push({
          category: 'Scope 2 - Building Electricity',
          assumption: `${sqft.toLocaleString()} sqft ${buildingType} × ${baseIntensity} kWh/sqft/year × ${intensityMultiplier.toFixed(2)} HVAC = ${annualKWh.toLocaleString()} kWh`,
          source: 'CBECS 2023',
          userProvided: true,
          dataPoint: `${sqft} sqft ${buildingType}`
        });
      }
    }
  }
  
  if (formData.operations?.fleet?.hasFleet === 'yes' && formData.operations.fleet.numVehicles) {
    const numVehicles = parseFloat(formData.operations.fleet.numVehicles);
    const electricPercent = parseFloat(formData.operations.fleet.electricPercent) || 0;
    const electricVehicles = numVehicles * (electricPercent / 100);
    
    if (electricVehicles > 0) {
      const annualKWhPerVehicle = 3500;
      totalElectricity += electricVehicles * annualKWhPerVehicle;
      
      assumptions.push({
        category: 'Scope 2 - Electric Vehicles',
        assumption: `${electricVehicles.toFixed(1)} EVs × 3,500 kWh/vehicle/year`,
        source: 'DOE 2023',
        userProvided: true,
        dataPoint: `${electricVehicles.toFixed(0)} electric vehicles`
      });
    }
  }
  
  const country = formData.companyBasics.hqCountry || 'US';
  const gridFactor = factors.gridFactors[country]?.locationBased || factors.gridFactors['US'].locationBased;
  
  let renewablePercent = 0;
  if (formData.energy?.renewableEnergy?.purchases) {
    renewablePercent = parseFloat(formData.energy.renewableEnergy.percent) || 0;
  }
  
  const netElectricity = totalElectricity * (1 - renewablePercent / 100);
  scope2.purchasedElectricity = (netElectricity * gridFactor) / 1000;
  
  assumptions.push({
    category: 'Scope 2 - Grid Emission Factor',
    assumption: `${netElectricity.toLocaleString()} kWh × ${gridFactor} kg CO2e/kWh`,
    source: 'EPA eGRID 2023',
    userProvided: false,
    dataPoint: null
  });
  
  return scope2;
}

function calculateScope3(formData, factors, assumptions, scope1Results, scope2Results) {
  const scope3 = {
    purchasedGoods: 0, capitalGoods: 0, fuelEnergy: 0,
    upstreamTransport: 0, waste: 0, businessTravel: 0,
    commuting: 0, downstreamTransport: 0, useOfProducts: 0,
    endOfLife: 0, investments: 0
  };
  
  const rawMaterials = parseFloat(formData.supplyChain?.purchasedGoods?.rawMaterials) || 0;
  const services = parseFloat(formData.supplyChain?.purchasedGoods?.services) || 0;
  scope3.purchasedGoods = (rawMaterials * 0.45 + services * 0.12) / 1000;
  
  if (scope3.purchasedGoods > 0) {
    assumptions.push({
      category: 'Scope 3 - Purchased Goods',
      assumption: `$${rawMaterials.toLocaleString()} materials × 0.45 kg/$; $${services.toLocaleString()} services × 0.12 kg/$`,
      source: 'EPA EEIO',
      userProvided: true,
      dataPoint: `$${(rawMaterials + services).toLocaleString()}`
    });
  }
  
  const capex = parseFloat(formData.supplyChain?.purchasedGoods?.capitalEquipment) || 0;
  scope3.capitalGoods = (capex * 0.50) / 1000;
if (capex > 0) {
    assumptions.push({
      category: 'Scope 3 - Capital Goods',
      assumption: `$${capex.toLocaleString()} capital equipment × 0.50 kg CO2e/$`,
      source: 'EPA EEIO',
      userProvided: true,
      dataPoint: `$${capex.toLocaleString()}`
    });
  }
  
  const scope1Total = scope1Results.facilities + scope1Results.fleet + scope1Results.onSiteCombustion;
  scope3.fuelEnergy = scope1Total * 0.20 + scope2Results.purchasedElectricity * 0.20;
  if (scope3.fuelEnergy > 0) {
    assumptions.push({
      category: 'Scope 3 - Fuel & Energy Related',
      assumption: `20% of Scope 1 (${scope1Total.toFixed(1)} tCO2e) + 20% of Scope 2 (${scope2Results.purchasedElectricity.toFixed(1)} tCO2e) for upstream emissions`,
      source: 'GHG Protocol',
      userProvided: false,
      dataPoint: null
    });
  }
  const employees = parseFloat(formData.companyBasics.employees) || 0;
  scope3.waste = employees * 0.5;
  if (employees > 0) {
    assumptions.push({
      category: 'Scope 3 - Waste',
      assumption: `${employees.toLocaleString()} employees × 0.5 tCO2e/employee/year`,
      source: 'EPA averages',
      userProvided: true,
      dataPoint: `${employees} employees`
    });
  }
  const travelBudget = parseFloat(formData.travel?.travelBudget) || 0;
  scope3.businessTravel = travelBudget * 0.00015;
  if (travelBudget > 0) {
    assumptions.push({
      category: 'Scope 3 - Business Travel',
      assumption: `$${travelBudget.toLocaleString()} travel budget × 0.00015 tCO2e/$`,
      source: 'EPA EEIO',
      userProvided: true,
      dataPoint: `$${travelBudget.toLocaleString()}`
    });
  }
  const remotePercent = parseFloat(formData.travel?.remoteWorkPercent) || 0;
  scope3.commuting = employees * (1 - remotePercent / 100) * 2.0;
  if (scope3.commuting > 0) {
    assumptions.push({
      category: 'Scope 3 - Employee Commuting',
      assumption: `${employees.toLocaleString()} employees × ${(100 - remotePercent).toFixed(0)}% in-office × 2.0 tCO2e/employee/year`,
      source: 'EPA averages',
      userProvided: true,
      dataPoint: `${employees} employees, ${remotePercent}% remote`
    });
  }
  const shipments = parseFloat(formData.supplyChain?.distribution?.annualShipments) || 0;
  const distMethod = formData.supplyChain?.distribution?.method;
  const distFactors = { local: 0.5, regional: 1.2, national: 3.5, international: 10.0 };
  const distFactor = distFactors[distMethod] || 1.2;
  scope3.downstreamTransport = (shipments * distFactor) / 1000;
  if (shipments > 0) {
    assumptions.push({
      category: 'Scope 3 - Downstream Transport',
      assumption: `${shipments.toLocaleString()} shipments × ${distFactor} kg CO2e/shipment (${distMethod})`,
      source: 'DEFRA 2023',
      userProvided: true,
      dataPoint: `${shipments} shipments`
    });
  }
  const productType = formData.supplyChain?.products?.type;
  if (productType && productType !== '') {
    const units = parseFloat(formData.supplyChain.products.annualUnitsSold) || 0;
    const lifetime = parseFloat(formData.supplyChain.products.avgLifetime) || 1;
    const intensity = formData.supplyChain.products.energyIntensity;
    
    let annualEmissionPerUnit = 0;
    if (productType === 'electric_devices') {
      const intensityMap = { low: 10, medium: 50, high: 200 };
      annualEmissionPerUnit = intensityMap[intensity] || 50;
    } else if (productType === 'fuel_consuming') {
      annualEmissionPerUnit = 4600;
    }
    
    scope3.useOfProducts = (units * lifetime * annualEmissionPerUnit) / 1000;
if (scope3.useOfProducts > 0) {
      assumptions.push({
        category: 'Scope 3 - Use of Sold Products',
        assumption: `${units.toLocaleString()} units × ${lifetime} year lifetime × ${annualEmissionPerUnit} kg CO2e/year`,
        source: 'Product category averages',
        userProvided: true,
        dataPoint: `${units} units, ${productType}`
      });
    }
  }
  
  const revenue = parseFloat(formData.companyBasics.revenue) || 0;
  const industry = formData.companyBasics.industry;
  let massPerDollar = 0.01;
  if (industry && (industry.includes('manufacturing') || industry.includes('food'))) {
    massPerDollar = 0.5;
  }
  scope3.endOfLife = (revenue * massPerDollar * 0.034) / 1000;
  if (scope3.endOfLife > 0) {
    assumptions.push({
      category: 'Scope 3 - End-of-Life',
      assumption: `$${revenue.toLocaleString()} revenue × ${massPerDollar} kg/$ × 0.034 kg CO2e/kg waste`,
      source: 'EPA waste factors',
      userProvided: false,
      dataPoint: null
    });
  }
  return scope3;
}

function calculateIndustryComparison(formData, factors, companyTotal) {
  const industry = formData.companyBasics.industry;
  const revenue = parseFloat(formData.companyBasics.revenue) || 1;
  const revenueMillions = revenue / 1000000;
  
  const industryIntensity = factors.industries[industry]?.intensity || 100;
  const industryAverage = revenueMillions * industryIntensity;
  
  const variance = ((companyTotal - industryAverage) / industryAverage) * 100;
  
  let interpretation = 'average';
  if (variance < -10) interpretation = 'below_average';
  if (variance > 10) interpretation = 'above_average';
  
  return {
    companyTotal: Math.round(companyTotal),
    industryAverage: Math.round(industryAverage),
    variance: variance,
    interpretation: interpretation
  };
}

function calculateConfidence(formData) {
  let answered = 0;
  const total = 27;
  
  if (formData.companyBasics.revenue) answered++;
  if (formData.companyBasics.industry) answered++;
  if (formData.companyBasics.employees) answered++;
  if (formData.companyBasics.primaryRegion) answered++;
  if (formData.companyBasics.hqCountry) answered++;
  
  const sqft = formData.operations?.squareFootage;
  if (sqft?.office) answered++;
  if (sqft?.warehouse) answered++;
  if (sqft?.retail) answered++;
  if (sqft?.manufacturing_light) answered++;
  if (sqft?.manufacturing_heavy) answered++;
  
  if (formData.operations?.hvac?.heating) answered++;
  if (formData.operations?.hvac?.airConditioning) answered++;
  if (formData.operations?.hvac?.heatingSource) answered++;
  
  if (formData.operations?.fleet?.hasFleet === 'yes') {
    answered++;
    if (formData.operations?.fleet?.numVehicles) answered++;
    if (formData.operations?.fleet?.electricPercent !== undefined) answered++;
  }
  
  if (formData.supplyChain?.purchasedGoods?.rawMaterials) answered++;
  if (formData.supplyChain?.purchasedGoods?.services) answered++;
  if (formData.supplyChain?.purchasedGoods?.capitalEquipment) answered++;
  
  if (formData.supplyChain?.suppliers?.domestic || 
      formData.supplyChain?.suppliers?.regional || 
      formData.supplyChain?.suppliers?.international) answered++;
  
  if (formData.supplyChain?.distribution?.annualShipments) answered++;
  if (formData.supplyChain?.distribution?.method) answered++;
  
  if (formData.supplyChain?.products?.type) {
    answered++;
    if (formData.supplyChain?.products?.annualUnitsSold) answered++;
    if (formData.supplyChain?.products?.avgLifetime) answered++;
  }
  
  if (formData.travel?.travelBudget) answered++;
  if (formData.energy?.renewableEnergy?.purchases) answered++;
  
  const score = Math.round((answered / total) * 100);
  
  let level = 'Low';
  if (score >= 80) level = 'High';
  else if (score >= 60) level = 'Medium-High';
  else if (score >= 40) level = 'Medium';
  else if (score >= 20) level = 'Medium-Low';
  
  return {
    score: score,
    level: level,
    questionsAnswered: answered,
    totalQuestions: total
  };
}

function performSanityChecks(formData, results) {
  const warnings = [];
  
  const scope3Percent = (results.summary.scope3 / results.summary.total) * 100;
  if (scope3Percent < 50) {
    warnings.push({
      type: 'low_scope3',
      message: 'Scope 3 emissions appear low. For most companies, Scope 3 represents 70-90% of total emissions.'
    });
  }
  
  return warnings;
}
