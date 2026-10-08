import type { ChangeEvent } from "react";

export type DisabledField =
  | "display_ec"
  | "sample_ec"
  | "display_ph"
  | "sample_ph";

export interface FlushingSystemRowConfig {
  id: string;
  label: string;
  placeholderEc?: string;
  inputCountDisplayEc?: number;
  inputCountDisplayPh?: number;
  disabledFields?: DisabledField[];
  toleranceEc?: number;
  tolerancePh?: number;
}

export interface FlushingSystemRowData {
  display_ec: string | string[];
  sample_ec: string;
  display_ph: string | string[];
  sample_ph: string;
}

export type FlushingSystemFormData = Record<string, FlushingSystemRowData>;

export interface FlushingSystemTableProps {
  initialTime?: string;
  initialData?: Partial<Record<string, Partial<FlushingSystemRowData>>>;
  onFormChange?: (time: string, formData: FlushingSystemFormData) => void;
  storageKey?: string;
}

export interface FlushingSystemInputProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isLastColumn?: boolean;
  placeholder?: string;
  validationStatus?: "ok" | "error" | "neutral";
  validationTitle?: string;
}
