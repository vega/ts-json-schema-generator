import { BaseType } from "./BaseType";

export class FunctionType extends BaseType {
  public constructor(
    private argumentOrder: string[],
    private argumentTypes: { [key: string]: BaseType },
    private returnType: BaseType,
  ) {
    super();
  }

  public getId(): string {
    return "("
      + Object.values(this.argumentTypes).map((item) => item.getId()).join(",")
      + ") => "
      + this.returnType.getId();
  }

  public getArgumentOrder(): string[] {
    return this.argumentOrder;
  }

  public getArgumentTypes(): { [key: string]: BaseType } {
    return this.argumentTypes;
  }

  public getReturnType(): BaseType {
    return this.returnType;
  }
}
