// methodology.js - Display calculation methodology and assumptions

function showMethodologyPage(results) {
  // Hide results page
  document.getElementById('results-page').classList.add('hidden');
  
  // Create methodology page
  const methodologyHTML = `
    <div id="methodology-page" class="page-container">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h1 style="color: #2d5016; margin-bottom: 20px;">Calculation Methodology</h1>
        <p style="color: #6c757d; margin-bottom: 30px;">This page explains how your carbon footprint was calculated, including data sources, emission factors, and assumptions made.</p>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #ffc107;">
          <strong>Important:</strong> This tool provides directional estimates based on industry averages and standard emission factors. For regulatory reporting or carbon credits, a detailed audit is recommended.
        </div>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Methodology Overview</h2>
        <p style="margin-bottom: 15px;">Your carbon footprint was calculated using the <strong>GHG Protocol Corporate Standard</strong>, the most widely used international framework for corporate emissions accounting.</p>
        
        <h3 style="color: #2d5016; margin-top: 25px; margin-bottom: 10px;">Scope Definitions</h3>
        <ul style="margin-bottom: 20px; line-height: 1.8;">
          <li><strong>Scope 1 (Direct Emissions):</strong> Emissions from sources owned or controlled by your organization (e.g., facility heating, company vehicles)</li>
          <li><strong>Scope 2 (Indirect Emissions - Energy):</strong> Emissions from purchased electricity, steam, heating, and cooling</li>
          <li><strong>Scope 3 (Indirect Emissions - Value Chain):</strong> All other indirect emissions in your value chain, including purchased goods, services, business travel, and product use</li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Data Sources</h2>
        <ul style="margin-bottom: 20px; line-height: 1.8;">
          <li><strong>EPA EEIO v1.3:</strong> Supply Chain GHG Emission Factors (2022 USD basis)</li>
          <li><strong>EPA eGRID 2023:</strong> Grid emission factors by country</li>
          <li><strong>EPA GHG Emission Factors Hub 2025:</strong> Combustion and mobile source factors</li>
          <li><strong>CBECS 2023:</strong> Building energy intensity benchmarks</li>
          <li><strong>DOE 2023:</strong> Electric vehicle energy consumption</li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Detailed Assumptions</h2>
        <p style="margin-bottom: 15px;">Below are the specific assumptions and calculations used for your footprint:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          ${generateAssumptionsTable(results.assumptions)}
        </div>
        
        ${results.warnings.length > 0 ? `
          <h2 style="color: #f97316; margin-top: 30px; margin-bottom: 15px;">⚠️ Warnings & Data Quality Notes</h2>
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            ${results.warnings.map(w => `<p style="margin-bottom: 10px;">• ${w.message}</p>`).join('')}
          </div>
        ` : ''}
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Key Limitations</h2>
        <ul style="margin-bottom: 20px; line-height: 1.8;">
          <li>This tool uses <strong>spend-based</strong> and <strong>average-data</strong> methodologies, which are less accurate than activity-based calculations</li>
          <li>Emission factors are averages and may not reflect your specific suppliers or operations</li>
          <li>Some Scope 3 categories use simplified proxy calculations</li>
          <li>Building energy estimates are based on square footage and building type, not actual utility data</li>
          <li>Fleet emissions use industry averages unless specific mileage data is provided</li>
        </ul>
        
        <h2 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Improving Accuracy</h2>
        <p style="margin-bottom: 10px;">To improve the accuracy of your carbon footprint:</p>
        <ul style="margin-bottom: 30px; line-height: 1.8;">
          <li>Collect actual utility bills (kWh, therms) instead of estimating from square footage</li>
          <li>Track vehicle miles driven by fuel type</li>
          <li>Request emission data from major suppliers</li>
          <li>Use activity-based data (units, miles, kWh) rather than spend-based proxies</li>
          <li>Conduct supplier-specific assessments for high-impact categories</li>
        </ul>
        
        <div style="margin-top: 40px;">
          <button onclick="showResultsPageFromMethodology()" style="background: #2d5016; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-right: 10px;">← Back to Results</button>
          <button onclick="window.print()" style="background: #6c757d; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">Print Methodology</button>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.insertAdjacentHTML('beforeend', methodologyHTML);
  window.scrollTo(0, 0);
}

function generateAssumptionsTable(assumptions) {
  if (!assumptions || assumptions.length === 0) {
    return '<p style="color: #6c757d;">No detailed assumptions recorded.</p>';
  }
  
  let html = '<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">';
  html += '<tr style="border-bottom: 2px solid #2d5016; background: #f8f9fa;">';
  html += '<th style="text-align: left; padding: 10px; color: #2d5016;">Category</th>';
  html += '<th style="text-align: left; padding: 10px; color: #2d5016;">Calculation</th>';
  html += '<th style="text-align: left; padding: 10px; color: #2d5016;">Source</th>';
  html += '</tr>';
  
  assumptions.forEach((assumption, index) => {
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
    html += `<tr style="border-bottom: 1px solid #e9ecef; background: ${bgColor};">`;
    html += `<td style="padding: 10px; vertical-align: top;"><strong>${assumption.category}</strong></td>`;
    html += `<td style="padding: 10px; vertical-align: top;">${assumption.assumption}</td>`;
    html += `<td style="padding: 10px; vertical-align: top; color: #6c757d;">${assumption.source}</td>`;
    html += '</tr>';
  });
  
  html += '</table>';
  return html;
}

function showResultsPageFromMethodology() {
  // Remove methodology page
  const methodPage = document.getElementById('methodology-page');
  if (methodPage) {
    methodPage.remove();
  }
  
  // Show results page
  const resultsPage = document.getElementById('results-page');
  if (resultsPage) {
    resultsPage.classList.remove('hidden');
    window.scrollTo(0, 0);
  }
}