import { BaseType } from "./BaseType";

export class FunctionType extends BaseType {
  public constructor(
    private argumentTypes: BaseType[],
    private returnType: BaseType,
  ) {
    super();
  }

  public getId(): string {
    return "(" + this.argumentTypes.map((item) => item.getId()).join(",") + ") => " + this.returnType.getId();
  }

  public getArgumentTypes(): BaseType[] {
    return this.argumentTypes;
  }

  public getReturnType(): BaseType {
    return this.returnType;
  }
}
