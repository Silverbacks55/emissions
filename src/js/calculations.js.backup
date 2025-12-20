// calculations.js - Core emission calculation engine
// Calculates Scope 1, 2, and 3 emissions based on form data

/**
 * Main function: Calculate complete carbon footprint
 * @param {Object} formData - User input from form wizard
 * @param {Object} emissionFactors - Emission factors data
 * @returns {Object} Complete results with breakdown and metadata
 */
function calculateFootprint(formData, emissionFactors) {
  console.log('Starting footprint calculation...');
  
  const results = {
    summary: {
      total: 0,
      scope1: 0,
      scope2: 0,
      scope3: 0
    },
    breakdown: {
      scope1: {
        facilities: 0,
        fleet: 0,
        onSiteCombustion: 0
      },
      scope2: {
        purchasedElectricity: 0
      },
      scope3: {
        purchasedGoods: 0,
        capitalGoods: 0,
        fuelEnergy: 0,
        upstreamTransport: 0,
        waste: 0,
        businessTravel: 0,
        commuting: 0,
        downstreamTransport: 0,
        useOfProducts: 0,
        endOfLife: 0,
        investments: 0
      }
    },
    intensityMetrics: {
      perEmployee: 0,
      perRevenue: 0
    },
    industryComparison: {},
    confidence: {},
    assumptions: [],
    warnings: [],
    metadata: {
      calculatedAt: new Date().toISOString(),
      calculationVersion: '1.0.0'
    }
  };
  
  // Calculate each scope
  const scope1 = calculateScope1(formData, emissionFactors, results.assumptions);
  const scope2 = calculateScope2(formData, emissionFactors, results.assumptions);
  const scope3 = calculateScope3(formData, emissionFactors, results.assumptions, scope1, scope2);
  
  // Aggregate results
  results.breakdown.scope1 = scope1;
  results.breakdown.scope2 = scope2;
  results.breakdown.scope3 = scope3;
  
  results.summary.scope1 = scope1.facilities + scope1.fleet + scope1.onSiteCombustion;
  results.summary.scope2 = scope2.purchasedElectricity;
  results.summary.scope3 = Object.values(scope3).reduce((sum, val) => sum + val, 0);
  results.summary.total = results.summary.scope1 + results.summary.scope2 + results.summary.scope3;
  
  // Calculate intensity metrics
  if (formData.companyBasics.employees > 0) {
    results.intensityMetrics.perEmployee = results.summary.total / formData.companyBasics.employees;
  }
  if (formData.companyBasics.revenue > 0) {
    results.intensityMetrics.perRevenue = (results.summary.total / formData.companyBasics.revenue) * 1000000;
  }
  
  // Industry comparison
  results.industryComparison = calculateIndustryComparison(
    formData,
    results.summary.total,
    emissionFactors
  );
  
  // Calculate confidence score
  results.confidence = calculateConfidence(formData);
  
  // Sanity checks
  results.warnings = performSanityChecks(formData, results, emissionFactors);
  
  console.log('Calculation complete!');
  return results;
}

// ============================================
// SCOPE 1: DIRECT EMISSIONS
// ============================================

