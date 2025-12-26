// resultsDisplay.js - Display calculation results

function calculateAndShowResults(formData) {
  console.log('Calculating results...');
  
  // Show loading state
  showLoadingState();
  
  // Run calculation (with small delay to show loading)
  setTimeout(() => {
    const results = calculateFootprint(formData, EMISSION_FACTORS);
    
    // Hide loading
    hideLoadingState();
    
    console.log('Results:', results);
    
    // Hide form wizard
    document.getElementById('form-wizard').classList.add('hidden');
    
    // Show results page
    showResultsPage(results, formData);
  }, 2500);
}

function showResultsPage(results, formData) {
// Store results for PDF generation
  window.lastResults = results;
  window.lastFormData = formData;
  // Create results container
  const resultsHTML = `
    <div id="results-page" class="page-container">
      <div style="background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 30px;">
        <h1 style="color: #2d5016; margin-bottom: 20px;">Your Carbon Footprint Results</h1>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="font-size: 3rem; color: #2d5016; margin: 0;">${results.summary.total.toLocaleString()} tCO₂e</h2>
          <p style="color: #6c757d; margin: 10px 0 0 0;">Total Annual Emissions</p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2d5016; font-size: 1.5rem; margin: 0;">${results.summary.scope1.toLocaleString()}</h3>
            <p style="color: #6c757d; margin: 5px 0 0 0;">Scope 1 (${((results.summary.scope1/results.summary.total)*100).toFixed(0)}%)</p>
            <p style="font-size: 0.875rem; color: #6c757d;">Direct emissions</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2d5016; font-size: 1.5rem; margin: 0;">${results.summary.scope2.toLocaleString()}</h3>
            <p style="color: #6c757d; margin: 5px 0 0 0;">Scope 2 (${((results.summary.scope2/results.summary.total)*100).toFixed(0)}%)</p>
            <p style="font-size: 0.875rem; color: #6c757d;">Purchased electricity</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2d5016; font-size: 1.5rem; margin: 0;">${results.summary.scope3.toLocaleString()}</h3>
            <p style="color: #6c757d; margin: 5px 0 0 0;">Scope 3 (${((results.summary.scope3/results.summary.total)*100).toFixed(0)}%)</p>
            <p style="font-size: 0.875rem; color: #6c757d;">Value chain</p>
          </div>
        </div>
<div id="scope3Breakdown">
        <h3 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Intensity Metrics</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p style="color: #6c757d; margin: 0;">Per Employee</p>
            <h3 style="color: #2d5016; margin: 5px 0 0 0;">${results.intensityMetrics.perEmployee.toLocaleString(undefined, {maximumFractionDigits: 2})} tCO₂e</h3>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p style="color: #6c757d; margin: 0;">Per $M Revenue</p>
            <h3 style="color: #2d5016; margin: 5px 0 0 0;">${results.intensityMetrics.perRevenue.toLocaleString()} tCO₂e</h3>
          </div>
        </div>
        
<h3 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Scope 3 Breakdown by Category</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 2px solid #2d5016;">
              <th style="text-align: left; padding: 10px; color: #2d5016;">Category</th>
              <th style="text-align: right; padding: 10px; color: #2d5016;">Emissions (tCO₂e)</th>
              <th style="text-align: right; padding: 10px; color: #2d5016;">% of Scope 3</th>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 1: Purchased Goods & Services</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.purchasedGoods.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.purchasedGoods/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 2: Capital Goods</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.capitalGoods.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.capitalGoods/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 3: Fuel & Energy Related</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.fuelEnergy.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.fuelEnergy/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 5: Waste</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.waste.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.waste/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 6: Business Travel</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.businessTravel.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.businessTravel/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 7: Employee Commuting</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.commuting.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.commuting/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 9: Downstream Transport</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.downstreamTransport.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.downstreamTransport/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 11: Use of Sold Products</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.useOfProducts.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.useOfProducts/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px;">Cat 12: End-of-Life</td>
              <td style="text-align: right; padding: 10px;">${results.breakdown.scope3.endOfLife.toLocaleString()}</td>
              <td style="text-align: right; padding: 10px;">${((results.breakdown.scope3.endOfLife/results.summary.scope3)*100).toLocaleString()}%</td>
            </tr>
           
          </table>
</table>
          
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
          <strong>Note:</strong> Categories 4 (Upstream Transport), 8 (Upstream Leased Assets), 10 (Processing of Sold Products), 13 (Downstream Leased Assets), 14 (Franchises), and 15 (Investments) are not included as they apply to specific business models and require detailed operational data not captured in this screening-level assessment.
          </div>
        </div>
        </div>
</div>
<h3 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Emissions by Scope</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; max-width: 500px; margin-left: auto; margin-right: auto;">
          <canvas id="scopePieChart"></canvas>
        </div>
        
 <div id="scope3Chart">
<h3 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Scope 3 Categories</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: block;">
          <canvas id="scope3BarChart" style="display: block;"></canvas>
        </div>
</div>
        <h3 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Industry Comparison</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <p><strong>Your Company:</strong> ${results.industryComparison.companyTotal.toLocaleString()} tCO₂e</p>
<p><strong>Industry Average:</strong> ${results.industryComparison.industryAverage.toLocaleString()} tCO₂e</p>
          <p><strong>Variance:</strong> ${results.industryComparison.variance.toLocaleString()}% (${results.industryComparison.interpretation})</p>
        </div>
        
        <h3 style="color: #2d5016; margin-top: 30px; margin-bottom: 15px;">Confidence Level</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>${results.confidence.level}</strong> (${results.confidence.score}%)</p>
          <p style="color: #6c757d; margin: 10px 0 0 0;">Based on ${results.confidence.questionsAnswered} of ${results.confidence.totalQuestions} data points</p>
        </div>
        
  <div style="margin-top: 40px;">
          <button onclick="window.location.reload()" style="background: #2d5016; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-right: 10px;">Start New Assessment</button>
        <button id="pdfDownloadBtn" onclick="handlePDFDownload()" style="background: #ffc107; color: #1a1a1a; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-right: 10px;">Download PDF Report</button>
<button onclick="showMethodologyPage(window.lastResults)" style="background: #6c757d; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-right: 10px;">View Methodology</button>
          <button onclick="showSourcesPage()" style="background: #6c757d; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">View Sources</button>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.insertAdjacentHTML('beforeend', resultsHTML);
  
  // Scroll to top
  window.scrollTo(0, 0);
// Create charts after HTML is added to page
  setTimeout(() => {
    createScopePieChart(results);
    createScope3BarChart(results);
  }, 100);
}
// Create pie chart for Scope 1, 2, 3
function createScopePieChart(results) {
  const ctx = document.getElementById('scopePieChart');
  if (!ctx) return;
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Scope 1 (Direct)', 'Scope 2 (Electricity)', 'Scope 3 (Value Chain)'],
      datasets: [{
        data: [
          results.summary.scope1,
          results.summary.scope2,
          results.summary.scope3
        ],
        backgroundColor: [
          '#2d5016',  // Forest green
          '#90c695',  // Light green
          '#ffc107'   // Yellow
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
       legend: {
          position: 'bottom',
          labels: {
            font: {
              size: window.innerWidth < 768 ? 10 : 12
            },
            padding: window.innerWidth < 768 ? 10 : 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percent = ((value / total) * 100).toFixed(1);
              return `${label}: ${value.toLocaleString()} tCO₂e (${percent}%)`;
            }
          }
        }
      }
    }
  });
}

// Create bar chart for Scope 3 categories (desktop only)
function createScope3BarChart(results) {
  const ctx = document.getElementById('scope3BarChart');
  if (!ctx) return;
  
  // Hide on mobile
  if (window.innerWidth < 768) {
    ctx.parentElement.style.display = 'none';
    return;
  }
  
  const categories = [
    'Purchased Goods',
    'Capital Goods',
    'Fuel & Energy',
    'Waste',
    'Business Travel',
    'Commuting',
    'Downstream Transport',
    'Use of Products',
    'End-of-Life',
  ];
  
  const data = [
    results.breakdown.scope3.purchasedGoods,
    results.breakdown.scope3.capitalGoods,
    results.breakdown.scope3.fuelEnergy,
    results.breakdown.scope3.waste,
    results.breakdown.scope3.businessTravel,
    results.breakdown.scope3.commuting,
    results.breakdown.scope3.downstreamTransport,
    results.breakdown.scope3.useOfProducts,
    results.breakdown.scope3.endOfLife,
  ];
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Emissions (tCO₂e)',
        data: data,
        backgroundColor: '#2d5016',
        borderColor: '#1a3310',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        },
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 11
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.parsed.y.toLocaleString()} tCO₂e`;
            }
          }
        }
      }
    }
  });
}
function showLoadingState() {
  const loadingHTML = `
    <div id="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
      <div style="background: white; padding: 40px; border-radius: 8px; text-align: center;">
        <div style="width: 50px; height: 50px; border: 5px solid #f8f9fa; border-top: 5px solid #2d5016; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <h2 style="color: #2d5016; margin: 0;">Calculating your footprint...</h2>
        <p style="color: #6c757d; margin-top: 10px;">This will take just a moment</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoadingState() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.remove();
  }
}
function handlePDFDownload() {
  const btn = document.getElementById('pdfDownloadBtn');
  const originalText = btn.textContent;
  
  // Show loading state
  btn.textContent = 'Generating PDF...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  btn.style.cursor = 'wait';
  
  // Use setTimeout to allow UI to update before heavy PDF generation
  setTimeout(() => {
    try {
      generatePDFReport(window.lastResults, window.lastFormData);
    } finally {
      // Reset button state after a short delay
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      }, 1000);
    }
  }, 100);
}