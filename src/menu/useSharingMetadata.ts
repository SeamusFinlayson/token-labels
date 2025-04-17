import { useCallback, useState } from "react";
import { SharingMetadata } from "../types";
import { getSharingMetadata, writeSharingMetadata } from "../utils";

export function useSharingMetadata(): [
  SharingMetadata | null,
  (sharingMetadata: SharingMetadata | null) => void,
] {
  const [sharingMetadata, setSharingMetadata] =
    useState<SharingMetadata | null>(getSharingMetadata);

  // Update app state and stored sharing metadata
  const updateSharingMetadata = useCallback(
    (sharingMetadata: SharingMetadata | null) => {
      setSharingMetadata(
        sharingMetadata ? { ...sharingMetadata, timeStamp: Date.now() } : null,
      );
      writeSharingMetadata(sharingMetadata);
    },
    [],
  );

  return [sharingMetadata, updateSharingMetadata];
}
