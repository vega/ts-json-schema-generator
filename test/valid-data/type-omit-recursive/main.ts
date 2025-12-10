// Simple recursive interface
interface IItems {
  items?: IItems;
  value: string;
}

// IFormProps extends Omit<IItems, 'items'> should only have the 'value' property
export interface IFormProps extends Omit<IItems, 'items'> {
}
