import { useState, useEffect } from "react";

const GAME_STATE_KEY = "gateway-gauntlet-game-state";
const MAX_STORAGE_AGE = 24 * 60 * 60 * 1000;

export interface GameState {
  playWithoutWallet: boolean;
  lastPlayed: number;
  highScore?: number;
  totalGames?: number;
}

export const useGameState = () => {
  const [state, setState] = useState<GameState>({
    playWithoutWallet: false,
    lastPlayed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGameState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGameState = () => {
    try {
      const saved = localStorage.getItem(GAME_STATE_KEY);
      if (saved) {
        const parsed: GameState = JSON.parse(saved);

        if (Date.now() - parsed.lastPlayed < MAX_STORAGE_AGE) {
          setState(parsed);
        } else {
          clearGameState();
        }
      }
    } catch (error) {
      console.error("Error loading game state:", error);
      clearGameState();
    } finally {
      setIsLoading(false);
    }
  };

  const saveGameState = (newState: Partial<GameState>) => {
    try {
      const updatedState: GameState = {
        ...state,
        ...newState,
        lastPlayed: Date.now(),
      };

      setState(updatedState);
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(updatedState));
    } catch (error) {
      console.error("Error saving game state:", error);
    }
  };

  const clearGameState = () => {
    setState({ playWithoutWallet: false, lastPlayed: 0 });
    localStorage.removeItem(GAME_STATE_KEY);
  };

  const setPlayWithoutWallet = () => {
    saveGameState({ playWithoutWallet: true });
  };

  const resetGameState = () => {
    clearGameState();
  };

  return {
    state,
    isLoading,
    setPlayWithoutWallet,
    resetGameState,
    saveGameState,
  };
};