function calculateScope1(formData, factors, assumptions) {
  const scope1 = {
    facilities: 0,
    fleet: 0,
    onSiteCombustion: 0
  };
  
  // 1. FACILITIES HEATING
  if (formData.operations && formData.operations.squareFootage) {
    const sqft = parseFloat(formData.operations.squareFootage);
    const heatingSource = formData.operations.hvac?.heatingSource;
    
    // Only calculate if not electric heating (electric goes to Scope 2)
    if (heatingSource && heatingSource !== 'electric' && heatingSource !== 'dont_know') {
      const region = formData.companyBasics.primaryRegion || 'North America';
      
      // Heating intensity (therms per sqft per year) - climate dependent
      let heatingIntensity = 0.5; // Default moderate climate
      if (region.includes('North') || region.includes('Canada')) {
        heatingIntensity = 0.8; // Cold climate
      } else if (region.includes('South') || region.includes('Florida')) {
        heatingIntensity = 0.2; // Warm climate
      }
      
      const annualTherms = sqft * heatingIntensity;
      
      // Get fuel emission factor
      let fuelFactor = factors.fuels.natural_gas.combustionPerTherm; // Default to natural gas
      if (heatingSource === 'oil' || heatingSource === 'heating_oil') {
        fuelFactor = factors.fuels.heating_oil.combustion / 0.138; // Convert gal to therm equivalent
      } else if (heatingSource === 'propane') {
        fuelFactor = factors.fuels.propane.combustion / 0.092; // Convert gal to therm equivalent
      }
      
      scope1.facilities = (annualTherms * fuelFactor) / 1000; // Convert kg to tonnes
      
      assumptions.push({
        category: 'Scope 1 - Facilities Heating',
        assumption: `${sqft.toLocaleString()} sqft × ${heatingIntensity} therms/sqft/year × ${fuelFactor.toFixed(2)} kg CO2e/therm`,
        source: factors.fuels.natural_gas.source,
        userProvided: true,
        dataPoint: `${sqft} sqft, ${heatingSource} heating`
      });
    }
  }
  
  // 2. VEHICLE FLEET
  if (formData.operations && formData.operations.fleet?.hasFleet === 'yes') {
    const fleet = formData.operations.fleet;
    const fuelType = fleet.primaryFuelType || 'gasoline';
    
    // Skip if electric (goes to Scope 2)
    if (fuelType !== 'electric') {
      if (fleet.annualMileage && fleet.numVehicles) {
        // Method 1: User provided mileage
        const totalMiles = parseFloat(fleet.annualMileage);
        const mpg = fleet.avgMPG || (fuelType === 'diesel' ? 20 : 22); // Default MPG
        const gallons = totalMiles / mpg;
        
        const fuelFactor = fuelType === 'diesel' 
          ? factors.fuels.diesel.combustion 
          : factors.fuels.gasoline.combustion;
        
        scope1.fleet = (gallons * fuelFactor) / 1000; // Convert kg to tonnes
        
        assumptions.push({
          category: 'Scope 1 - Vehicle Fleet',
          assumption: `${totalMiles.toLocaleString()} miles ÷ ${mpg} MPG × ${fuelFactor} kg CO2e/gallon`,
          source: factors.fuels.gasoline.source,
          userProvided: true,
          dataPoint: `${fleet.numVehicles} vehicles, ${totalMiles} annual miles`
        });
        
      } else if (fleet.numVehicles) {
        // Method 2: Estimate from number of vehicles
        const numVehicles = parseFloat(fleet.numVehicles);
        const annualPerVehicle = fuelType === 'diesel'
          ? factors.operational.vehicle.diesel_annual
          : factors.operational.vehicle.gasoline_annual;
        
        scope1.fleet = numVehicles * annualPerVehicle;
        
        assumptions.push({
          category: 'Scope 1 - Vehicle Fleet',
          assumption: `${numVehicles} vehicles × ${annualPerVehicle} tCO2e/vehicle/year (industry average)`,
          source: 'EPA 2023',
          userProvided: true,
          dataPoint: `${numVehicles} vehicles`
        });
      }
    }
  }
  
  // 3. ON-SITE COMBUSTION (if user provided specific data)
  if (formData.energy && formData.energy.onSiteCombustion) {
    const combustion = formData.energy.onSiteCombustion;
    
    if (combustion.naturalGas) {
      const therms = parseFloat(combustion.naturalGas);
      scope1.onSiteCombustion += (therms * factors.fuels.natural_gas.combustionPerTherm) / 1000;
      
      assumptions.push({
        category: 'Scope 1 - On-Site Combustion',
        assumption: `${therms.toLocaleString()} therms natural gas × ${factors.fuels.natural_gas.combustionPerTherm} kg CO2e/therm`,
        source: factors.fuels.natural_gas.source,
        userProvided: true,
        dataPoint: `${therms} therms natural gas`
      });
    }
    
    if (combustion.diesel) {
      const gallons = parseFloat(combustion.diesel);
      scope1.onSiteCombustion += (gallons * factors.fuels.diesel.combustion) / 1000;
      
      assumptions.push({
        category: 'Scope 1 - On-Site Combustion',
        assumption: `${gallons.toLocaleString()} gallons diesel × ${factors.fuels.diesel.combustion} kg CO2e/gallon`,
        source: factors.fuels.diesel.source,
        userProvided: true,
        dataPoint: `${gallons} gallons diesel`
      });
    }
  }
  
  return scope1;
}

