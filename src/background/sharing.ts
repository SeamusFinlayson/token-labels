import OBR from "@owlbear-rodeo/sdk";
import { HELLO_CHANNEL, SHARING_ID } from "../ids";
import { isSharingMetadata, isToolMetadata, ShareMessage } from "../types";
import {
  getSharingMetadata,
  broadcastToolConfig,
  writeSharingMetadata,
  getToolMetadata,
  writeToolMetadata,
} from "../utils";

export function handleSharing() {
  // Request data
  OBR.broadcast.sendMessage(HELLO_CHANNEL, {});

  // Send data if it is hosted on this device
  broadcastToolConfig(getSharingMetadata(), getToolMetadata());

  // Respond to requests for data
  OBR.broadcast.onMessage(HELLO_CHANNEL, async () => {
    const sharingMetadata = getSharingMetadata();
    const toolMetadata = getToolMetadata();

    if (
      sharingMetadata.isHost &&
      isSharingMetadata(sharingMetadata) &&
      isToolMetadata(toolMetadata)
    ) {
      broadcastToolConfig(sharingMetadata, toolMetadata);
    }
  });

  // Handle data
  OBR.broadcast.onMessage(SHARING_ID, async (event) => {
    const sharingMetadata = getSharingMetadata();
    const toolMetadata = getToolMetadata();

    const msg = event.data as ShareMessage;
    if (msg.timeStamp >= sharingMetadata.timeStamp) {
      writeToolMetadata({
        ...toolMetadata,
        ...(msg.sharedDefaultLibrary
          ? { conditionLibraryName: msg.conditionLibraryName }
          : {}),
        ...(msg.sharedCustomLibraries
          ? {
              customConditionLibraries: msg.customConditionLibraries,
              enabledCustomConditionLibraries:
                msg.enabledCustomConditionLibraries,
            }
          : {}),
        ...(msg.sharedCustomConditions
          ? { customConditions: msg.customConditions }
          : {}),
        ...(msg.sharedPositioningSettings
          ? {
              horizontalOffset: msg.horizontalOffset,
              verticalOffset: msg.verticalOffset,
              verticalSpacing: msg.verticalSpacing,
              scale: msg.scale,
              alignment: msg.alignment,
              justification: msg.justification,
              pointerDirection: msg.pointerDirection,
            }
          : {}),
      });

      writeSharingMetadata({
        isHost: false,
        timeStamp: msg.timeStamp,
        sharedDefaultLibrary: msg.sharedDefaultLibrary,
        sharedCustomLibraries: msg.sharedCustomLibraries,
        sharedCustomConditions: msg.sharedCustomConditions,
        sharedPositioningSettings: msg.sharedPositioningSettings,
      });
      // window.dispatchEvent(new Event("storage"));
    }
  });
}
