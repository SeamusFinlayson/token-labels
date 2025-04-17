import OBR from "@owlbear-rodeo/sdk";
import { HELLO_CHANNEL, SHARING_ID, TOOL_ID } from "../ids";
import { isSharingMetadata, isToolMetadata, ShareMessage } from "../types";
import {
  getSharingMetadata,
  shareToolConfig,
  writeSharingMetadata,
} from "../utils";

export function handleSharing() {
  // Request data
  console.log("send hello");
  OBR.broadcast.sendMessage(HELLO_CHANNEL, {});

  // Respond to requests for data
  OBR.broadcast.onMessage(HELLO_CHANNEL, async () => {
    console.log("receive hello");

    const sharingMetadata = getSharingMetadata();
    const toolMetadata = await OBR.tool.getMetadata(TOOL_ID);

    if (isSharingMetadata(sharingMetadata) && isToolMetadata(toolMetadata)) {
      shareToolConfig(sharingMetadata, toolMetadata);
    }
  });

  // Handle data
  OBR.broadcast.onMessage(SHARING_ID, async (event) => {
    console.log("receive sharing data");

    const sharingMetadata = getSharingMetadata();
    const toolMetadata = await OBR.tool.getMetadata(TOOL_ID);

    const msg = event.data as ShareMessage;
    if (sharingMetadata === null || msg.timeStamp > sharingMetadata.timeStamp) {
      OBR.tool.setMetadata(TOOL_ID, {
        ...toolMetadata,
        ...(msg.shareDefaultLibrary
          ? { conditionLibraryName: msg.conditionLibraryName }
          : {}),
        ...(msg.shareCustomLibraries
          ? {
              customConditionLibraries: msg.customConditionLibraries,
              enabledCustomConditionLibraries:
                msg.enabledCustomConditionLibraries,
            }
          : {}),
        ...(msg.shareCustomConditions
          ? { customConditions: msg.customConditions }
          : {}),
      });

      if (sharingMetadata !== null) writeSharingMetadata(null);
    }
  });
}
