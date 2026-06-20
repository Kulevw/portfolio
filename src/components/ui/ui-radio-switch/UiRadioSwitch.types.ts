export type UiRadioSwitchValue = string | number | boolean | null;

export interface IUiRadioSwitchOption {
  value: UiRadioSwitchValue;
  label: string;
}

export interface IUiRadioSwitchProps {
  id?: string;
  name?: string;
  modelValue: UiRadioSwitchValue
  options: IUiRadioSwitchOption[]
  vertical?: boolean;
}

