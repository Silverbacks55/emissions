// formHandler.js - Collects form data and prepares it for calculation engine

function collectFormData() {
  console.log('Collecting form data...');
  
  // Helper to get value from input (handles commas in numbers)
  function getValue(id) {
    const el = document.getElementById(id);
    if (!el) return null;
    const value = el.value.replace(/,/g, ''); // Remove commas
    return value === '' ? null : parseFloat(value);
  }
  
  // Helper to get text value
  function getTextValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
  }
  
  // Helper to check if checkbox is checked
  function isChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
  }
  
  // Helper to get radio value
  function getRadioValue(name) {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : null;
  }
  
  // Build the form data object
  const formData = {
    companyBasics: {
      revenue: getValue('revenue'),
      industry: getTextValue('industry'),
      employees: getValue('employees'),
      primaryRegion: getTextValue('primaryRegion'),
      hqCountry: getTextValue('hqCountry')
    },
    
    operations: {
      // Building square footage by type
      squareFootage: {
        office: getValue('sqft_office') || 0,
        warehouse: getValue('sqft_warehouse') || 0,
        retail: getValue('sqft_retail') || 0,
        manufacturing_light: getValue('sqft_mfg_light') || 0,
        manufacturing_heavy: getValue('sqft_mfg_heavy') || 0
      },
      
      // HVAC
      hvac: {
        heating: isChecked('hvac_heating'),
        airConditioning: isChecked('hvac_cooling'),
        heatingSource: getTextValue('heatingSource'),
        coolingIntensity: getTextValue('coolingIntensity') || 'moderate'
      },
      
      // Fleet
      fleet: {
        hasFleet: getRadioValue('hasFleet'),
        numVehicles: getValue('numVehicles'),
        electricPercent: getValue('fleetElectricPercent') || 0
      }
    },
    
    supplyChain: {
      purchasedGoods: {
        rawMaterials: getValue('rawMaterials') || 0,
        services: getValue('services') || 0,
        capitalEquipment: getValue('capitalEquipment') || 0
      },
      
      suppliers: {
        domestic: isChecked('supplier_domestic'),
        regional: isChecked('supplier_regional'),
        international: isChecked('supplier_international')
      },
      
      distribution: {
        annualShipments: getValue('annualShipments') || 0,
        method: getTextValue('distributionMethod')
      },
      
      products: {
        type: getTextValue('productType'),
        annualUnitsSold: getValue('annualUnitsSold'),
        avgLifetime: getValue('avgLifetime'),
        energyIntensity: getTextValue('energyIntensity')
      }
    },
    
    travel: {
      travelBudget: getValue('travelBudget') || 0,
      remoteWorkPercent: getValue('remoteWorkPercent') || 0
    },
    
    energy: {
      renewableEnergy: {
        purchases: getRadioValue('renewableEnergy') === 'yes',
        percent: getValue('renewablePercent') || 0
      }
    }
  };
  
  console.log('Form data collected:', formData);
  return formData;
}

// Validate required fields
function validateForm() {
  const required = ['revenue', 'industry', 'employees', 'primaryRegion', 'hqCountry'];
  const missing = [];
  
  for (const id of required) {
    const el = document.getElementById(id);
    if (!el || !el.value || el.value === '') {
      missing.push(id);
    }
  }
  
  if (missing.length > 0) {
 showCustomAlert('Please complete all required fields: ' + missing.join(', '));
    return false;
  }
  
  return true;
}
// Custom alert functions
function showCustomAlert(message) {
  document.getElementById('alert-message').textContent = message;
  document.getElementById('alert-overlay').style.display = 'block';
  document.getElementById('custom-alert').style.display = 'block';
}

function closeCustomAlert() {
  document.getElementById('alert-overlay').style.display = 'none';
  document.getElementById('custom-alert').style.display = 'none';
}