// ============================================
// SCOPE 2: PURCHASED ELECTRICITY
// ============================================

function calculateScope2(formData, factors, assumptions) {
  const scope2 = {
    purchasedElectricity: 0
  };
  
  let totalElectricity = 0; // kWh
  
  // 1. BUILDING ELECTRICITY
  if (formData.operations && formData.operations.squareFootage) {
    const sqft = parseFloat(formData.operations.squareFootage);
    
    // Determine building type
    let buildingType = 'office'; // Default
    if (formData.operations.manufacturing) {
      const mfgType = formData.operations.manufacturing.type;
      if (mfgType === 'heavy' || mfgType === 'chemicals' || mfgType === 'metals') {
        buildingType = 'manufacturing_heavy';
      } else if (mfgType === 'light' || mfgType === 'assembly' || mfgType === 'electronics') {
        buildingType = 'manufacturing_light';
      }
    } else if (formData.companyBasics.industry === 'retail') {
      buildingType = 'retail';
} else if (formData.companyBasics.industry === 'transportation') {
      buildingType = 'warehouse';
    }
    
    const region = formData.companyBasics.primaryRegion || 'North America';
    const baseIntensity = factors.buildingIntensity[region]?.[buildingType] || 
                          factors.buildingIntensity['North America'][buildingType];
    
    // Adjust for HVAC
    let intensityMultiplier = 1.0;
    if (formData.operations.hvac) {
      // Add cooling load
      if (formData.operations.hvac.airConditioning) {
        const coolingIntensity = formData.operations.hvac.coolingIntensity || 'moderate';
        if (coolingIntensity === 'high') {
          intensityMultiplier += 0.3;
        } else if (coolingIntensity === 'moderate') {
          intensityMultiplier += 0.15;
        }
      }
      
      // Add electric heating load
      if (formData.operations.hvac.heatingSource === 'electric') {
        intensityMultiplier += 0.3; // Electric heating is significant
      }
    }
    
    const annualKWh = sqft * baseIntensity * intensityMultiplier;
    totalElectricity += annualKWh;
    
    assumptions.push({
      category: 'Scope 2 - Building Electricity',
      assumption: `${sqft.toLocaleString()} sqft × ${baseIntensity} kWh/sqft/year × ${intensityMultiplier.toFixed(2)} HVAC multiplier = ${annualKWh.toLocaleString()} kWh`,
      source: 'CBECS 2023',
      userProvided: true,
      dataPoint: `${sqft} sqft, ${buildingType} building`
    });
  }
  
  // 2. ELECTRIC VEHICLE FLEET
  if (formData.operations && formData.operations.fleet?.hasFleet === 'yes') {
    const fleet = formData.operations.fleet;
    if (fleet.primaryFuelType === 'electric' && fleet.numVehicles) {
      const numVehicles = parseFloat(fleet.numVehicles);
      const annualKWhPerVehicle = 3500; // Average EV uses ~3,500 kWh/year
      totalElectricity += numVehicles * annualKWhPerVehicle;
      
      assumptions.push({
        category: 'Scope 2 - Electric Vehicles',
        assumption: `${numVehicles} electric vehicles × 3,500 kWh/vehicle/year`,
        source: 'DOE 2023',
        userProvided: true,
        dataPoint: `${numVehicles} electric vehicles`
      });
    }
  }
  
  // 3. APPLY GRID FACTOR
  const country = formData.companyBasics.hqCountry || 'US';
  const gridFactor = factors.gridFactors[country]?.locationBased || factors.gridFactors['US'].locationBased;
  
  // Apply renewable energy adjustment
  let renewablePercent = 0;
  if (formData.energy && formData.energy.renewableEnergy?.purchases) {
    renewablePercent = parseFloat(formData.energy.renewableEnergy.percentRenewable || 0) / 100;
  }
  
  const netElectricity = totalElectricity * (1 - renewablePercent);
  scope2.purchasedElectricity = (netElectricity * gridFactor) / 1000; // Convert kg to tonnes
  
  assumptions.push({
    category: 'Scope 2 - Grid Emission Factor',
    assumption: `${totalElectricity.toLocaleString()} kWh × (1 - ${(renewablePercent * 100).toFixed(0)}% renewable) × ${gridFactor} kg CO2e/kWh`,
    source: factors.gridFactors[country]?.source || 'EPA eGRID 2023',
    userProvided: renewablePercent > 0,
    dataPoint: renewablePercent > 0 ? `${(renewablePercent * 100).toFixed(0)}% renewable energy` : null
  });
  
  return scope2;
}

