import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'documents');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function createReportPdf() {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outDir, 'p102-inspection-report.pdf')));
  
  // Page 1
  doc.fontSize(20).text('P-102 Inspection Report — August 2026', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text('Executive Summary');
  doc.fontSize(12).text('This report documents the findings from the scheduled inspection of Pump P-102A conducted on 26 August 2026. The inspection identified two critical deviations from the approved SOP Rev 3.2. Immediate corrective action is recommended.');
  
  // Page 2, 3 (skip)
  doc.addPage();
  doc.addPage();
  
  // Page 4
  doc.addPage();
  doc.fontSize(14).text('3.1 Vibration Measurements');
  doc.fontSize(12).text('Vibration readings taken at Drive End (DE) bearing position:\n\n• Radial horizontal: 7.8 mm/s RMS\n• Radial vertical: 8.2 mm/s RMS (EXCEEDS ACTION THRESHOLD)\n• Axial: 4.1 mm/s RMS\n\nThe vertical radial reading of 8.2 mm/s exceeds the SOP ACTION threshold of 7.1 mm/s by 15.5%. Historical trend shows progressive increase from 5.4 mm/s -> 6.8 mm/s -> 8.2 mm/s.');
  
  // Page 5, 6
  doc.addPage();
  doc.addPage();
  
  // Page 7
  doc.addPage();
  doc.fontSize(14).text('3.3 Mechanical Seal Condition');
  doc.fontSize(12).text('Visual inspection revealed active leakage at the primary mechanical seal face. Estimated leak rate: 2-3 drops per minute. Flush fluid flow rate measured at 1.2 L/min (specification: 1.5-2.0 L/min).\n\nLast seal inspection: 19 December 2025 (250 days ago — overdue by 68 days against 6-month interval requirement).');
  
  // Page 8, 9, 10, 11
  doc.addPage(); doc.addPage(); doc.addPage(); doc.addPage();
  
  // Page 12
  doc.addPage();
  doc.fontSize(14).text('4. Risk Assessment');
  doc.fontSize(12).text('Risk Level: HIGH\n\nBased on the combination of bearing vibration exceedance and seal leakage, this pump is at elevated risk of catastrophic failure. Historical data from similar pump failures at MRPL (P-205 in 2023) showed similar precursor patterns 4-6 weeks before bearing collapse.\n\nRecommendation: Schedule immediate planned shutdown for bearing replacement and seal overhaul. Estimated downtime: 72 hours.');
  
  doc.end();
}

function createSopPdf() {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outDir, 'p102-inspection-sop.pdf')));
  
  // Page 1
  doc.fontSize(20).text('Inspection SOP — Pump P-102', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text('1. Purpose and Scope');
  doc.fontSize(12).text('This Standard Operating Procedure (SOP) defines the inspection, testing, and maintenance requirements for centrifugal pump P-102 (Feed Transfer Pump) in the CDU-4 unit at MRPL. This SOP applies to both P-102A (primary) and P-102B (standby) pump assemblies.');
  
  // Page 2, 3, 4
  doc.addPage(); doc.addPage(); doc.addPage();
  
  // Page 5
  doc.addPage();
  doc.fontSize(14).text('4.2 Vibration Monitoring Thresholds');
  doc.fontSize(12).text('Bearing vibration measurements shall be taken at the Drive End (DE) and Non-Drive End (NDE) positions using calibrated accelerometers.\n\n• ALERT threshold: 5.6 mm/s RMS\n• ACTION threshold: 7.1 mm/s RMS\n• TRIP threshold: 11.2 mm/s RMS\n\nWhen ACTION threshold is exceeded, immediate isolation and maintenance work order generation is required per Section 6.3.');
  
  // Page 6, 7
  doc.addPage(); doc.addPage();
  
  // Page 8
  doc.addPage();
  doc.fontSize(14).text('5.1 Mechanical Seal Inspection');
  doc.fontSize(12).text('Mechanical seal inspection shall be conducted at intervals not exceeding 6 months. Inspection checklist:\n\n• Visual inspection for leakage at seal faces\n• Flush fluid flow rate verification\n• Temperature differential across seal chamber\n• Seal chamber pressure monitoring\n\nAny visible leakage constitutes a CRITICAL finding requiring immediate attention.');
  
  // Page 9 to 13
  doc.addPage(); doc.addPage(); doc.addPage(); doc.addPage(); doc.addPage();
  
  // Page 14
  doc.addPage();
  doc.fontSize(14).text('6.3 Corrective Action Requirements');
  doc.fontSize(12).text('Upon detection of any ACTION-level threshold exceedance:\n\n1. Notify Shift Supervisor within 30 minutes\n2. Generate Maintenance Work Order (Priority: HIGH)\n3. Isolate affected pump and switch to standby\n4. Conduct root cause analysis within 48 hours\n5. Document findings in inspection report');
  
  doc.end();
}

