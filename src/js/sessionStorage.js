// sessionStorage.js - Save and restore form data

function saveFormData() {
  const formData = collectFormData();
  sessionStorage.setItem('carbonCalcFormData', JSON.stringify(formData));
  console.log('Form data saved to session storage');
}

function restoreFormData() {
  const savedData = sessionStorage.getItem('carbonCalcFormData');
  if (!savedData) {
    console.log('No saved form data found');
    return;
  }
  
  console.log('Restoring form data from session storage...');
  const formData = JSON.parse(savedData);
  
  if (formData.companyBasics) {
    setInputValue('revenue', formData.companyBasics.revenue);
    setInputValue('industry', formData.companyBasics.industry);
    setInputValue('employees', formData.companyBasics.employees);
    setInputValue('primaryRegion', formData.companyBasics.primaryRegion);
    setInputValue('hqCountry', formData.companyBasics.hqCountry);
  }
  
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
  
  if (formData.travel) {
    setInputValue('travelBudget', formData.travel.travelBudget);
    setInputValue('remoteWorkPercent', formData.travel.remoteWorkPercent);
  }
  
  if (formData.energy && formData.energy.renewableEnergy) {
    setRadio('renewableEnergy', formData.energy.renewableEnergy.purchases ? 'yes' : 'no');
    setInputValue('renewablePercent', formData.energy.renewableEnergy.percent);
  }
  
  console.log('Form data restored successfully');
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el && value !== null && value !== undefined) {
    el.value = value;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function setCheckbox(id, checked) {
  const el = document.getElementById(id);
  if (el) {
    el.checked = !!checked;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function setRadio(name, value) {
  const el = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (el) {
    el.checked = true;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function clearSavedFormData() {
  sessionStorage.removeItem('carbonCalcFormData');
  console.log('Saved form data cleared');
}

function initAutoSave() {
  const form = document.getElementById('assessment-form');
  if (form) {
    form.addEventListener('change', () => {
      saveFormData();
    });
    
    form.addEventListener('input', debounce(() => {
      saveFormData();
    }, 1000));
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      setTimeout(() => {
        restoreFormData();
        initAutoSave();
      }, 100);
    });
  }
});