// ============================================
// SCOPE 3: VALUE CHAIN EMISSIONS
// ============================================

function calculateScope3(formData, factors, assumptions, scope1, scope2) {
  const scope3 = {
    purchasedGoods: 0,
    capitalGoods: 0,
    fuelEnergy: 0,
    upstreamTransport: 0,
    waste: 0,
    businessTravel: 0,
    commuting: 0,
    downstreamTransport: 0,
    useOfProducts: 0,
    endOfLife: 0,
    investments: 0
  };
  
  // CATEGORY 1: PURCHASED GOODS & SERVICES
  if (formData.supplyChain && formData.supplyChain.purchasedGoods) {
    const goods = formData.supplyChain.purchasedGoods;
    
    if (goods.rawMaterials) {
      const spend = parseFloat(goods.rawMaterials);
      scope3.purchasedGoods += (spend * factors.spendBased.raw_materials_general) / 1000;
    }
    
    if (goods.services) {
      const spend = parseFloat(goods.services);
      scope3.purchasedGoods += (spend * factors.spendBased.professional_services) / 1000;
    }
    
    if (goods.goodsForResale) {
      const spend = parseFloat(goods.goodsForResale);
      scope3.purchasedGoods += (spend * factors.spendBased.goods_for_resale_general) / 1000;
    }
    
    if (scope3.purchasedGoods > 0) {
      const totalSpend = (parseFloat(goods.rawMaterials || 0) + 
                         parseFloat(goods.services || 0) + 
                         parseFloat(goods.goodsForResale || 0));
      
      assumptions.push({
        category: 'Scope 3 - Purchased Goods & Services',
        assumption: `$${totalSpend.toLocaleString()} spend × weighted average emission factors`,
        source: factors.spendBased.source,
        userProvided: true,
        dataPoint: `$${totalSpend.toLocaleString()} total procurement spend`
      });
    }
  }
  
  // CATEGORY 2: CAPITAL GOODS
  if (formData.supplyChain && formData.supplyChain.purchasedGoods?.capitalEquipment) {
    const spend = parseFloat(formData.supplyChain.purchasedGoods.capitalEquipment);
    scope3.capitalGoods = (spend * factors.spendBased.capital_equipment) / 1000;
    
    assumptions.push({
      category: 'Scope 3 - Capital Goods',
      assumption: `$${spend.toLocaleString()} capital spend × ${factors.spendBased.capital_equipment} kg CO2e/$`,
      source: factors.spendBased.source,
      userProvided: true,
      dataPoint: `$${spend.toLocaleString()} capital equipment`
    });
  }
  
  // CATEGORY 3: FUEL & ENERGY RELATED
  // Upstream emissions from Scope 1 & 2
  const upstreamScope1 = (scope1.facilities + scope1.fleet + scope1.onSiteCombustion) * 0.20;
  
  // Get electricity consumption from Scope 2 calculation
  let electricityKWh = 0;
  if (formData.operations?.squareFootage) {
    const sqft = parseFloat(formData.operations.squareFootage);
    const buildingType = 'office'; // Simplified for this calculation
    const region = formData.companyBasics.primaryRegion || 'North America';
    const baseIntensity = factors.buildingIntensity[region]?.[buildingType] || 15.5;
    electricityKWh = sqft * baseIntensity;
  }
  
  const country = formData.companyBasics.hqCountry || 'US';
  const gridUpstream = factors.gridFactors[country]?.upstream || 0.077;
  const tdLoss = factors.gridFactors[country]?.tdLoss || 0.06;
  const gridFactor = factors.gridFactors[country]?.locationBased || 0.386;
  
  const upstreamElectricity = (electricityKWh * gridUpstream) / 1000;
  const tdLosses = (electricityKWh * gridFactor * tdLoss) / 1000;
  
  scope3.fuelEnergy = upstreamScope1 + upstreamElectricity + tdLosses;
  
  assumptions.push({
    category: 'Scope 3 - Fuel & Energy Related',
    assumption: `Upstream fuel extraction (20% of Scope 1) + upstream electricity + T&D losses`,
    source: 'GHG Protocol guidance',
    userProvided: false
  });
  
  // CATEGORY 4: UPSTREAM TRANSPORT & DISTRIBUTION
  if (formData.supplyChain && formData.supplyChain.suppliers) {
    const totalSpend = parseFloat(formData.supplyChain.purchasedGoods?.rawMaterials || 0) +
                      parseFloat(formData.supplyChain.purchasedGoods?.goodsForResale || 0);
    
    const supplierGeography = formData.supplyChain.suppliers.geography || 'domestic';
    let transportFactor = factors.spendBased.upstream_transport_domestic;
    if (supplierGeography === 'international') {
      transportFactor = factors.spendBased.upstream_transport_international;
    }
    
    scope3.upstreamTransport = (totalSpend * transportFactor) / 1000;
    
    assumptions.push({
      category: 'Scope 3 - Upstream Transport',
      assumption: `$${totalSpend.toLocaleString()} goods spend × ${transportFactor} kg CO2e/$ (${supplierGeography})`,
      source: factors.spendBased.source,
      userProvided: true,
      dataPoint: `${supplierGeography} suppliers`
    });
  }
  
  // CATEGORY 5: WASTE
  if (formData.operations) {
    const employees = parseFloat(formData.companyBasics.employees || 0);
    if (employees > 0) {
      scope3.waste = employees * factors.operational.employee.waste;
      
      assumptions.push({
        category: 'Scope 3 - Waste',
        assumption: `${employees} employees × ${factors.operational.employee.waste} tCO2e/employee/year`,
        source: 'EPA 2023',
        userProvided: false
      });
    }
  }
  
  // CATEGORY 6: BUSINESS TRAVEL
  if (formData.travel && formData.travel.travelBudget) {
    const budget = parseFloat(formData.travel.travelBudget);
    scope3.businessTravel = budget * factors.operational.businessTravel;
    
    assumptions.push({
      category: 'Scope 3 - Business Travel',
      assumption: `$${budget.toLocaleString()} travel spend × ${factors.operational.businessTravel} tCO2e/$`,
      source: 'EPA 2023',
      userProvided: true,
      dataPoint: `$${budget.toLocaleString()} travel budget`
    });
  }
  
  // CATEGORY 7: EMPLOYEE COMMUTING
  if (formData.companyBasics.employees) {
    const employees = parseFloat(formData.companyBasics.employees);
    const remotePercent = formData.travel?.remoteWorkPercent 
      ? parseFloat(formData.travel.remoteWorkPercent) / 100 
      : 0;
    
    const inOfficeEmployees = employees * (1 - remotePercent);
    scope3.commuting = inOfficeEmployees * factors.operational.employee.commute;
    
    assumptions.push({
      category: 'Scope 3 - Employee Commuting',
      assumption: `${employees} employees × ${((1 - remotePercent) * 100).toFixed(0)}% in-office × ${factors.operational.employee.commute} tCO2e/employee/year`,
      source: 'EPA 2023',
      userProvided: remotePercent > 0,
      dataPoint: remotePercent > 0 ? `${(remotePercent * 100).toFixed(0)}% remote work` : null
    });
  }
  
  // CATEGORY 9: DOWNSTREAM TRANSPORT
  if (formData.supplyChain && formData.supplyChain.distribution) {
    const dist = formData.supplyChain.distribution;
    if (dist.annualShipments) {
      const shipments = parseFloat(dist.annualShipments);
      const method = dist.primaryMethod || 'ground';
      
      let factorPerShipment = factors.transport.parcel_national; // Default
      if (method === 'local') factorPerShipment = factors.transport.parcel_local;
      else if (method === 'regional') factorPerShipment = factors.transport.parcel_regional;
      else if (method === 'international') factorPerShipment = factors.transport.parcel_international;
      
      scope3.downstreamTransport = (shipments * factorPerShipment) / 1000;
      
      assumptions.push({
        category: 'Scope 3 - Downstream Transport',
        assumption: `${shipments.toLocaleString()} shipments × ${factorPerShipment} kg CO2e/shipment (${method})`,
        source: factors.transport.source,
        userProvided: true,
        dataPoint: `${shipments.toLocaleString()} annual shipments, ${method} delivery`
      });
    }
  }
  
  // CATEGORY 11: USE OF SOLD PRODUCTS
  if (formData.supplyChain && formData.supplyChain.useOfSoldProducts) {
    const use = formData.supplyChain.useOfSoldProducts;
    if (use.productType && use.annualUnitsSold) {
      const units = parseFloat(use.annualUnitsSold);
      const lifetime = parseFloat(use.avgLifetime || 5);
      const energyIntensity = use.energyIntensity || 'medium';
      
      let annualEmissionPerUnit = 0;
      if (use.productType === 'electric_devices') {
        annualEmissionPerUnit = factors.useOfProducts.electric_devices[energyIntensity];
      } else if (use.productType === 'fuel_consuming') {
        annualEmissionPerUnit = factors.useOfProducts.fuel_consuming.vehicles;
      }
      
      scope3.useOfProducts = (units * lifetime * annualEmissionPerUnit) / 1000;
      
      assumptions.push({
        category: 'Scope 3 - Use of Sold Products',
        assumption: `${units.toLocaleString()} units × ${lifetime} years × ${annualEmissionPerUnit} kg CO2e/unit/year`,
        source: 'EPA ENERGY STAR',
        userProvided: true,
        dataPoint: `${units.toLocaleString()} units sold, ${lifetime} year lifetime`
      });
    }
  }
  
  // CATEGORY 12: END-OF-LIFE
  if (formData.companyBasics.revenue && formData.companyBasics.industry) {
    const revenue = parseFloat(formData.companyBasics.revenue);
    
    // Estimate product mass from revenue (industry-specific)
    let massPerDollar = 0.5; // kg per $ (default manufacturing)
    if (formData.companyBasics.industry.includes('software') || 
        formData.companyBasics.industry.includes('financial')) {
      massPerDollar = 0.01; // Negligible for services
    } else if (formData.companyBasics.industry.includes('food')) {
      massPerDollar = 0.8;
    }
    
    const totalMass = revenue * massPerDollar;
    const eolFactor = factors.endOfLife.landfill * 0.5 + 
                      factors.endOfLife.recycling * 0.3 + 
                      factors.endOfLife.incineration * 0.2; // Mixed treatment
    
    scope3.endOfLife = (totalMass * eolFactor) / 1000;
    
    if (scope3.endOfLife > 1) { // Only add if material
      assumptions.push({
        category: 'Scope 3 - End-of-Life',
        assumption: `$${revenue.toLocaleString()} revenue × ${massPerDollar} kg/$ × mixed EOL factors`,
        source: 'EPA WARM 2023',
        userProvided: false
      });
    }
  }
  
  // CATEGORY 15: INVESTMENTS (Financial services only)
  if (formData.companyBasics.industry === 'financial_services' && 
      formData.energy && formData.energy.financialServices?.aum) {
    const aum = parseFloat(formData.energy.financialServices.aum);
    const aumMillions = aum / 1000000;
    scope3.investments = aumMillions * 150; // 150 tCO2e per $M AUM (WACI average)
    
    assumptions.push({
      category: 'Scope 3 - Investments',
      assumption: `$${aum.toLocaleString()} AUM × 150 tCO2e/$M (weighted average carbon intensity)`,
      source: 'PCAF 2023',
      userProvided: true,
      dataPoint: `$${aum.toLocaleString()} assets under management`
    });
  }
  
  return scope3;
}

