// src/utils/jwtDecodeWrapper.js
import * as jwtDecodeImport from "jwt-decode";

// Some environments export a default, others export named exports only.
// This wrapper will return the default if it exists, otherwise the namespace itself.
const jwtDecode = jwtDecodeImport.default || jwtDecodeImport;
export default jwtDecode;
