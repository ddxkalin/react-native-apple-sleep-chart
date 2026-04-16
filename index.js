/**
 * Example app entry point.
 * This file is used by the React Native bundler to run the example app.
 * The library itself is exported from src/index.ts.
 *
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./example/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