// ============================================
// INDUSTRY COMPARISON
// ============================================

function calculateIndustryComparison(formData, companyTotal, factors) {
  const industry = formData.companyBasics.industry;
  const revenue = parseFloat(formData.companyBasics.revenue);
  
  const industryData = factors.industries.find(i => i.id === industry);
  
  if (!industryData || !revenue) {
    return {
      companyTotal: companyTotal,
      industryAverage: null,
      variance: 0,
      interpretation: 'unable_to_compare'
    };
  }
  
  const revenueMillions = revenue / 1000000;
  const industryAverage = revenueMillions * industryData.revenueIntensity;
  const variance = ((companyTotal - industryAverage) / industryAverage) * 100;
  
  let interpretation = 'average';
  if (variance < -10) interpretation = 'below_average';
  else if (variance > 10) interpretation = 'above_average';
  
  return {
    companyTotal: Math.round(companyTotal * 10) / 10,
    industryAverage: Math.round(industryAverage * 10) / 10,
    variance: Math.round(variance * 10) / 10,
    interpretation: interpretation
  };
}

// ============================================
// CONFIDENCE SCORING
// ============================================

function calculateConfidence(formData) {
  let questionsAnswered = 0;
  const totalQuestions = 43; // From FRD
  
  // Count answered questions
  if (formData.companyBasics) {
    if (formData.companyBasics.revenue) questionsAnswered++;
    if (formData.companyBasics.industry) questionsAnswered++;
    if (formData.companyBasics.employees) questionsAnswered++;
    if (formData.companyBasics.primaryRegion) questionsAnswered++;
    if (formData.companyBasics.hqCountry) questionsAnswered++;
  }
  
  if (formData.operations) {
    if (formData.operations.squareFootage) questionsAnswered++;
    if (formData.operations.hvac) questionsAnswered += 3;
    if (formData.operations.fleet) questionsAnswered += 2;
  }
  
  if (formData.supplyChain) {
    if (formData.supplyChain.purchasedGoods) questionsAnswered += 4;
    if (formData.supplyChain.suppliers) questionsAnswered += 2;
  }
  
  if (formData.travel) {
    if (formData.travel.travelBudget) questionsAnswered++;
    if (formData.travel.remoteWorkPercent !== undefined) questionsAnswered++;
  }
  
  if (formData.energy) {
    if (formData.energy.renewableEnergy) questionsAnswered += 2;
  }
  
  const score = (questionsAnswered / totalQuestions) * 100;
  
  let level = 'Low';
  if (score >= 80) level = 'High';
  else if (score >= 60) level = 'Medium-High';
  else if (score >= 40) level = 'Medium';
  else if (score >= 20) level = 'Medium-Low';
  
  return {
    score: Math.round(score),
    level: level,
    questionsAnswered: questionsAnswered,
    totalQuestions: totalQuestions,
    dataQualityNotes: []
  };
}

