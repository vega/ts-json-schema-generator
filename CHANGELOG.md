# v1.0.0 (Mon Mar 21 2022)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Hadrien Milano ([@hmil](https://github.com/hmil))

:heart: Remi Cattiau ([@loopingz](https://github.com/loopingz))

:heart: Jason Dent ([@Jason3S](https://github.com/Jason3S))

:heart: Tom Mrazauskas ([@mrazauskas](https://github.com/mrazauskas))

:heart: Kari Lavikka ([@tuner](https://github.com/tuner))

:heart: null[@chimurai](https://github.com/chimurai)

:heart: Mark Sheinkman ([@MarkSheinkman](https://github.com/MarkSheinkman))

:heart: Arthur Fiorette ([@arthurfiorette](https://github.com/arthurfiorette))

:heart: Marcus Mailer ([@then3rdman](https://github.com/then3rdman))

#### 💥 Breaking Change


#### 🚀 Enhancement

- feat: support key remapping via `as` [#1174](https://github.com/vega/ts-json-schema-generator/pull/1174) ([@Jason3S](https://github.com/Jason3S))
- feat: support intrinsic string manipulation types [#1173](https://github.com/vega/ts-json-schema-generator/pull/1173) ([@Jason3S](https://github.com/Jason3S))
- feat: support template literals as types. [#1171](https://github.com/vega/ts-json-schema-generator/pull/1171) ([@Jason3S](https://github.com/Jason3S))
- feat: move private to protected to allow extending behavior [#1161](https://github.com/vega/ts-json-schema-generator/pull/1161) ([@loopingz](https://github.com/loopingz))
- feat: add support for never type [#1154](https://github.com/vega/ts-json-schema-generator/pull/1154) ([@hmil](https://github.com/hmil))
- fix: correctly parse `$id` and `$comment` JSDoc tags [#1129](https://github.com/vega/ts-json-schema-generator/pull/1129) (marcus.mailer@twobulls.com [@then3rdman](https://github.com/then3rdman))
- feat: `--minify` option (#1120) [#1121](https://github.com/vega/ts-json-schema-generator/pull/1121) ([@arthurfiorette](https://github.com/arthurfiorette))

#### 🐛 Bug Fix

- feat!: allow JSDoc tags without explicit value (e.g. `@deprecated`) to default to `true` [#1172](https://github.com/vega/ts-json-schema-generator/pull/1172) ([@mrazauskas](https://github.com/mrazauskas))
- fix: failed to resolve type for typeof static class property [#1119](https://github.com/vega/ts-json-schema-generator/pull/1119) ([@MarkSheinkman](https://github.com/MarkSheinkman))
- docs: autocomplete configuration [#1106](https://github.com/vega/ts-json-schema-generator/pull/1106) ([@chimurai](https://github.com/chimurai))
- chore: upgrade deps [#1092](https://github.com/vega/ts-json-schema-generator/pull/1092) ([@domoritz](https://github.com/domoritz))
- chore: add descriptive error message to `removeUnreachable` [#1048](https://github.com/vega/ts-json-schema-generator/pull/1048) ([@tuner](https://github.com/tuner))
- chore: move fetch-depth config to checkout action [#1045](https://github.com/vega/ts-json-schema-generator/pull/1045) ([@hydrosquall](https://github.com/hydrosquall))
- fix: crash on a recursive interface with an intersection type [#1040](https://github.com/vega/ts-json-schema-generator/pull/1040) ([@tuner](https://github.com/tuner))
- chore: simplify workflow setup [#1039](https://github.com/vega/ts-json-schema-generator/pull/1039) ([@hydrosquall](https://github.com/hydrosquall))
- chore: update to VL 5.2 and rebuild schemas [#1037](https://github.com/vega/ts-json-schema-generator/pull/1037) ([@domoritz](https://github.com/domoritz))
- ci: use GITHUB_TOKEN instead of PAT [#1017](https://github.com/vega/ts-json-schema-generator/pull/1017) ([@domoritz](https://github.com/domoritz))

#### 🔩 Dependency Updates

- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.14.0 to 5.15.0 [#1164](https://github.com/vega/ts-json-schema-generator/pull/1164) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.17.5 to 7.17.8 [#1162](https://github.com/vega/ts-json-schema-generator/pull/1162) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.34.1 to 10.34.2 [#1163](https://github.com/vega/ts-json-schema-generator/pull/1163) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump prettier from 2.5.1 to 2.6.0 [#1165](https://github.com/vega/ts-json-schema-generator/pull/1165) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump @types/json-schema from 7.0.9 to 7.0.10 [#1166](https://github.com/vega/ts-json-schema-generator/pull/1166) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.34.1 to 10.34.2 [#1167](https://github.com/vega/ts-json-schema-generator/pull/1167) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.14.0 to 5.15.0 [#1168](https://github.com/vega/ts-json-schema-generator/pull/1168) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump commander from 9.0.0 to 9.1.0 [#1169](https://github.com/vega/ts-json-schema-generator/pull/1169) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.34.1 to 10.34.2 [#1170](https://github.com/vega/ts-json-schema-generator/pull/1170) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.13.0 to 5.14.0 [#1157](https://github.com/vega/ts-json-schema-generator/pull/1157) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump vega from 5.21.0 to 5.22.0 [#1156](https://github.com/vega/ts-json-schema-generator/pull/1156) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.13.0 to 5.14.0 [#1158](https://github.com/vega/ts-json-schema-generator/pull/1158) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.10.0 to 8.11.0 [#1159](https://github.com/vega/ts-json-schema-generator/pull/1159) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.12.1 to 5.13.0 [#1144](https://github.com/vega/ts-json-schema-generator/pull/1144) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.32.6 to 10.34.1 [#1145](https://github.com/vega/ts-json-schema-generator/pull/1145) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.12.1 to 5.13.0 [#1146](https://github.com/vega/ts-json-schema-generator/pull/1146) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.5.0 to 10.7.0 [#1147](https://github.com/vega/ts-json-schema-generator/pull/1147) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.32.6 to 10.34.1 [#1148](https://github.com/vega/ts-json-schema-generator/pull/1148) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.5.5 to 4.6.2 [#1149](https://github.com/vega/ts-json-schema-generator/pull/1149) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.32.6 to 10.34.1 [#1150](https://github.com/vega/ts-json-schema-generator/pull/1150) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-config-prettier from 8.4.0 to 8.5.0 [#1151](https://github.com/vega/ts-json-schema-generator/pull/1151) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/checkout from 2 to 3 [#1143](https://github.com/vega/ts-json-schema-generator/pull/1143) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.12.0 to 5.12.1 [#1139](https://github.com/vega/ts-json-schema-generator/pull/1139) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.9.0 to 8.10.0 [#1138](https://github.com/vega/ts-json-schema-generator/pull/1138) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.18 to 17.0.21 [#1140](https://github.com/vega/ts-json-schema-generator/pull/1140) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/jest from 27.4.0 to 27.4.1 [#1141](https://github.com/vega/ts-json-schema-generator/pull/1141) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.12.0 to 5.12.1 [#1142](https://github.com/vega/ts-json-schema-generator/pull/1142) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.5.1 to 3 [#1137](https://github.com/vega/ts-json-schema-generator/pull/1137) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.11.0 to 5.12.0 [#1132](https://github.com/vega/ts-json-schema-generator/pull/1132) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.17.2 to 7.17.5 [#1133](https://github.com/vega/ts-json-schema-generator/pull/1133) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.17 to 17.0.18 [#1134](https://github.com/vega/ts-json-schema-generator/pull/1134) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.11.0 to 5.12.0 [#1135](https://github.com/vega/ts-json-schema-generator/pull/1135) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-config-prettier from 8.3.0 to 8.4.0 [#1136](https://github.com/vega/ts-json-schema-generator/pull/1136) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.10.2 to 5.11.0 [#1123](https://github.com/vega/ts-json-schema-generator/pull/1123) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.15 to 17.0.17 [#1122](https://github.com/vega/ts-json-schema-generator/pull/1122) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.17.0 to 7.17.2 [#1124](https://github.com/vega/ts-json-schema-generator/pull/1124) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.5.0 to 27.5.1 [#1125](https://github.com/vega/ts-json-schema-generator/pull/1125) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.4.0 to 10.5.0 [#1126](https://github.com/vega/ts-json-schema-generator/pull/1126) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.8.0 to 8.9.0 [#1127](https://github.com/vega/ts-json-schema-generator/pull/1127) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.10.2 to 5.11.0 [#1128](https://github.com/vega/ts-json-schema-generator/pull/1128) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.10.1 to 5.10.2 [#1117](https://github.com/vega/ts-json-schema-generator/pull/1117) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.9.0 to 8.10.0 [#1113](https://github.com/vega/ts-json-schema-generator/pull/1113) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.4.7 to 27.5.0 [#1114](https://github.com/vega/ts-json-schema-generator/pull/1114) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.16.12 to 7.17.0 [#1115](https://github.com/vega/ts-json-schema-generator/pull/1115) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.13 to 17.0.15 [#1116](https://github.com/vega/ts-json-schema-generator/pull/1116) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.10.1 to 5.10.2 [#1118](https://github.com/vega/ts-json-schema-generator/pull/1118) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.10.0 to 5.10.1 [#1111](https://github.com/vega/ts-json-schema-generator/pull/1111) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump commander from 8.3.0 to 9.0.0 [#1109](https://github.com/vega/ts-json-schema-generator/pull/1109) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump chai from 4.3.4 to 4.3.6 [#1107](https://github.com/vega/ts-json-schema-generator/pull/1107) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.7.0 to 8.8.0 [#1108](https://github.com/vega/ts-json-schema-generator/pull/1108) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.10 to 17.0.13 [#1110](https://github.com/vega/ts-json-schema-generator/pull/1110) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.10.0 to 5.10.1 [#1112](https://github.com/vega/ts-json-schema-generator/pull/1112) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.16.7 to 7.16.12 [#1102](https://github.com/vega/ts-json-schema-generator/pull/1102) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.9.1 to 5.10.0 [#1098](https://github.com/vega/ts-json-schema-generator/pull/1098) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.32.5 to 10.32.6 [#1097](https://github.com/vega/ts-json-schema-generator/pull/1097) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.32.5 to 10.32.6 [#1099](https://github.com/vega/ts-json-schema-generator/pull/1099) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.8 to 17.0.10 [#1100](https://github.com/vega/ts-json-schema-generator/pull/1100) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.32.5 to 10.32.6 [#1101](https://github.com/vega/ts-json-schema-generator/pull/1101) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.9.1 to 5.10.0 [#1103](https://github.com/vega/ts-json-schema-generator/pull/1103) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.5.4 to 4.5.5 [#1104](https://github.com/vega/ts-json-schema-generator/pull/1104) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.16.8 to 7.16.11 [#1105](https://github.com/vega/ts-json-schema-generator/pull/1105) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.6.0 to 8.7.0 [#1094](https://github.com/vega/ts-json-schema-generator/pull/1094) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.8.2 to 8.9.0 [#1095](https://github.com/vega/ts-json-schema-generator/pull/1095) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.8.1 to 5.9.0 [#1088](https://github.com/vega/ts-json-schema-generator/pull/1088) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.4.5 to 27.4.7 [#1089](https://github.com/vega/ts-json-schema-generator/pull/1089) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.8.1 to 5.9.0 [#1090](https://github.com/vega/ts-json-schema-generator/pull/1090) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.6 to 17.0.8 [#1091](https://github.com/vega/ts-json-schema-generator/pull/1091) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-typescript from 7.16.5 to 7.16.7 [#1081](https://github.com/vega/ts-json-schema-generator/pull/1081) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.8.0 to 5.8.1 [#1082](https://github.com/vega/ts-json-schema-generator/pull/1082) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.16.5 to 7.16.7 [#1084](https://github.com/vega/ts-json-schema-generator/pull/1084) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.8.0 to 5.8.1 [#1085](https://github.com/vega/ts-json-schema-generator/pull/1085) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.4 to 17.0.6 [#1080](https://github.com/vega/ts-json-schema-generator/pull/1080) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/jest from 27.0.3 to 27.4.0 [#1083](https://github.com/vega/ts-json-schema-generator/pull/1083) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.5.0 to 8.6.0 [#1086](https://github.com/vega/ts-json-schema-generator/pull/1086) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.16.5 to 7.16.7 [#1087](https://github.com/vega/ts-json-schema-generator/pull/1087) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.5.0 to 2.5.1 [#1079](https://github.com/vega/ts-json-schema-generator/pull/1079) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.7.0 to 5.8.0 [#1076](https://github.com/vega/ts-json-schema-generator/pull/1076) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.7.0 to 5.8.0 [#1077](https://github.com/vega/ts-json-schema-generator/pull/1077) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 17.0.0 to 17.0.4 [#1078](https://github.com/vega/ts-json-schema-generator/pull/1078) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.12 to 17.0.0 [#1071](https://github.com/vega/ts-json-schema-generator/pull/1071) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.6.0 to 5.7.0 [#1067](https://github.com/vega/ts-json-schema-generator/pull/1067) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.6.0 to 5.7.0 [#1068](https://github.com/vega/ts-json-schema-generator/pull/1068) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.16.0 to 7.16.5 [#1066](https://github.com/vega/ts-json-schema-generator/pull/1066) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.16.4 to 7.16.5 [#1069](https://github.com/vega/ts-json-schema-generator/pull/1069) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.5.3 to 4.5.4 [#1070](https://github.com/vega/ts-json-schema-generator/pull/1070) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.4.4 to 27.4.5 [#1072](https://github.com/vega/ts-json-schema-generator/pull/1072) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-typescript from 7.16.0 to 7.16.5 [#1073](https://github.com/vega/ts-json-schema-generator/pull/1073) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.4.1 to 8.5.0 [#1074](https://github.com/vega/ts-json-schema-generator/pull/1074) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.5.0 to 5.6.0 [#1058](https://github.com/vega/ts-json-schema-generator/pull/1058) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.5.0 to 5.6.0 [#1059](https://github.com/vega/ts-json-schema-generator/pull/1059) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.32.3 to 10.32.5 [#1057](https://github.com/vega/ts-json-schema-generator/pull/1057) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.4.0 to 8.4.1 [#1060](https://github.com/vega/ts-json-schema-generator/pull/1060) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.11 to 16.11.12 [#1061](https://github.com/vega/ts-json-schema-generator/pull/1061) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.4.3 to 27.4.4 [#1062](https://github.com/vega/ts-json-schema-generator/pull/1062) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.32.3 to 10.32.5 [#1063](https://github.com/vega/ts-json-schema-generator/pull/1063) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.32.3 to 10.32.5 [#1064](https://github.com/vega/ts-json-schema-generator/pull/1064) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.5.2 to 4.5.3 [#1065](https://github.com/vega/ts-json-schema-generator/pull/1065) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 5.4.0 to 5.5.0 [#1049](https://github.com/vega/ts-json-schema-generator/pull/1049) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump safe-stable-stringify from 2.2.0 to 2.3.1 [#1050](https://github.com/vega/ts-json-schema-generator/pull/1050) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.3.1 to 27.4.3 [#1051](https://github.com/vega/ts-json-schema-generator/pull/1051) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 8.3.0 to 8.4.0 [#1052](https://github.com/vega/ts-json-schema-generator/pull/1052) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump prettier from 2.5.0 to 2.5.1 [#1053](https://github.com/vega/ts-json-schema-generator/pull/1053) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.10 to 16.11.11 [#1054](https://github.com/vega/ts-json-schema-generator/pull/1054) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 5.4.0 to 5.5.0 [#1055](https://github.com/vega/ts-json-schema-generator/pull/1055) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.4.1 to 2.5.0 [#1042](https://github.com/vega/ts-json-schema-generator/pull/1042) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump prettier from 2.4.1 to 2.5.0 [#1030](https://github.com/vega/ts-json-schema-generator/pull/1030) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.32.2 to 10.32.3 [#1031](https://github.com/vega/ts-json-schema-generator/pull/1031) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.32.2 to 10.32.3 [#1032](https://github.com/vega/ts-json-schema-generator/pull/1032) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.8.1 to 8.8.2 [#1033](https://github.com/vega/ts-json-schema-generator/pull/1033) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.9 to 16.11.10 [#1035](https://github.com/vega/ts-json-schema-generator/pull/1035) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.32.2 to 10.32.3 [#1036](https://github.com/vega/ts-json-schema-generator/pull/1036) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/jest from 27.0.2 to 27.0.3 [#1022](https://github.com/vega/ts-json-schema-generator/pull/1022) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.4.4 to 4.5.2 [#1023](https://github.com/vega/ts-json-schema-generator/pull/1023) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.16.0 to 7.16.4 [#1024](https://github.com/vega/ts-json-schema-generator/pull/1024) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.8.0 to 8.8.1 [#1025](https://github.com/vega/ts-json-schema-generator/pull/1025) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.7 to 16.11.9 [#1026](https://github.com/vega/ts-json-schema-generator/pull/1026) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.6.3 to 8.8.0 [#1014](https://github.com/vega/ts-json-schema-generator/pull/1014) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.6 to 16.11.7 [#1015](https://github.com/vega/ts-json-schema-generator/pull/1015) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 13

- [@chimurai](https://github.com/chimurai)
- [@dependabot[bot]](https://github.com/dependabot[bot])
- Arthur Fiorette ([@arthurfiorette](https://github.com/arthurfiorette))
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- Hadrien Milano ([@hmil](https://github.com/hmil))
- Jason Dent ([@Jason3S](https://github.com/Jason3S))
- Kari Lavikka ([@tuner](https://github.com/tuner))
- Marcus (marcus.mailer@twobulls.com)
- Marcus Mailer ([@then3rdman](https://github.com/then3rdman))
- Mark Sheinkman ([@MarkSheinkman](https://github.com/MarkSheinkman))
- Remi Cattiau ([@loopingz](https://github.com/loopingz))
- Tom Mrazauskas ([@mrazauskas](https://github.com/mrazauskas))

---

# v0.97.0 (Thu Nov 04 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Josh Kelley ([@joshkel](https://github.com/joshkel))

:heart: Skip Hendriks ([@SkipHendriks](https://github.com/SkipHendriks))

:heart: Mohamed Akram ([@mohd-akram](https://github.com/mohd-akram))

:heart: Ruben Bridgewater ([@BridgeAR](https://github.com/BridgeAR))

#### 🚀 Enhancement

- feat: Add directory creation to --out [#1000](https://github.com/vega/ts-json-schema-generator/pull/1000) ([@SkipHendriks](https://github.com/SkipHendriks))
- feat: improve handling of unique symbols [#989](https://github.com/vega/ts-json-schema-generator/pull/989) ([@joshkel](https://github.com/joshkel))
- feat: handle intersections of aliased unions [#985](https://github.com/vega/ts-json-schema-generator/pull/985) ([@joshkel](https://github.com/joshkel))

#### 🐛 Bug Fix

- chore: replace stable stringify packages with safe-stable-stringify [#1009](https://github.com/vega/ts-json-schema-generator/pull/1009) ([@BridgeAR](https://github.com/BridgeAR))
- fix: pass absolute path of config to ts [#1010](https://github.com/vega/ts-json-schema-generator/pull/1010) ([@mohd-akram](https://github.com/mohd-akram))
- fix: json tags that are not json do not default to text [#984](https://github.com/vega/ts-json-schema-generator/pull/984) ([@stevenlandis-rl](https://github.com/stevenlandis-rl))
- fix: remove sourceRoot [#986](https://github.com/vega/ts-json-schema-generator/pull/986) ([@joshkel](https://github.com/joshkel))
- chore(release): use bot email for making auto commits [#983](https://github.com/vega/ts-json-schema-generator/pull/983) ([@hydrosquall](https://github.com/hydrosquall))
- ci: add caching [#982](https://github.com/vega/ts-json-schema-generator/pull/982) ([@domoritz](https://github.com/domoritz))
- chore: upgrade deps, fix workflow merge [#978](https://github.com/vega/ts-json-schema-generator/pull/978) ([@domoritz](https://github.com/domoritz))

#### 🔩 Dependency Updates

- chore(deps-dev): bump @babel/preset-typescript from 7.15.0 to 7.16.0 [#1003](https://github.com/vega/ts-json-schema-generator/pull/1003) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.15.8 to 7.16.0 [#1006](https://github.com/vega/ts-json-schema-generator/pull/1006) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.32.1 to 10.32.2 [#1002](https://github.com/vega/ts-json-schema-generator/pull/1002) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.32.1 to 10.32.2 [#1004](https://github.com/vega/ts-json-schema-generator/pull/1004) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.4 to 16.11.6 [#1005](https://github.com/vega/ts-json-schema-generator/pull/1005) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.32.1 to 10.32.2 [#1007](https://github.com/vega/ts-json-schema-generator/pull/1007) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.15.8 to 7.16.0 [#1008](https://github.com/vega/ts-json-schema-generator/pull/1008) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/glob from 7.1.4 to 7.2.0 [#995](https://github.com/vega/ts-json-schema-generator/pull/995) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.2.5 to 27.3.1 [#996](https://github.com/vega/ts-json-schema-generator/pull/996) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.11.1 to 16.11.4 [#997](https://github.com/vega/ts-json-schema-generator/pull/997) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump commander from 8.2.0 to 8.3.0 [#998](https://github.com/vega/ts-json-schema-generator/pull/998) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.3.0 to 10.4.0 [#999](https://github.com/vega/ts-json-schema-generator/pull/999) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.2.1 to 10.3.0 [#991](https://github.com/vega/ts-json-schema-generator/pull/991) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.4.3 to 4.4.4 [#990](https://github.com/vega/ts-json-schema-generator/pull/990) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.10.3 to 16.11.1 [#992](https://github.com/vega/ts-json-schema-generator/pull/992) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.2.4 to 27.2.5 [#981](https://github.com/vega/ts-json-schema-generator/pull/981) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 8

- [@dependabot[bot]](https://github.com/dependabot[bot])
- [@stevenlandis-rl](https://github.com/stevenlandis-rl)
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- Josh Kelley ([@joshkel](https://github.com/joshkel))
- Mohamed Akram ([@mohd-akram](https://github.com/mohd-akram))
- Ruben Bridgewater ([@BridgeAR](https://github.com/BridgeAR))
- Skip Hendriks ([@SkipHendriks](https://github.com/SkipHendriks))

---

# v0.96.0 (Tue Oct 05 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Remco Haszing ([@remcohaszing](https://github.com/remcohaszing))

:heart: Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))

:heart: null[@stevenlandis-rl](https://github.com/stevenlandis-rl)

:heart: Josh Kelley ([@joshkel](https://github.com/joshkel))

#### 🚀 Enhancement

- feat: parse jsdoc tags using json5 [#854](https://github.com/vega/ts-json-schema-generator/pull/854) ([@remcohaszing](https://github.com/remcohaszing))

#### 🐛 Bug Fix

- fix: fix handling of falsy enums like 0 and '' [#974](https://github.com/vega/ts-json-schema-generator/pull/974) ([@joshkel](https://github.com/joshkel))
- fix: JSDoc parser ignores empty annotations [#973](https://github.com/vega/ts-json-schema-generator/pull/973) ([@stevenlandis-rl](https://github.com/stevenlandis-rl))
- fix: support constants with lambda functions [#940](https://github.com/vega/ts-json-schema-generator/pull/940) ([@stevenlandis-rl](https://github.com/stevenlandis-rl))
- chore: upgrade deps [#954](https://github.com/vega/ts-json-schema-generator/pull/954) ([@domoritz](https://github.com/domoritz))
- ci: run tests on pushes to next [#941](https://github.com/vega/ts-json-schema-generator/pull/941) ([@domoritz](https://github.com/domoritz))
- refactor: optional chaining [#942](https://github.com/vega/ts-json-schema-generator/pull/942) ([@domoritz](https://github.com/domoritz))
- docs: describe how to merge prs [#880](https://github.com/vega/ts-json-schema-generator/pull/880) ([@domoritz](https://github.com/domoritz))
- chore(build): fix branches-ignore syntax in auto publish Github workflow [#865](https://github.com/vega/ts-json-schema-generator/pull/865) ([@hydrosquall](https://github.com/hydrosquall))

#### 🔩 Dependency Updates

- chore(deps-dev): bump jest from 27.2.2 to 27.2.4 [#965](https://github.com/vega/ts-json-schema-generator/pull/965) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.31.2 to 4.32.0 [#966](https://github.com/vega/ts-json-schema-generator/pull/966) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.32.0 to 10.32.1 [#967](https://github.com/vega/ts-json-schema-generator/pull/967) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.32.0 to 10.32.1 [#968](https://github.com/vega/ts-json-schema-generator/pull/968) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.10.1 to 16.10.2 [#969](https://github.com/vega/ts-json-schema-generator/pull/969) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.32.0 to 10.32.1 [#970](https://github.com/vega/ts-json-schema-generator/pull/970) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.31.2 to 4.32.0 [#971](https://github.com/vega/ts-json-schema-generator/pull/971) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.4.0 to 2.4.1 [#964](https://github.com/vega/ts-json-schema-generator/pull/964) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.2.0 to 27.2.2 [#962](https://github.com/vega/ts-json-schema-generator/pull/962) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump vega from 5.20.2 to 5.21.0 [#956](https://github.com/vega/ts-json-schema-generator/pull/956) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest-junit from 12.2.0 to 12.3.0 [#957](https://github.com/vega/ts-json-schema-generator/pull/957) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/jest from 27.0.1 to 27.0.2 [#958](https://github.com/vega/ts-json-schema-generator/pull/958) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump glob from 7.1.7 to 7.2.0 [#959](https://github.com/vega/ts-json-schema-generator/pull/959) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.31.1 to 4.31.2 [#960](https://github.com/vega/ts-json-schema-generator/pull/960) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.9.4 to 16.10.1 [#961](https://github.com/vega/ts-json-schema-generator/pull/961) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.31.1 to 4.31.2 [#963](https://github.com/vega/ts-json-schema-generator/pull/963) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.31.0 to 4.31.1 [#947](https://github.com/vega/ts-json-schema-generator/pull/947) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.31.0 to 4.31.1 [#949](https://github.com/vega/ts-json-schema-generator/pull/949) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.9.1 to 16.9.3 [#943](https://github.com/vega/ts-json-schema-generator/pull/943) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.31.0 to 10.32.0 [#944](https://github.com/vega/ts-json-schema-generator/pull/944) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump prettier from 2.4.0 to 2.4.1 [#945](https://github.com/vega/ts-json-schema-generator/pull/945) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.1.1 to 27.2.0 [#946](https://github.com/vega/ts-json-schema-generator/pull/946) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.31.0 to 10.32.0 [#948](https://github.com/vega/ts-json-schema-generator/pull/948) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.6.2 to 8.6.3 [#950](https://github.com/vega/ts-json-schema-generator/pull/950) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.31.0 to 10.32.0 [#951](https://github.com/vega/ts-json-schema-generator/pull/951) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump codecov/codecov-action from 2.0.3 to 2.1.0 [#938](https://github.com/vega/ts-json-schema-generator/pull/938) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.30.0 to 4.31.0 [#935](https://github.com/vega/ts-json-schema-generator/pull/935) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.30.0 to 4.31.0 [#933](https://github.com/vega/ts-json-schema-generator/pull/933) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump commander from 8.1.0 to 8.2.0 [#930](https://github.com/vega/ts-json-schema-generator/pull/930) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump prettier from 2.3.2 to 2.4.0 [#931](https://github.com/vega/ts-json-schema-generator/pull/931) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.15.4 to 7.15.6 [#932](https://github.com/vega/ts-json-schema-generator/pull/932) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.7.10 to 16.9.1 [#934](https://github.com/vega/ts-json-schema-generator/pull/934) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.1.0 to 27.1.1 [#936](https://github.com/vega/ts-json-schema-generator/pull/936) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.4.2 to 4.4.3 [#937](https://github.com/vega/ts-json-schema-generator/pull/937) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-prettier from 3.4.1 to 4.0.0 [#925](https://github.com/vega/ts-json-schema-generator/pull/925) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.15.0 to 7.15.5 [#922](https://github.com/vega/ts-json-schema-generator/pull/922) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.29.3 to 4.30.0 [#926](https://github.com/vega/ts-json-schema-generator/pull/926) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.29.3 to 4.30.0 [#923](https://github.com/vega/ts-json-schema-generator/pull/923) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.7.5 to 16.7.10 [#924](https://github.com/vega/ts-json-schema-generator/pull/924) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.15.0 to 7.15.4 [#927](https://github.com/vega/ts-json-schema-generator/pull/927) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump typescript from 4.3.5 to 4.4.2 [#917](https://github.com/vega/ts-json-schema-generator/pull/917) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.7.1 to 16.7.5 [#919](https://github.com/vega/ts-json-schema-generator/pull/919) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump jest from 27.0.6 to 27.1.0 [#920](https://github.com/vega/ts-json-schema-generator/pull/920) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.29.2 to 4.29.3 [#918](https://github.com/vega/ts-json-schema-generator/pull/918) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.29.2 to 4.29.3 [#921](https://github.com/vega/ts-json-schema-generator/pull/921) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump codecov/codecov-action from 2.0.2 to 2.0.3 [#916](https://github.com/vega/ts-json-schema-generator/pull/916) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.29.1 to 4.29.2 [#911](https://github.com/vega/ts-json-schema-generator/pull/911) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.29.1 to 4.29.2 [#912](https://github.com/vega/ts-json-schema-generator/pull/912) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.6.1 to 16.7.1 [#913](https://github.com/vega/ts-json-schema-generator/pull/913) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.2.0 to 10.2.1 [#914](https://github.com/vega/ts-json-schema-generator/pull/914) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint-plugin-prettier from 3.4.0 to 3.4.1 [#915](https://github.com/vega/ts-json-schema-generator/pull/915) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/jest from 26.0.24 to 27.0.1 [#905](https://github.com/vega/ts-json-schema-generator/pull/905) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv-formats from 2.1.0 to 2.1.1 [#902](https://github.com/vega/ts-json-schema-generator/pull/902) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.29.0 to 4.29.1 [#904](https://github.com/vega/ts-json-schema-generator/pull/904) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.29.0 to 4.29.1 [#909](https://github.com/vega/ts-json-schema-generator/pull/909) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.30.0 to 10.31.0 [#903](https://github.com/vega/ts-json-schema-generator/pull/903) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.30.0 to 10.31.0 [#906](https://github.com/vega/ts-json-schema-generator/pull/906) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.30.0 to 10.31.0 [#907](https://github.com/vega/ts-json-schema-generator/pull/907) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.4.13 to 16.6.1 [#908](https://github.com/vega/ts-json-schema-generator/pull/908) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.1.0 to 10.2.0 [#910](https://github.com/vega/ts-json-schema-generator/pull/910) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.14.9 to 7.15.0 [#894](https://github.com/vega/ts-json-schema-generator/pull/894) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.28.5 to 4.29.0 [#895](https://github.com/vega/ts-json-schema-generator/pull/895) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.28.5 to 4.29.0 [#896](https://github.com/vega/ts-json-schema-generator/pull/896) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-typescript from 7.14.5 to 7.15.0 [#898](https://github.com/vega/ts-json-schema-generator/pull/898) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump @types/json-schema from 7.0.8 to 7.0.9 [#897](https://github.com/vega/ts-json-schema-generator/pull/897) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.4.9 to 16.4.13 [#899](https://github.com/vega/ts-json-schema-generator/pull/899) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/core from 7.14.8 to 7.15.0 [#900](https://github.com/vega/ts-json-schema-generator/pull/900) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.3.2 to 2.4.0 [#892](https://github.com/vega/ts-json-schema-generator/pull/892) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.3.1 to 2.3.2 [#890](https://github.com/vega/ts-json-schema-generator/pull/890) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.3.0 to 2.3.1 [#889](https://github.com/vega/ts-json-schema-generator/pull/889) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.4.2 to 16.4.9 [#882](https://github.com/vega/ts-json-schema-generator/pull/882) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump commander from 8.0.0 to 8.1.0 [#883](https://github.com/vega/ts-json-schema-generator/pull/883) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin from 4.28.4 to 4.28.5 [#884](https://github.com/vega/ts-json-schema-generator/pull/884) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 7.31.0 to 7.32.0 [#885](https://github.com/vega/ts-json-schema-generator/pull/885) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.28.4 to 4.28.5 [#886](https://github.com/vega/ts-json-schema-generator/pull/886) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @babel/preset-env from 7.14.8 to 7.14.9 [#887](https://github.com/vega/ts-json-schema-generator/pull/887) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump codecov/codecov-action from 2.0.1 to 2.0.2 [#877](https://github.com/vega/ts-json-schema-generator/pull/877) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.4.0 to 16.4.2 [#873](https://github.com/vega/ts-json-schema-generator/pull/873) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/first-time-contributor from 10.29.3 to 10.30.0 [#874](https://github.com/vega/ts-json-schema-generator/pull/874) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump auto from 10.29.3 to 10.30.0 [#875](https://github.com/vega/ts-json-schema-generator/pull/875) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @auto-it/conventional-commits from 10.29.3 to 10.30.0 [#876](https://github.com/vega/ts-json-schema-generator/pull/876) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore: set up auto for versioning/release management [#856](https://github.com/vega/ts-json-schema-generator/pull/856) ([@remcohaszing](https://github.com/remcohaszing) [@hydrosquall](https://github.com/hydrosquall))
- chore(deps): bump codecov/codecov-action from 1.5.2 to 2.0.1 [#863](https://github.com/vega/ts-json-schema-generator/pull/863) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 6

- [@dependabot[bot]](https://github.com/dependabot[bot])
- [@stevenlandis-rl](https://github.com/stevenlandis-rl)
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- Josh Kelley ([@joshkel](https://github.com/joshkel))
- Remco Haszing ([@remcohaszing](https://github.com/remcohaszing))

---

# v0.95.0 (Thu Jul 22 2021)

:tada: This release contains work from new contributors! :tada:

Thanks for all your work!

:heart: Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))

:heart: Remco Haszing ([@remcohaszing](https://github.com/remcohaszing))

#### 🚀 Enhancement

- chore(deps-dev): bump @babel/core from 7.14.6 to 7.14.8 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- feat: parse jsdoc tags using json5 [#854](https://github.com/vega/ts-json-schema-generator/pull/854) ([@remcohaszing](https://github.com/remcohaszing))

#### 🐛 Bug Fix

- chore(deps-dev): bump @babel/preset-env from 7.14.7 to 7.14.8 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.28.3 to 4.28.4 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.3.3 to 16.4.0 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/eslint-plugin [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump actions/setup-node from 2.2.0 to 2.3.0 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- ci: simplify dependabot config [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@domoritz](https://github.com/domoritz))
- chore(build): fix branches-ignore syntax in auto publish Github workflow [#865](https://github.com/vega/ts-json-schema-generator/pull/865) ([@hydrosquall](https://github.com/hydrosquall))
- chore(deps-dev): bump @typescript-eslint/parser from 4.28.2 to 4.28.3 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ajv from 8.6.1 to 8.6.2 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump eslint from 7.30.0 to 7.31.0 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.3.1 to 16.3.3 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/json-stable-stringify from 1.0.32 to 1.0.33 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @typescript-eslint/parser from 4.28.1 to 4.28.2 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/glob from 7.1.3 to 7.1.4 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump ts-node from 10.0.0 to 10.1.0 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps): bump @types/json-schema from 7.0.7 to 7.0.8 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/jest from 26.0.23 to 26.0.24 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))
- chore(deps-dev): bump @types/node from 16.0.0 to 16.3.1 [#872](https://github.com/vega/ts-json-schema-generator/pull/872) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### 🔩 Dependency Updates

- chore: set up auto for versioning/release management [#856](https://github.com/vega/ts-json-schema-generator/pull/856) ([@remcohaszing](https://github.com/remcohaszing) [@hydrosquall](https://github.com/hydrosquall))
- chore(deps): bump codecov/codecov-action from 1.5.2 to 2.0.1 [#863](https://github.com/vega/ts-json-schema-generator/pull/863) ([@dependabot[bot]](https://github.com/dependabot[bot]))

#### Authors: 4

- [@dependabot[bot]](https://github.com/dependabot[bot])
- Cameron Yick ([@hydrosquall](https://github.com/hydrosquall))
- Dominik Moritz ([@domoritz](https://github.com/domoritz))
- Remco Haszing ([@remcohaszing](https://github.com/remcohaszing))
