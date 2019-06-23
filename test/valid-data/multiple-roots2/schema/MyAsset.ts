import { Asset } from "../Asset";

// TODO: The schema currently produced for this is wrong, it is expected to look more like the following:
// {
//     "$schema": "http://json-schema.org/draft-07/schema#",
//     "definitions": {
//         "Asset": {
//             "type": "object",
//             "properties": {
//                 "type": {
//                     "enum": [
//                         "One",
//                         "Two"
//                     ],
//                     "type": "string"
//                 }
//             },
//             "required": [
//                 "type"
//             ],
//             "additionalProperties": false
//         },
//         "AssetType": {
//             "enum": [
//                 "One",
//                 "Two"
//             ],
//             "type": "string"
//         },
//         "MyAsset": {
//             "$ref": "#/definitions/Asset"
//         }
//     }
// }
export type MyAsset = Asset;
