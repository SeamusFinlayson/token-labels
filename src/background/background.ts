import OBR from "@owlbear-rodeo/sdk";
export const menuIcon = new URL(
  "../status.svg#icon",
  import.meta.url,
).toString();

/**
 * This file represents the background script run when the plugin loads.
 * It creates the context menu items.
 */

OBR.onReady(async () => {
  printVersionToConsole();
});

async function printVersionToConsole() {
  fetch("/manifest.json")
    .then((response) => response.json())
    .then((json) =>
      console.log(json["name"] + " - version: " + json["version"]),
    );
}
