enum ParameterType {
    Enum = "enum",
    Number = "number",
    String = "string",
    Date = "date",
}

export interface IParameter {
    type: Exclude<ParameterType, ParameterType.Enum | ParameterType.Number>;
}
