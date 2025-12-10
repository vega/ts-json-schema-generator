// Test case for Omit with recursive interfaces
// This ensures that when an interface extends Omit<RecursiveType, 'property'>,
// the schema generator correctly handles the utility type without infinite recursion

interface IItems {
  items?: IItems;
  value: string;
}

// IFormProps extends Omit<IItems, 'items'> should only have the 'value' property
// The 'items' property is correctly omitted
export interface IFormProps extends Omit<IItems, 'items'> {
}

// Note: More complex cases with conditional types and infer (like ArrayElement<T>)
// may still cause issues and are tracked separately
