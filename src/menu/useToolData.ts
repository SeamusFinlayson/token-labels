import { useCallback, useEffect, useState } from "react";
import { SharingMetadata, ToolMetadata } from "../types";
import {
  getSharingMetadata,
  broadcastToolConfig,
  writeSharingMetadata,
  getToolMetadata,
  writeToolMetadata,
} from "../utils";

export function useToolData() {
  const [toolMetadata, setToolMetadata] =
    useState<ToolMetadata>(getToolMetadata);

  const [sharingMetadata, setSharingMetadata] =
    useState<SharingMetadata>(getSharingMetadata);

  // Update sharing metadata and save locally and broadcast if applicable
  const updateSharingMetadata = useCallback(
    (sharingMetadata: SharingMetadata) => {
      const newSharingMetadata = {
        ...sharingMetadata,
        timeStamp: sharingMetadata.isHost
          ? Date.now()
          : sharingMetadata.timeStamp,
      };
      setSharingMetadata({ ...newSharingMetadata });
      writeSharingMetadata(newSharingMetadata);

      broadcastToolConfig(newSharingMetadata, toolMetadata);
    },
    [toolMetadata],
  );

  // Update tool metadata and save locally and broadcast if applicable
  const updateToolMetadata = useCallback(
    (toolMetadata: ToolMetadata, localOnly = false) => {
      setToolMetadata({ ...toolMetadata });
      writeToolMetadata(toolMetadata);
      if (localOnly || !sharingMetadata.isHost) return;

      const newSharingMetadata = { ...sharingMetadata, timeStamp: Date.now() };
      setSharingMetadata({ ...newSharingMetadata });
      writeSharingMetadata(newSharingMetadata);

      broadcastToolConfig(newSharingMetadata, toolMetadata);
    },
    [sharingMetadata],
  );

  // Respond to storage changes that occur after the host broadcasts an update
  useEffect(() => {
    const handleStorage = async () => {
      setToolMetadata(getToolMetadata());
      setSharingMetadata(getSharingMetadata());
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return {
    toolMetadata,
    updateToolMetadata,
    sharingMetadata,
    updateSharingMetadata,
  };
}
