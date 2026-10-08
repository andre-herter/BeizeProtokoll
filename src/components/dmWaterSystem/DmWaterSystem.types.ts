export type DmWaterStreetOption = "strasse_1" | "strasse_2";

export interface DmWaterFormData {
  street: DmWaterStreetOption | "";
  time: string;
  displayEc: string;
  sampleEc: string;
}

export interface DmWaterSystemProps {
  initialValues?: Partial<DmWaterFormData>;
  onFormChange?: (data: DmWaterFormData) => void;
  onFormReset?: () => void;
}
