// Test case for Omit with recursive interfaces
// This ensures that when an interface extends Omit<RecursiveType, 'property'>,
// the schema generator correctly handles the utility type without infinite recursion

// Simple recursive interface case
interface IItems {
  items?: IItems;
  value: string;
}

// IFormProps extends Omit<IItems, 'items'> should only have the 'value' property
// The 'items' property is correctly omitted
export interface IFormProps extends Omit<IItems, 'items'> {
}

// Complex case with multiple properties
interface ComplexItem {
  id: string;
  nested?: ComplexItem;
  data: number;
  optional?: string;
}

// Omit multiple properties
export interface SimpleComplexItem extends Omit<ComplexItem, 'nested' | 'optional'> {
}

// Pick variant (also a utility type)
export interface PickedItem extends Pick<IItems, 'value'> {
}

// Note: Cases with conditional types and infer (like ArrayElement<T>) are known to still
// cause issues and are tracked separately as they require different handling