function createVibrationLimitsPdf() {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outDir, 'mrpl-vibration-limits.pdf')));
  
  // Page 1
  doc.fontSize(20).text('MRPL Equipment Vibration Limits', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text('1. Scope');
  doc.fontSize(12).text('This document establishes the vibration severity criteria for rotating equipment at MRPL Mangalore Refinery, based on ISO 10816-3:2009 and site-specific operating experience.');
  
  // Page 2
  doc.addPage();
  
  // Page 3
  doc.addPage();
  doc.fontSize(14).text('2.2 Centrifugal Pumps — Group 2');
  doc.fontSize(12).text('For centrifugal pumps rated 15-75 kW (Group 2 per ISO 10816-3):\n\nZone A (Good): 0 – 3.5 mm/s\nZone B (Acceptable): 3.5 – 7.1 mm/s\nZone C (Alert): 7.1 – 11.0 mm/s\nZone D (Danger): > 11.0 mm/s\n\nPumps operating in Zone C require root cause investigation and planned corrective action within 30 days. Zone D requires immediate shutdown.');
  
  // Page 4, 5
  doc.addPage(); doc.addPage();
  
  // Page 6
  doc.addPage();
  doc.fontSize(14).text('3.1 Trending Requirements');
  doc.fontSize(12).text('Vibration trend data shall be maintained for all critical rotating equipment. Minimum trending frequency:\n\n• Critical pumps: Monthly\n• Essential pumps: Quarterly\n• General service: Semi-annually\n\nTrend analysis shall identify rate-of-change and predict Zone C/D entry dates to enable proactive maintenance scheduling.');
  
  doc.end();
}

function createArtifactPdf() {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(fs.createWriteStream(path.join(outDir, 'SOP_Compliance_Report.pdf')));
  
  doc.fontSize(20).text('SOP Compliance Report — P-102', { align: 'center' });
  doc.moveDown(2);
  
  doc.fontSize(16).text('Executive Summary');
  doc.moveDown(0.5);
  doc.fontSize(12).text('Deviation 1:\nBearing vibration at 8.2 mm/s exceeds ACTION threshold of 7.1 mm/s.');
  doc.moveDown();
  doc.text('Deviation 2:\nMechanical seal inspection overdue by 68 days.');
  doc.moveDown();
  
  doc.fontSize(14).text('Required Actions:');
  doc.fontSize(12).text('1. Generate Maintenance Work Order — Priority HIGH\n2. Isolate P-102A and switch to P-102B standby\n3. Schedule seal overhaul within 7 days');
  doc.moveDown(2);
  
  doc.fontSize(14).text('Evidence Sources:');
  doc.fontSize(12).text('1. P-102 Inspection Report — August 2026\n2. Inspection SOP — Pump P-102\n3. MRPL Equipment Vibration Limits');
  doc.moveDown(2);
  
  doc.fontSize(10).text('Generated by: HSE / Inspection Agent\nClassification: CONFIDENTIAL\nGeneration Date: 19 September 2026', { align: 'right' });
  
  doc.end();
}

createReportPdf();
createSopPdf();
createVibrationLimitsPdf();
createArtifactPdf();

console.log('PDFs generated successfully in public/documents/');
