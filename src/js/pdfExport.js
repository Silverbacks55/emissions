// pdfExport.js - Generate PDF report

function generatePDFReport(results, formData) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const forestGreen = [45, 80, 22];
  const lightGray = [108, 117, 125];
  const black = [26, 26, 26];
  
  let yPos = 20;
  const leftMargin = 20;
  const pageWidth = 190;
  
  // Helper function to add new page if needed
  function checkPageBreak(neededSpace) {
    if (yPos + neededSpace > 280) {
      doc.addPage();
      yPos = 20;
    }
  }
  
// TITLE
  doc.setFontSize(24);
  doc.setTextColor(...forestGreen);
  doc.text('GBB Strategy', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  doc.setFontSize(16);
  doc.setTextColor(...black);
  doc.text('Carbon Footprint Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  // Company name and date
  doc.setFontSize(12);
  doc.setTextColor(...lightGray);
  const companyName = formData.companyBasics.industry.replace(/_/g, ' ').toUpperCase();
  doc.text(`${companyName} | ${new Date().toLocaleDateString()}`, leftMargin, yPos);
  yPos += 15;
  
  // EXECUTIVE SUMMARY
  doc.setFontSize(16);
  doc.setTextColor(...forestGreen);
  doc.text('Executive Summary', leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(...black);
  
  // Total emissions box
  doc.setFillColor(248, 249, 250);
  doc.rect(leftMargin, yPos, pageWidth, 25, 'F');
  doc.setFontSize(20);
  doc.setTextColor(...forestGreen);
  doc.text(`${results.summary.total.toLocaleString()} tCO₂e`, leftMargin + 5, yPos + 10);
  doc.setFontSize(10);
  doc.setTextColor(...lightGray);
  doc.text('Total Annual Emissions', leftMargin + 5, yPos + 18);
  yPos += 30;
  
  // Scope breakdown
  doc.setFontSize(11);
  doc.setTextColor(...black);
  doc.text(`Scope 1 (Direct): ${results.summary.scope1.toLocaleString()} tCO₂e (${((results.summary.scope1/results.summary.total)*100).toFixed(1)}%)`, leftMargin, yPos);
  yPos += 7;
  doc.text(`Scope 2 (Electricity): ${results.summary.scope2.toLocaleString()} tCO₂e (${((results.summary.scope2/results.summary.total)*100).toFixed(1)}%)`, leftMargin, yPos);
  yPos += 7;
  doc.text(`Scope 3 (Value Chain): ${results.summary.scope3.toLocaleString()} tCO₂e (${((results.summary.scope3/results.summary.total)*100).toFixed(1)}%)`, leftMargin, yPos);
  yPos += 15;
  
  checkPageBreak(40);
  
  // INTENSITY METRICS
  doc.setFontSize(14);
  doc.setTextColor(...forestGreen);
  doc.text('Intensity Metrics', leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(...black);
  doc.text(`Per Employee: ${results.intensityMetrics.perEmployee.toLocaleString(undefined, {maximumFractionDigits: 2})} tCO₂e`, leftMargin, yPos);
  yPos += 7;
  doc.text(`Per $M Revenue: ${results.intensityMetrics.perRevenue.toLocaleString(undefined, {maximumFractionDigits: 1})} tCO₂e`, leftMargin, yPos);
  yPos += 15;
  
  checkPageBreak(40);
  
  // INDUSTRY COMPARISON
  doc.setFontSize(14);
  doc.setTextColor(...forestGreen);
  doc.text('Industry Comparison', leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(...black);
  doc.text(`Your Company: ${results.industryComparison.companyTotal.toLocaleString()} tCO₂e`, leftMargin, yPos);
  yPos += 7;
  doc.text(`Industry Average: ${results.industryComparison.industryAverage.toLocaleString()} tCO₂e`, leftMargin, yPos);
  yPos += 7;
  doc.text(`Variance: ${results.industryComparison.variance.toFixed(1)}% (${results.industryComparison.interpretation})`, leftMargin, yPos);
  yPos += 15;
  
  checkPageBreak(80);
  
  // SCOPE 3 BREAKDOWN
  doc.setFontSize(14);
  doc.setTextColor(...forestGreen);
  doc.text('Scope 3 Breakdown by Category', leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setTextColor(...black);
  
  const scope3Categories = [
    { name: 'Cat 1: Purchased Goods & Services', value: results.breakdown.scope3.purchasedGoods },
    { name: 'Cat 2: Capital Goods', value: results.breakdown.scope3.capitalGoods },
    { name: 'Cat 3: Fuel & Energy Related', value: results.breakdown.scope3.fuelEnergy },
    { name: 'Cat 4: Upstream Transport', value: results.breakdown.scope3.upstreamTransport },
    { name: 'Cat 5: Waste', value: results.breakdown.scope3.waste },
    { name: 'Cat 6: Business Travel', value: results.breakdown.scope3.businessTravel },
    { name: 'Cat 7: Employee Commuting', value: results.breakdown.scope3.commuting },
    { name: 'Cat 9: Downstream Transport', value: results.breakdown.scope3.downstreamTransport },
    { name: 'Cat 11: Use of Sold Products', value: results.breakdown.scope3.useOfProducts },
    { name: 'Cat 12: End-of-Life', value: results.breakdown.scope3.endOfLife },
    { name: 'Cat 15: Investments', value: results.breakdown.scope3.investments }
  ];
  
  // Table header
  doc.setFillColor(...forestGreen);
  doc.rect(leftMargin, yPos, pageWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Category', leftMargin + 2, yPos + 5);
  doc.text('Emissions (tCO₂e)', leftMargin + 100, yPos + 5);
  doc.text('% of Scope 3', leftMargin + 150, yPos + 5);
  yPos += 10;
  
  doc.setTextColor(...black);
  scope3Categories.forEach((cat, index) => {
    checkPageBreak(8);
    
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250);
      doc.rect(leftMargin, yPos - 4, pageWidth, 7, 'F');
    }
    
    const percent = results.summary.scope3 > 0 ? ((cat.value / results.summary.scope3) * 100).toFixed(1) : 0;
    doc.text(cat.name, leftMargin + 2, yPos);
    doc.text(cat.value.toLocaleString(undefined, {maximumFractionDigits: 1}), leftMargin + 100, yPos);
    doc.text(`${percent}%`, leftMargin + 150, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  checkPageBreak(30);
  
  // CONFIDENCE SCORE
  doc.setFontSize(14);
  doc.setTextColor(...forestGreen);
  doc.text('Data Confidence', leftMargin, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setTextColor(...black);
  doc.text(`Confidence Level: ${results.confidence.level} (${results.confidence.score}%)`, leftMargin, yPos);
  yPos += 7;
  doc.text(`Based on ${results.confidence.questionsAnswered} of ${results.confidence.totalQuestions} data points`, leftMargin, yPos);
  yPos += 15;
  
  // FOOTER
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Generated by Directional Emissions Tool | Page ${i} of ${pageCount}`, leftMargin, 285);
  }
  
  // Save PDF
  const fileName = `carbon-footprint-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}