// ============================================
// SANITY CHECKS
// ============================================

function performSanityChecks(formData, results, factors) {
  const warnings = [];
  
  // Check if emissions are extremely high compared to industry
  if (results.industryComparison.variance > 300) {
    warnings.push({
      type: 'high_emissions',
      message: `Your emissions are ${results.industryComparison.variance.toFixed(0)}% above industry average. Please verify your inputs.`
    });
  }
  
  // Check revenue/employee ratio
  if (formData.companyBasics.revenue && formData.companyBasics.employees) {
    const revenuePerEmployee = formData.companyBasics.revenue / formData.companyBasics.employees;
    if (revenuePerEmployee > 10000000) { // $10M per employee
      warnings.push({
        type: 'unusual_ratio',
        message: 'Revenue per employee seems unusually high. Please verify your revenue and employee count.'
      });
    }
  }
  
  // Check if Scope 3 is suspiciously low
  if (results.summary.scope3 < results.summary.scope1 + results.summary.scope2) {
    warnings.push({
      type: 'low_scope3',
      message: 'Scope 3 emissions appear low. For most companies, Scope 3 represents 70-90% of total emissions.'
    });
  }
  
  return warnings;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateFootprint,
    calculateScope1,
    calculateScope2,
    calculateScope3
  };
}