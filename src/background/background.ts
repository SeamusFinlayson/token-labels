import OBR from "@owlbear-rodeo/sdk";
import {
  createTool,
  createMode,
  handleActiveTool,
  handleSceneClose,
} from "./tool";
import { handleSharing } from "./sharing";

OBR.onReady(async () => {
  printVersionToConsole();

  createTool();
  createMode();

  handleActiveTool();
  handleSceneClose();

  handleSharing();
});

async function printVersionToConsole() {
  fetch("/manifest.json")
    .then((response) => response.json())
    .then((json) =>
      console.log(json["name"] + " - version: " + json["version"]),
    );
}
