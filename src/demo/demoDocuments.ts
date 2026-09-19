export type DemoDocument = {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "CSV" | "XLSX" | "DWG";
  pages: number;
  version: string;
  classification: "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED" | "PUBLIC";
  owner: string;
  department: string;
  lastModified: string;
  sections: DocumentSection[];
};

export type DocumentSection = {
  page: number;
  title: string;
  content: string;
};

export const demoDocuments: DemoDocument[] = [
  {
    id: "doc-sop-p102",
    name: "Inspection SOP — Pump P-102",
    type: "PDF",
    pages: 24,
    version: "3.2",
    classification: "CONFIDENTIAL",
    owner: "Rajesh Kumar",
    department: "Maintenance Engineering",
    lastModified: "12 Mar 2026",
    sections: [
      {
        page: 1,
        title: "1. Purpose and Scope",
        content: "This Standard Operating Procedure (SOP) defines the inspection, testing, and maintenance requirements for centrifugal pump P-102 (Feed Transfer Pump) in the CDU-4 unit at MRPL. This SOP applies to both P-102A (primary) and P-102B (standby) pump assemblies.",
      },
      {
        page: 5,
        title: "4.2 Vibration Monitoring Thresholds",
        content: "Bearing vibration measurements shall be taken at the Drive End (DE) and Non-Drive End (NDE) positions using calibrated accelerometers.\n\n• ALERT threshold: 5.6 mm/s RMS\n• ACTION threshold: 7.1 mm/s RMS\n• TRIP threshold: 11.2 mm/s RMS\n\nWhen ACTION threshold is exceeded, immediate isolation and maintenance work order generation is required per Section 6.3.",
      },
      {
        page: 8,
        title: "5.1 Mechanical Seal Inspection",
        content: "Mechanical seal inspection shall be conducted at intervals not exceeding 6 months. Inspection checklist:\n\n• Visual inspection for leakage at seal faces\n• Flush fluid flow rate verification\n• Temperature differential across seal chamber\n• Seal chamber pressure monitoring\n\nAny visible leakage constitutes a CRITICAL finding requiring immediate attention.",
      },
      {
        page: 14,
        title: "6.3 Corrective Action Requirements",
        content: "Upon detection of any ACTION-level threshold exceedance:\n\n1. Notify Shift Supervisor within 30 minutes\n2. Generate Maintenance Work Order (Priority: HIGH)\n3. Isolate affected pump and switch to standby\n4. Conduct root cause analysis within 48 hours\n5. Document findings in inspection report",
      },
    ],
  },
  {
    id: "doc-inspection-aug2026",
    name: "P-102 Inspection Report — August 2026",
    type: "PDF",
    pages: 18,
    version: "1.0",
    classification: "CONFIDENTIAL",
    owner: "Anita Rao",
    department: "Process Engineering",
    lastModified: "28 Aug 2026",
    sections: [
      {
        page: 1,
        title: "Executive Summary",
        content: "This report documents the findings from the scheduled inspection of Pump P-102A conducted on 26 August 2026. The inspection identified two critical deviations from the approved SOP Rev 3.2. Immediate corrective action is recommended.",
      },
      {
        page: 4,
        title: "3.1 Vibration Measurements",
        content: "Vibration readings taken at Drive End (DE) bearing position:\n\n• Radial (horizontal): 7.8 mm/s RMS\n• Radial (vertical): 8.2 mm/s RMS ← EXCEEDS ACTION THRESHOLD\n• Axial: 4.1 mm/s RMS\n\nThe vertical radial reading of 8.2 mm/s exceeds the SOP ACTION threshold of 7.1 mm/s by 15.5%. Historical trend shows progressive increase from 5.4 mm/s (Jan 2025) → 6.8 mm/s (Aug 2025) → 8.2 mm/s (Aug 2026).",
      },
      {
        page: 7,
        title: "3.3 Mechanical Seal Condition",
        content: "Visual inspection revealed active leakage at the primary mechanical seal face. Estimated leak rate: 2-3 drops per minute. Flush fluid flow rate measured at 1.2 L/min (specification: 1.5-2.0 L/min).\n\nLast seal inspection: 19 December 2025 (250 days ago — overdue by 68 days against 6-month interval requirement).",
      },
      {
        page: 12,
        title: "4. Risk Assessment",
        content: "Risk Level: HIGH\n\nBased on the combination of bearing vibration exceedance and seal leakage, this pump is at elevated risk of catastrophic failure. Historical data from similar pump failures at MRPL (P-205 in 2023) showed similar precursor patterns 4-6 weeks before bearing collapse.\n\nRecommendation: Schedule immediate planned shutdown for bearing replacement and seal overhaul. Estimated downtime: 72 hours.",
      },
    ],
  },
  {
    id: "doc-vibration-limits",
    name: "MRPL Equipment Vibration Limits",
    type: "PDF",
    pages: 12,
    version: "2.1",
    classification: "INTERNAL",
    owner: "Suresh Bhat",
    department: "Inspection Engineering",
    lastModified: "04 Jan 2026",
    sections: [
      {
        page: 1,
        title: "1. Scope",
        content: "This document establishes the vibration severity criteria for rotating equipment at MRPL Mangalore Refinery, based on ISO 10816-3:2009 and site-specific operating experience.",
      },
      {
        page: 3,
        title: "2.2 Centrifugal Pumps — Group 2",
        content: "For centrifugal pumps rated 15-75 kW (Group 2 per ISO 10816-3):\n\nZone A (Good): 0 – 3.5 mm/s\nZone B (Acceptable): 3.5 – 7.1 mm/s\nZone C (Alert): 7.1 – 11.0 mm/s\nZone D (Danger): > 11.0 mm/s\n\nPumps operating in Zone C require root cause investigation and planned corrective action within 30 days. Zone D requires immediate shutdown.",
      },
      {
        page: 6,
        title: "3.1 Trending Requirements",
        content: "Vibration trend data shall be maintained for all critical rotating equipment. Minimum trending frequency:\n\n• Critical pumps: Monthly\n• Essential pumps: Quarterly\n• General service: Semi-annually\n\nTrend analysis shall identify rate-of-change and predict Zone C/D entry dates to enable proactive maintenance scheduling.",
      },
    ],
  },
  {
    id: "doc-maintenance-log",
    name: "CDU-4 Maintenance Log 2026",
    type: "XLSX",
    pages: 1,
    version: "—",
    classification: "INTERNAL",
    owner: "Arvind Rao",
    department: "Operations",
    lastModified: "16 Sep 2026",
    sections: [
      {
        page: 1,
        title: "Maintenance Records",
        content: "Recent entries for P-102:\n\nWO-2026-0342 | 28 Aug 2026 | Scheduled Inspection | Completed | Vibration exceedance noted\nWO-2026-0298 | 15 Jul 2026 | Lubrication Service | Completed | Normal\nWO-2026-0187 | 02 May 2026 | Alignment Check | Completed | Minor misalignment corrected\nWO-2025-0891 | 19 Dec 2025 | Seal Inspection | Completed | No leakage at time of inspection\nWO-2025-0654 | 18 Aug 2025 | Scheduled Inspection | Completed | Vibration 6.8 mm/s (within limits)",
      },
    ],
  },
  {
    id: "doc-vendor-eval",
    name: "Vendor Technical Evaluation — CX-4 Heat Exchanger",
    type: "PDF",
    pages: 32,
    version: "2.0",
    classification: "CONFIDENTIAL",
    owner: "Priya Nair",
    department: "Procurement",
    lastModified: "14 Sep 2026",
    sections: [
      {
        page: 1,
        title: "1. Evaluation Summary",
        content: "This evaluation assesses three vendor proposals for the CX-4 shell-and-tube heat exchanger replacement. Evaluation criteria include technical compliance, delivery schedule, warranty terms, and total cost of ownership.",
      },
      {
        page: 8,
        title: "3.2 Technical Compliance Matrix",
        content: "Vendor A (Alfa Laval): 92% compliance — meets all critical requirements\nVendor B (GEA Group): 87% compliance — deviation on tube material specification\nVendor C (SPX Flow): 78% compliance — multiple deviations on pressure rating and material\n\nRecommendation: Vendor A (Alfa Laval) for technical compliance. Cost differential within 5% of lowest bid.",
      },
    ],
  },
  {
    id: "doc-turnaround-plan",
    name: "Annual Turnaround Plan 2027 — CDU-4",
    type: "PDF",
    pages: 48,
    version: "0.3-DRAFT",
    classification: "RESTRICTED",
    owner: "Arvind Rao",
    department: "Maintenance",
    lastModified: "10 Sep 2026",
    sections: [
      {
        page: 1,
        title: "1. Executive Overview",
        content: "This document outlines the preliminary turnaround plan for CDU-4 unit scheduled for Q1 2027. Estimated duration: 28 days. Critical path includes column internals inspection, heat exchanger bundle replacement, and catalyst changeout.",
      },
      {
        page: 12,
        title: "4. Resource Requirements",
        content: "Personnel: 180 contract workers + 45 MRPL staff\nCranes: 2x 100T mobile cranes, 1x 250T crawler crane\nScaffolding: 12,000 m² estimated\nBlind list: 342 blinds identified\nPermits: 85 hot work, 120 cold work, 45 confined space\n\nEstimated cost: ₹42.5 Cr (±15%)",
      },
    ],
  },
  {
    id: "doc-risk-assessment-p102",
    name: "P-102 Risk Assessment — September 2026",
    type: "PDF",
    pages: 15,
    version: "1.0-DRAFT",
    classification: "CONFIDENTIAL",
    owner: "Engineering Agent",
    department: "Process Engineering",
    lastModified: "16 Sep 2026",
    sections: [
      {
        page: 1,
        title: "Risk Assessment Summary",
        content: "Equipment: Pump P-102A (Feed Transfer Pump, CDU-4)\nRisk Level: HIGH\nProbability: 4/5 (Likely within 6 months)\nConsequence: 3/5 (Major — unplanned outage, potential safety incident)\nRisk Score: 12/25\n\nKey risk factors:\n• Bearing vibration 15.5% above ACTION threshold\n• Seal leakage with overdue inspection\n• Progressive degradation trend over 3 inspection cycles",
      },
    ],
  },
];

export function getDocumentById(id: string): DemoDocument | undefined {
  return demoDocuments.find((d) => d.id === id);
}

export function getArtifactAsDocument(artifactKey: string, artifactTemplate: any): DemoDocument {
  return {
    id: `art-${artifactKey}`,
    name: artifactTemplate.name,
    type: artifactTemplate.type as any,
    pages: 1,
    version: "1.0",
    classification: artifactTemplate.classification,
    owner: artifactTemplate.createdBy,
    department: artifactTemplate.project,
    lastModified: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    sections: [
      {
        page: 1,
        title: "Generated Content",
        content: artifactTemplate.contentPreview,
      },
    ],
  };
}
