import OBR from "@owlbear-rodeo/sdk";
import { useEffect, useState } from "react";

type Role = "PLAYER" | "GM";

export function usePlayerRole() {
  const [playerRole, setPlayerRole] = useState<Role>("PLAYER");
  useEffect(() => {
    const handleRole = (role: Role) => setPlayerRole(role);

    OBR.player.getRole().then(handleRole);
    return OBR.player.onChange((player) => handleRole(player.role));
  });

  return playerRole;
}
