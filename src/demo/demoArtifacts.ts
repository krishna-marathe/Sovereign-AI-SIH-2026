export type DemoArtifactTemplate = {
  name: string;
  type: "PDF" | "CSV" | "DOCX" | "CODE" | "CAD" | "XLSX";
  project: string;
  createdBy: string;
  classification: "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  contentPreview: string;
  codeContent?: string;
};

export const artifactTemplates: Record<string, DemoArtifactTemplate> = {
  "risk-assessment": {
    name: "P102_Risk_Assessment.pdf",
    type: "PDF",
    project: "P-102 Pump Maintenance Study",
    createdBy: "Engineering Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "Risk Assessment Report — Pump P-102A\n\nRisk Level: HIGH\nProbability: 4/5 (Likely within 6 months)\nConsequence: 3/5 (Major)\nRisk Score: 12/25\n\nFindings:\n• Bearing vibration 15.5% above ACTION threshold\n• Seal leakage with overdue inspection\n• Progressive degradation trend\n\nRecommendation: Immediate planned shutdown for bearing replacement and seal overhaul.",
  },
  "sop-comparison": {
    name: "SOP_Compliance_Report.pdf",
    type: "PDF",
    project: "CDU-4 Inspection Analysis",
    createdBy: "HSE/Inspection Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "SOP Compliance Report — P-102\n\nDeviation 1: Bearing vibration at 8.2 mm/s exceeds ACTION threshold of 7.1 mm/s\nDeviation 2: Mechanical seal inspection overdue by 68 days\n\nRequired Actions:\n1. Generate Maintenance Work Order (Priority: HIGH)\n2. Isolate P-102A and switch to P-102B standby\n3. Schedule seal overhaul within 7 days",
  },
  "deviation-report": {
    name: "Maintenance_Deviation_Report.pdf",
    type: "PDF",
    project: "CDU-4 Inspection Analysis",
    createdBy: "HSE/Inspection Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "Maintenance Deviation Detection Report\n\n3 deviations detected against SOP Rev 3.2:\n\n1. [CRITICAL] Vibration exceedance — 8.2 mm/s vs 7.1 mm/s threshold\n2. [MAJOR] Seal inspection overdue — 250 days vs 180-day interval\n3. [MINOR] Flush fluid flow rate below specification — 1.2 L/min vs 1.5 L/min\n\nCorrectiveAction Plan attached as Appendix A.",
  },
  "turnaround-plan": {
    name: "Turnaround_Plan_2027_v1.pdf",
    type: "PDF",
    project: "Annual Turnaround Planning 2027",
    createdBy: "Research Agent",
    classification: "RESTRICTED",
    contentPreview: "CDU-4 Annual Turnaround Plan — 2027\n\nDuration: 28 days (Q1 2027)\nCritical Path: Column internals → HX bundle replacement → Catalyst changeout\nPersonnel: 225 total\nEstimated Cost: ₹42.5 Cr (±15%)\n\nResource Allocation:\n• Phase 1 (Days 1-7): Shutdown and isolation\n• Phase 2 (Days 8-18): Major maintenance activities\n• Phase 3 (Days 19-25): Reassembly and testing\n• Phase 4 (Days 26-28): Startup and commissioning",
  },
  "vendor-evaluation": {
    name: "Vendor_Evaluation_CX4.pdf",
    type: "PDF",
    project: "Vendor Technical Evaluation — CX-4",
    createdBy: "Research Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "Vendor Technical Evaluation — CX-4 Heat Exchanger\n\nRecommendation: Vendor A (Alfa Laval)\n\nScoring:\n• Alfa Laval: 92% technical compliance, ₹1.85 Cr\n• GEA Group: 87% compliance, ₹1.78 Cr\n• SPX Flow: 78% compliance, ₹1.62 Cr\n\nAlfa Laval selected for superior technical compliance despite 4% cost premium.",
  },
  "engineering-report": {
    name: "P102_Engineering_Analysis.pdf",
    type: "PDF",
    project: "CDU-4 Inspection Analysis",
    createdBy: "Engineering Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "Engineering Analysis Report — P-102 Vibration Assessment\n\nAnalysis: Bearing vibration at 8.2 mm/s exceeds SOP threshold of 7.1 mm/s by 15.5%.\nHistorical trend: Progressive degradation over 3 inspection cycles (2024-2026).\nRisk Assessment: HIGH\n\nRecommendation: Immediate maintenance intervention.\nEstimated downtime: 72 hours.\n\n⚠ AI-GENERATED — ENGINEERING REVIEW REQUIRED",
  },
  "engineering-drawing": {
    name: "MRPL-CDU4-PID-012.cad",
    type: "CAD",
    project: "CDU-4 Inspection Analysis",
    createdBy: "Engineering Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "P&ID Schematic — CDU-4 Reflux Pump Circuit\n\nEquipment: P-102A, P-102B (Standby)\nControl Valves: FV-102, FV-103\nInstrumentation: PI-301, PI-302, FI-102\nStandard: ISA 5.1\n\n⚠ AI-GENERATED PRELIMINARY DRAFT — NOT FOR CONSTRUCTION\nEngineering review and certification required before operational use.",
  },
  "coding-output": {
    name: "pump_analysis_fix.py",
    type: "CODE",
    project: "CDU-4 Inspection Analysis",
    createdBy: "Coding Agent",
    classification: "INTERNAL",
    contentPreview: "Bug fix for threshold validation in pump analysis module",
    codeContent: `import pandas as pd
import numpy as np
from typing import List, Dict

class PumpEfficiencyAnalyzer:
    """Analyzes pump telemetry data against SOP thresholds."""

    def __init__(self, threshold: float = 7.1):
        self.threshold = threshold
        self.data_cache: List[pd.DataFrame] = []

    def process_telemetry(self, raw_data: List[Dict]) -> pd.DataFrame:
        """Process raw telemetry data into a structured DataFrame."""
        df = pd.DataFrame(raw_data)
        if df.empty:
            raise ValueError("No telemetry data provided")
        df["efficiency_score"] = df["flow_rate"] / (df["power_kw"] + 1e-5)
        self.data_cache.append(df)
        return df

    def check_anomalies(self, df: pd.DataFrame) -> List[str]:
        """Check for threshold exceedances — fixed >= comparison."""
        anomalies = []
        for idx, row in df.iterrows():
            if row["vibration_mms"] >= self.threshold:  # Fixed: was > instead of >=
                anomalies.append(
                    f"High vibration at index {idx}: {row['vibration_mms']} mm/s"
                )
        return anomalies

    def generate_report(self, df: pd.DataFrame) -> Dict:
        """Generate summary report from telemetry data."""
        return {
            "max_vibration": float(df["vibration_mms"].max()),
            "mean_vibration": float(df["vibration_mms"].mean()),
            "threshold_exceeded": bool(df["vibration_mms"].max() >= self.threshold),
            "exceedance_pct": round(
                (float(df["vibration_mms"].max()) - self.threshold) / self.threshold * 100, 2
            ),
            "total_records": len(df),
            "anomaly_count": len(self.check_anomalies(df)),
        }


def run_test_cases():
    """Run validation test cases."""
    analyzer = PumpEfficiencyAnalyzer()
    test_data = [
        {"flow_rate": 120, "power_kw": 15, "vibration_mms": 6.2},
        {"flow_rate": 115, "power_kw": 16, "vibration_mms": 8.5},
        {"flow_rate": 110, "power_kw": 14, "vibration_mms": 7.1},  # Edge case: exactly at threshold
        {"flow_rate": 108, "power_kw": 15, "vibration_mms": 4.1},
    ]

    df = analyzer.process_telemetry(test_data)
    report = analyzer.generate_report(df)
    anomalies = analyzer.check_anomalies(df)

    print(f"Processed {report['total_records']} records.")
    print(f"Max vibration: {report['max_vibration']} mm/s")
    print(f"Threshold exceeded: {report['threshold_exceeded']}")
    print(f"Detected {report['anomaly_count']} anomalies.")
    for a in anomalies:
        print(f"  - {a}")

    # Assertions
    assert report["threshold_exceeded"] is True
    assert report["anomaly_count"] == 2  # 8.5 and 7.1 (edge case)
    assert report["max_vibration"] == 8.5
    print("\\nAll test cases PASSED ✓")
    return True


if __name__ == "__main__":
    run_test_cases()`,
  },
  "multimodal-report": {
    name: "Multimodal_Inspection_Report.pdf",
    type: "PDF",
    project: "CDU-4 Inspection Analysis",
    createdBy: "Engineering Agent",
    classification: "CONFIDENTIAL",
    contentPreview: "Multimodal Inspection Document Analysis Report\n\nSources analyzed:\n• 3 PDF inspection reports\n• 12 inspection photographs\n• 2 thermal imaging captures\n• 1 ultrasonic thickness survey\n\nFindings:\n• Corrosion detected on Trays 14-18 (Grade 3/5)\n• Thermal anomaly at bearing housing (ΔT = 12°C above baseline)\n• Wall thickness within acceptable limits (min 6.2mm vs 5.0mm minimum)\n\nRisk Level: MEDIUM\nRecommendation: Schedule tray replacement during next turnaround.",
  },
};
