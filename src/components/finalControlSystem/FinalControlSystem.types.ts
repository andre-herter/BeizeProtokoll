export interface FinalControlFormData {
  time: string;
  displayedPh: string;
  displayedTemp: string;
  measuredPh: string;
  measuredTemp: string;
  wastewaterCounter: string;
}

export interface FinalControlProps {
  initialValues?: Partial<FinalControlFormData>;
  onFormChange?: (data: FinalControlFormData) => void;
}
