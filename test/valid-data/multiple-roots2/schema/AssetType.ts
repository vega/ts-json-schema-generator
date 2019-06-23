import { Asset } from "../Asset";

const asset: Asset = { type: "One" };
export type AssetType = typeof asset.type;
