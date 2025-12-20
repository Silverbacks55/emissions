// sessionStorage.js - Save and restore form data

// Save form data to session storage
function saveFormData() {
  const formData = collectFormData();
  sessionStorage.setItem('carbonCalcFormData', JSON.stringify(formData));
  console.log('Form data saved to session storage');
}

// Restore form data from session storage
function restoreFormData() {
  const savedData = sessionStorage.getItem('carbonCalcFormData');
  if (!savedData) {
    console.log('No saved form data found');
    return;
  }
  
  console.log('Restoring form data from session storage...');
  const formData = JSON.parse(savedData);
  
  // Restore company basics
  if (formData.companyBasics) {
    setInputValue('revenue', formData.companyBasics.revenue);
    setInputValue('industry', formData.companyBasics.industry);
    setInputValue('employees', formData.companyBasics.employees);
    setInputValue('primaryRegion', formData.companyBasics.primaryRegion);
    setInputValue('hqCountry', formData.companyBasics.hqCountry);
  }
  
  // Restore operations
  if (formData.operations) {
    if (formData.operations.squareFootage) {
      setInputValue('sqft_office', formData.operations.squareFootage.office);
      setInputValue('sqft_warehouse', formData.operations.squareFootage.warehouse);
      setInputValue('sqft_retail', formData.operations.squareFootage.retail);
      setInputValue('sqft_mfg_light', formData.operations.squareFootage.manufacturing_light);
      setInputValue('sqft_mfg_heavy', formData.operations.squareFootage.manufacturing_heavy);
    }
    
    if (formData.operations.hvac) {
      setCheckbox('hvac_heating', formData.operations.hvac.heating);
      setCheckbox('hvac_cooling', formData.operations.hvac.airConditioning);
      setInputValue('heatingSource', formData.operations.hvac.heatingSource);
      setInputValue('coolingIntensity', formData.operations.hvac.coolingIntensity);
    }
    
    if (formData.operations.fleet) {
      setRadio('hasFleet', formData.operations.fleet.hasFleet);
      setInputValue('numVehicles', formData.operations.fleet.numVehicles);
      setInputValue('fleetElectricPercent', formData.operations.fleet.electricPercent);
    }
  }
  
  // Restore supply chain
  if (formData.supplyChain) {
    if (formData.supplyChain.purchasedGoods) {
      setInputValue('rawMaterials', formData.supplyChain.purchasedGoods.rawMaterials);
      setInputValue('services', formData.supplyChain.purchasedGoods.services);
      setInputValue('capitalEquipment', formData.supplyChain.purchasedGoods.capitalEquipment);
    }
    
    if (formData.supplyChain.suppliers) {
      setCheckbox('supplier_domestic', formData.supplyChain.suppliers.domestic);
      setCheckbox('supplier_regional', formData.supplyChain.suppliers.regional);
      setCheckbox('supplier_international', formData.supplyChain.suppliers.international);
    }
    
    if (formData.supplyChain.distribution) {
      setInputValue('annualShipments', formData.supplyChain.distribution.annualShipments);
      setInputValue('distributionMethod', formData.supplyChain.distribution.method);
    }
    
    if (formData.supplyChain.products) {
      setInputValue('productType', formData.supplyChain.products.type);
      setInputValue('annualUnitsSold', formData.supplyChain.products.annualUnitsSold);
      setInputValue('avgLifetime', formData.supplyChain.products.avgLifetime);
      setInputValue('energyIntensity', formData.supplyChain.products.energyIntensity);
    }
  }
  
  // Restore travel
  if (form