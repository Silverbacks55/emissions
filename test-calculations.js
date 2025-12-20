// test-calculations.js - Test the calculation engine

const { EMISSION_FACTORS } = require('./src/js/data/emissionFactors.js');
const { calculateFootprint } = require('./src/js/calculations.js');

console.log('🧪 Testing Calculation Engine\n');
console.log('='.repeat(50));

// Sample company data (Tech startup)
const sampleFormData = {
  companyBasics: {
    revenue: 5000000,        // $5M
    industry: 'tech_software',
    employees: 50,
    primaryRegion: 'North America',
    hqCountry: 'US'
  },
  operations: {
    squareFootage: 10000,
    hvac: {
      airConditioning: true,
      heating: true,
      heatingSource: 'natural_gas',
      coolingIntensity: 'moderate'
    },
    fleet: {
      hasFleet: 'no'
    }
  },
  supplyChain: {
    purchasedGoods: {
      rawMaterials: 0,
      services: 500000,      // $500k in services
      goodsForResale: 0,
      capitalEquipment: 200000  // $200k in equipment
    },
    suppliers: {
      geography: 'domestic'
    }
  },
  travel: {
    travelBudget: 100000,    // $100k travel
    remoteWorkPercent: 40     // 40% remote
  },
  energy: {
    renewableEnergy: {
      purchases: false
    }
  }
};

console.log('\n📋 Test Company Profile:');
console.log(`   Industry: Tech/Software`);
console.log(`   Revenue: $${sampleFormData.companyBasics.revenue.toLocaleString()}`);
console.log(`   Employees: ${sampleFormData.companyBasics.employees}`);
console.log(`   Office: ${sampleFormData.operations.squareFootage.toLocaleString()} sqft`);
console.log(`   Remote work: ${sampleFormData.travel.remoteWorkPercent}%`);
console.log('\n' + '='.repeat(50));

// Run calculation
console.log('\n⚙️  Running calculations...\n');

const results = calculateFootprint(sampleFormData, EMISSION_FACTORS);

// Display results
console.log('✅ RESULTS:\n');
console.log('📊 SUMMARY:');
console.log(`   Total Emissions: ${results.summary.total.toFixed(1)} tCO₂e`);
console.log(`   Scope 1: ${results.summary.scope1.toFixed(1)} tCO₂e (${((results.summary.scope1/results.summary.total)*100).toFixed(1)}%)`);
console.log(`   Scope 2: ${results.summary.scope2.toFixed(1)} tCO₂e (${((results.summary.scope2/results.summary.total)*100).toFixed(1)}%)`);
console.log(`   Scope 3: ${results.summary.scope3.toFixed(1)} tCO₂e (${((results.summary.scope3/results.summary.total)*100).toFixed(1)}%)`);

console.log('\n📈 INTENSITY METRICS:');
console.log(`   Per Employee: ${results.intensityMetrics.perEmployee.toFixed(2)} tCO₂e/employee`);
console.log(`   Per $M Revenue: ${results.intensityMetrics.perRevenue.toFixed(1)} tCO₂e/$M`);

console.log('\n🏭 INDUSTRY COMPARISON:');
console.log(`   Company: ${results.industryComparison.companyTotal} tCO₂e`);
console.log(`   Industry Avg: ${results.industryComparison.industryAverage} tCO₂e`);
console.log(`   Variance: ${results.industryComparison.variance.toFixed(1)}%`);
console.log(`   Status: ${results.industryComparison.interpretation}`);

console.log('\n📊 DETAILED BREAKDOWN:');
console.log('\n  Scope 1:');
console.log(`    Facilities: ${results.breakdown.scope1.facilities.toFixed(2)} tCO₂e`);
console.log(`    Fleet: ${results.breakdown.scope1.fleet.toFixed(2)} tCO₂e`);
console.log(`    On-Site Combustion: ${results.breakdown.scope1.onSiteCombustion.toFixed(2)} tCO₂e`);

console.log('\n  Scope 2:');
console.log(`    Purchased Electricity: ${results.breakdown.scope2.purchasedElectricity.toFixed(2)} tCO₂e`);

console.log('\n  Scope 3:');
console.log(`    Purchased Goods: ${results.breakdown.scope3.purchasedGoods.toFixed(2)} tCO₂e`);
console.log(`    Capital Goods: ${results.breakdown.scope3.capitalGoods.toFixed(2)} tCO₂e`);
console.log(`    Fuel & Energy: ${results.breakdown.scope3.fuelEnergy.toFixed(2)} tCO₂e`);
console.log(`    Upstream Transport: ${results.breakdown.scope3.upstreamTransport.toFixed(2)} tCO₂e`);
console.log(`    Waste: ${results.breakdown.scope3.waste.toFixed(2)} tCO₂e`);
console.log(`    Business Travel: ${results.breakdown.scope3.businessTravel.toFixed(2)} tCO₂e`);
console.log(`    Commuting: ${results.breakdown.scope3.commuting.toFixed(2)} tCO₂e`);
console.log(`    Downstream Transport: ${results.breakdown.scope3.downstreamTransport.toFixed(2)} tCO₂e`);
console.log(`    Use of Products: ${results.breakdown.scope3.useOfProducts.toFixed(2)} tCO₂e`);
console.log(`    End-of-Life: ${results.breakdown.scope3.endOfLife.toFixed(2)} tCO₂e`);
console.log(`    Investments: ${results.breakdown.scope3.investments.toFixed(2)} tCO₂e`);

console.log('\n🎯 CONFIDENCE:');
console.log(`   Level: ${results.confidence.level}`);
console.log(`   Score: ${results.confidence.score}%`);
console.log(`   Data Points: ${results.confidence.questionsAnswered}/${results.confidence.totalQuestions}`);

if (results.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  results.warnings.forEach(w => {
    console.log(`   - ${w.message}`);
  });
}

console.log('\n' + '='.repeat(50));
console.log('✅ Test Complete!\n');

// Validate results are reasonable
const tests = [
  { 
    name: 'Total emissions positive', 
    pass: results.summary.total > 0 
  },
  { 
    name: 'Scope 3 is largest', 
    pass: results.summary.scope3 > results.summary.scope1 && 
          results.summary.scope3 > results.summary.scope2 
  },
  { 
    name: 'Total equals sum of scopes', 
    pass: Math.abs(results.summary.total - 
          (results.summary.scope1 + results.summary.scope2 + results.summary.scope3)) < 0.01 
  },
  { 
    name: 'Per employee metric reasonable', 
    pass: results.intensityMetrics.perEmployee > 0 && 
          results.intensityMetrics.perEmployee < 100 
  },
  { 
    name: 'Industry comparison calculated', 
    pass: results.industryComparison.industryAverage > 0 
  }
];

console.log('🧪 VALIDATION TESTS:\n');
tests.forEach(test => {
  const icon = test.pass ? '✅' : '❌';
  console.log(`   ${icon} ${test.name}`);
});

const allPassed = tests.every(t => t.pass);
console.log('\n' + (allPassed ? '✅ All tests passed!' : '❌ Some tests failed'));
console.log('');