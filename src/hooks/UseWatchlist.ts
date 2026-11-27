import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../utils/supabase";
import type { TMDBTrendingTitle } from "../utils/types/tmdb";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<TMDBTrendingTitle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userIdRef = useRef<string | null>(null);

  const loadWatchlist = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("user_watchlist")
      .select("title")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (userIdRef.current !== userId) return;

    setWatchlist(
      (data ?? []).map((row) => row.title as TMDBTrendingTitle)
    );
  }, []);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      const userId = data.user?.id ?? null;
      userIdRef.current = userId;

      if (!userId) {
        setWatchlist([]);
        setIsLoading(false);
        return;
      }

      try {
        await loadWatchlist(userId);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Could not load watchlist."
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id ?? null;

      userIdRef.current = userId;
      setWatchlist([]);
      setError(null);

      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      void loadWatchlist(userId)
        .catch((err) => {
          if (active && userIdRef.current === userId) {
            setError(
              err instanceof Error ? err.message : "Could not load watchlist."
            );
          }
        })
        .finally(() => {
          if (active && userIdRef.current === userId) {
            setIsLoading(false);
          }
        });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadWatchlist]);

  const addToWatchlist = async (title: TMDBTrendingTitle) => {
    const userId = userIdRef.current;

    if (!userId) {
      setError("Please sign in to use your watchlist.");
      return;
    }

    setError(null);

    const { error } = await supabase.from("user_watchlist").upsert(
      {
        user_id: userId,
        tmdb_id: title.id,
        media_type: title.media_type,
        title,
      },
      {
        onConflict: "user_id,tmdb_id,media_type",
        ignoreDuplicates: true,
      }
    );

    if (error) {
      setError(error.message);
      return;
    }

    if (userIdRef.current !== userId) return;

    setWatchlist((current) => {
      const exists = current.some(
        (item) =>
          item.id === title.id && item.media_type === title.media_type
      );

      return exists ? current : [title, ...current];
    });
  };

  const removeFromWatchlist = async (title: TMDBTrendingTitle) => {
    const userId = userIdRef.current;

    if (!userId) {
      setError("Please sign in to manage your watchlist.");
      return;
    }

    const { error } = await supabase
      .from("user_watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("tmdb_id", title.id)
      .eq("media_type", title.media_type);

    if (error) {
      setError(error.message);
      return;
    }

    if (userIdRef.current !== userId) return;

    setWatchlist((current) =>
      current.filter(
        (item) =>
          !(item.id === title.id && item.media_type === title.media_type)
      )
    );
  };

  const toggleWatchlist = async (title: TMDBTrendingTitle) => {
    const exists = watchlist.some(
      (item) =>
        item.id === title.id && item.media_type === title.media_type
    );

    if (exists) {
      await removeFromWatchlist(title);
    } else {
      await addToWatchlist(title);
    }
  };

  return {
    watchlist,
    isLoading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
}
