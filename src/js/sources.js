// sources.js - Display data sources and references

function showSourcesPage() {
  // Hide results page
  const resultsPage = document.getElementById('results-page');
  if (resultsPage) {
    resultsPage.classList.add('hidden');
  }
  
  // Hide methodology page if open
  const methodPage = document.getElementById('methodology-page');
  if (methodPage) {
    methodPage.classList.add('hidden');
  }
  
  // Create sources page
  const sourcesHTML = `
    <div id="sources-page" class="page-container">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h1 style="color: #2d5016; margin-bottom: 20px;">Data Sources & References</h1>
        <p style="color: #6c757d; margin-bottom: 30px;">All emission factors and calculation methodologies are based on the following authoritative sources:</p>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Primary Standards & Frameworks</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>GHG Protocol Corporate Standard</strong> - World Resources Institute (WRI) and World Business Council for Sustainable Development (WBCSD)<br>
          <a href="https://ghgprotocol.org/corporate-standard" target="_blank" style="color: #2d5016;">https://ghgprotocol.org/corporate-standard</a></li>
          
          <li><strong>GHG Protocol Scope 3 Standard</strong> - Value chain emissions accounting guidance<br>
          <a href="https://ghgprotocol.org/standards/scope-3-standard" target="_blank" style="color: #2d5016;">https://ghgprotocol.org/standards/scope-3-standard</a></li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Emission Factors - United States</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>EPA GHG Emission Factors Hub (2025)</strong> - Stationary and mobile source emission factors<br>
          <a href="https://www.epa.gov/climateleadership/ghg-emission-factors-hub" target="_blank" style="color: #2d5016;">https://www.epa.gov/climateleadership/ghg-emission-factors-hub</a></li>
          
          <li><strong>EPA eGRID (2023)</strong> - US electricity grid emission factors by region<br>
          <a href="https://www.epa.gov/egrid" target="_blank" style="color: #2d5016;">https://www.epa.gov/egrid</a></li>
          
          <li><strong>EPA EEIO v1.3 (2023)</strong> - Environmentally-Extended Input-Output model for supply chain emissions<br>
          <a href="https://www.epa.gov/land-research/us-environmentally-extended-input-output-useeio-models" target="_blank" style="color: #2d5016;">https://www.epa.gov/land-research/us-environmentally-extended-input-output-useeio-models</a></li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">International Emission Factors</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>International Energy Agency (IEA) - Electricity Grid Factors (2023)</strong> - Grid emission factors for G20 countries<br>
          <a href="https://www.iea.org/data-and-statistics" target="_blank" style="color: #2d5016;">https://www.iea.org/data-and-statistics</a></li>
          
          <li><strong>UK BEIS (Department for Business, Energy & Industrial Strategy)</strong> - UK-specific emission factors<br>
          <a href="https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting" target="_blank" style="color: #2d5016;">https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting</a></li>
          
          <li><strong>Environment and Climate Change Canada</strong> - Canadian emission factors<br>
          <a href="https://www.canada.ca/en/environment-climate-change/services/climate-change/pricing-pollution-how-it-will-work/output-based-pricing-system/federal-greenhouse-gas-offset-system.html" target="_blank" style="color: #2d5016;">https://www.canada.ca/en/environment-climate-change</a></li>
          
          <li><strong>German Federal Environment Agency (UBA)</strong> - German grid factors<br>
          <a href="https://www.umweltbundesamt.de/en" target="_blank" style="color: #2d5016;">https://www.umweltbundesamt.de</a></li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Building & Energy Data</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>CBECS (Commercial Buildings Energy Consumption Survey) 2023</strong> - US Department of Energy building energy intensity benchmarks<br>
          <a href="https://www.eia.gov/consumption/commercial/" target="_blank" style="color: #2d5016;">https://www.eia.gov/consumption/commercial/</a></li>
          
          <li><strong>US Department of Energy - Electric Vehicle Data</strong> - EV energy consumption statistics<br>
          <a href="https://www.energy.gov/eere/vehicles/electric-vehicles" target="_blank" style="color: #2d5016;">https://www.energy.gov/eere/vehicles/electric-vehicles</a></li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Transportation & Logistics</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>UK DEFRA (Department for Environment, Food & Rural Affairs) 2023</strong> - Transportation and logistics emission factors<br>
          <a href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023" target="_blank" style="color: #2d5016;">https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023</a></li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Industry Benchmarks</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>CDP (Carbon Disclosure Project)</strong> - Industry-specific emission intensity benchmarks<br>
          <a href="https://www.cdp.net/en" target="_blank" style="color: #2d5016;">https://www.cdp.net</a></li>
          
          <li><strong>Science Based Targets initiative (SBTi)</strong> - Sectoral decarbonization approaches<br>
          <a href="https://sciencebasedtargets.org/" target="_blank" style="color: #2d5016;">https://sciencebasedtargets.org</a></li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Additional Resources</h2>
        <ul style="line-height: 2; margin-bottom: 30px;">
          <li><strong>IPCC (Intergovernmental Panel on Climate Change)</strong> - Climate science and global warming potentials<br>
          <a href="https://www.ipcc.ch/" target="_blank" style="color: #2d5016;">https://www.ipcc.ch</a></li>
          
          <li><strong>Quantis Scope 3 Evaluator</strong> - Screening-level Scope 3 methodology<br>
          <a href="https://quantis.com/who-we-guide/our-impact/sustainability-initiatives/scope-3-evaluator/" target="_blank" style="color: #2d5016;">https://quantis.com</a></li>
        </ul>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 40px;">
          <h3 style="color: #2d5016; margin-bottom: 10px;">Data Currency</h3>
          <p style="margin-bottom: 10px;">All emission factors are based on the most recent available data as of December 2025. Factors are primarily from 2023 datasets, which represent the latest standardized emission factors published by regulatory agencies.</p>
          <p>This tool is updated periodically to incorporate new emission factors as they become available from authoritative sources.</p>
        </div>
        
        <div style="margin-top: 40px;">
          <button onclick="showResultsPageFromSources()" style="background: #2d5016; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-right: 10px;">← Back to Results</button>
          <button onclick="window.print()" style="background: #6c757d; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">Print Sources</button>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.insertAdjacentHTML('beforeend', sourcesHTML);
  window.scrollTo(0, 0);
}

function showResultsPageFromSources() {
  // Remove sources page
  const sourcesPage = document.getElementById('sources-page');
  if (sourcesPage) {
    sourcesPage.remove();
  }
  
  // Show results page
  const resultsPage = document.getElementById('results-page');
  if (resultsPage) {
    resultsPage.classList.remove('hidden');
    window.scrollTo(0, 0);
  }
}