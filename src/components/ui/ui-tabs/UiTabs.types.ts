export interface IUiTabsLinkOption {
  href: string
  label: string
}

export interface IUiTabsLinksProps {
  modelValue: string
  options: IUiTabsLinkOption[]
}

export type UiTabsRadiosValue = string | number | boolean | null

export interface IUiTabsRadioOption {
  value: UiTabsRadiosValue
  label: string
}

export interface IUiTabsRadiosProps {
  id?: string;
  name?: string;
  modelValue: UiTabsRadiosValue
  options: IUiTabsRadioOption[]
}
