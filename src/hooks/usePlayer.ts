import { useCallback, useEffect, useState } from "react";
import { fetchPlayer, loadPlayerId, touchPresence, type Player } from "@/lib/player";

/** Loads the locally-stored player and keeps its presence fresh. */
export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const id = loadPlayerId();
    if (!id) {
      setPlayer(null);
      setLoading(false);
      return;
    }
    const found = await fetchPlayer(id);
    setPlayer(found);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!player) return;
    void touchPresence(player.id);
    const t = setInterval(() => void touchPresence(player.id), 45_000);
    return () => clearInterval(t);
  }, [player]);

  return { player, loading, setPlayer, refresh };
}
