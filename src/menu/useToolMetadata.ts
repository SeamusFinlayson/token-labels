import { useEffect, useState } from "react";
import {
  ShareMessage,
  SharingMetadata,
  ToolMetadata,
  defaultToolMetadata,
  isToolMetadata,
} from "../types";
import OBR from "@owlbear-rodeo/sdk";
import { SHARING_ID, TOOL_ID } from "../ids";

export function useToolMetadata(
  sharingMetadata: SharingMetadata | null,
  updateSharingMetadata: (sharingMetadata: SharingMetadata | null) => void,
): [ToolMetadata, (toolMetadata: ToolMetadata) => void] {
  const [toolMetadata, setToolMetadata] = useState<ToolMetadata>({
    ...defaultToolMetadata,
    conditionLibraryName: "None",
  });

  useEffect(() => {
    OBR.tool.getMetadata(TOOL_ID).then((value) => {
      if (isToolMetadata(value)) setToolMetadata(value);
      else setToolMetadata(defaultToolMetadata);
    });
  }, []);

  // Update app state and stored tool metadata
  const updateToolMetadata = (toolMetadata: ToolMetadata) => {
    setToolMetadata({ ...toolMetadata });
    OBR.tool.setMetadata(TOOL_ID, toolMetadata);
  };

  useEffect(
    () =>
      OBR.broadcast.onMessage(SHARING_ID, (event) => {
        console.log("receive sharing data");
        const msg = event.data as ShareMessage;
        if (
          sharingMetadata === null ||
          msg.timeStamp > sharingMetadata.timeStamp
        ) {
          updateToolMetadata({
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

          if (sharingMetadata !== null) updateSharingMetadata(null);
        }
      }),
    [sharingMetadata, toolMetadata, updateSharingMetadata],
  );

  return [toolMetadata, updateToolMetadata];
}
