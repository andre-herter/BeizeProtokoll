export interface BathMetrics {
  disp_hcl: string;
  disp_fe: string;
  meas_hcl: string;
  meas_fe: string;
}

export interface AcidAnalysisData {
  bath1: BathMetrics;
  bath3: BathMetrics;
}

export type BathId = keyof AcidAnalysisData;
export type MetricField = keyof BathMetrics;
