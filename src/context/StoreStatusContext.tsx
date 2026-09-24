"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storeService } from "@/services/store.service";
import { supabase } from "@/supabase/supabaseClients";
import { StoreStatus, StoreStatusType } from "@/types/store";

interface StoreStatusContextValue {
  setting: StoreStatus | null;
  status: StoreStatusType | null;
  isLoading: boolean;
  isOpening: boolean;
  isBreak: boolean;
  isClosed: boolean;
  canOrderNow: boolean;
  canPreorder: boolean;
  startTime: Date | null;
  endTime: Date | null;
  isWithinActiveTime: boolean;
  refresh: () => Promise<void>;
}

const StoreStatusContext = createContext<StoreStatusContextValue | null>(null);

export function StoreStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [setting, setSetting] = useState<StoreStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  /**
   * Fetch active store setting
   */
  const fetchStoreStatus = useCallback(async () => {
    try {
      const result = await storeService.getStoreStatus();

      if (result.success) setSetting(result.data[0]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initial fetch + realtime
   */
  useEffect(() => {
    fetchStoreStatus();

    const channel = supabase
      .channel("store-setting-status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "store_setting",
        },
        () => {
          fetchStoreStatus();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStoreStatus]);

  /**
   * Update current time every 30 seconds.
   *
   * This is necessary because Date.now() changing
   * does NOT automatically trigger React re-render.
   */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const scheduleNextUpdate = () => {
      const currentTime = Date.now();

      /**
       * Nếu không có endTime:
       * Không có mốc thời gian cụ thể để wake up.
       * Check mỗi 60s là đủ.
       */
      if (!setting?.time_end) {
        timer = setTimeout(() => {
          setNow(new Date());
        }, 300_000);

        return;
      }

      const endTime = new Date(setting.time_end).getTime();

      const remaining = endTime - currentTime;

      /**
       * Đã qua endTime
       */
      if (remaining <= 0) {
        setNow(new Date());
        return;
      }

      /**
       * Còn thời gian:
       * Không cần re-render liên tục.
       *
       * Wake up ngay tại endTime + một khoảng buffer nhỏ.
       */
      timer = setTimeout(() => {
        setNow(new Date());
      }, remaining + 100);
    };

    scheduleNextUpdate();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setting?.time_end]);

  const value = useMemo(() => {
    /**
     * No active setting
     */
    if (!setting || !setting.is_active) {
      return {
        setting: null,
        status: null,

        isLoading,

        isOpening: false,
        isBreak: false,
        isClosed: false,

        canOrderNow: false,
        canPreorder: false,

        startTime: null,
        endTime: null,

        isWithinActiveTime: false,

        refresh: fetchStoreStatus,
      };
    }

    const startTime = setting.time_start ? new Date(setting.time_start) : null;

    const endTime = setting.time_end ? new Date(setting.time_end) : null;

    /**
     * Check whether current time is inside
     * the active time range.
     *
     * Examples:
     *
     * 10:00 -> 14:00
     * now 12:00 => true
     * now 15:00 => false
     */
    const isWithinActiveTime =
      (!startTime || now >= startTime) && (!endTime || now <= endTime);

    /**
     * The status only becomes effective
     * when current time is inside the configured range.
     */
    const effectiveStatus: StoreStatusType | null = isWithinActiveTime
      ? setting.status
      : StoreStatusType.opening;

    const isOpening = effectiveStatus === StoreStatusType.opening;
    const isBreak = effectiveStatus === StoreStatusType.break;
    const isClosed = effectiveStatus === StoreStatusType.closed;

    /**
     * Opening:
     * customer can order immediately.
     *
     * Break / Closed:
     * customer cannot order immediately,
     * but can preorder.
     */
    const canOrderNow = isOpening;

    const canPreorder = isBreak || isClosed;

    return {
      setting,
      status: effectiveStatus,
      isLoading,
      isOpening,
      isBreak,
      isClosed,
      canOrderNow,
      canPreorder,
      startTime,
      endTime,
      isWithinActiveTime,
      refresh: fetchStoreStatus,
    };
  }, [setting, isLoading, now, fetchStoreStatus]);

  return (
    <StoreStatusContext.Provider value={value}>
      {children}
    </StoreStatusContext.Provider>
  );
}

export function useStoreStatus() {
  const context = useContext(StoreStatusContext);

  if (!context) {
    throw new Error("useStoreStatus must be used inside StoreStatusProvider");
  }

  return context;
}
