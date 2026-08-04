import { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";
import {
  getMyAnnouncements,
  getUnreadCount,
  markAsRead,
  markAllRead,
} from "../../api/announcement.api";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data } = await getUnreadCount();
      setUnreadCount(data.data.count);
    } catch {
      // Non-critical - the badge just won't update this cycle
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 60s so the badge updates without a full page reload -
    // simple and good enough at this scale; a future version could use
    // websockets for instant delivery instead.
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Close the panel when tapping/clicking outside it
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const openPanel = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const { data } = await getMyAnnouncements();
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item) => {
    if (!item.isRead) {
      await markAsRead(item.notificationId);
      setItems((prev) =>
        prev.map((i) => (i.notificationId === item.notificationId ? { ...i, isRead: true } : i))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label="Notifications"
        className="relative text-charcoal/70 transition-colors hover:text-brass"
      >
        <Bell size={20} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right animate-fadeIn border border-rule bg-parchment shadow-lg">
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <p className="text-xs uppercase tracking-[0.2em] text-brass">Announcements</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-charcoal/60 underline hover:text-brass"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-6 text-center text-sm text-charcoal/50">Loading...</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-charcoal/50">No announcements yet.</p>
            ) : (
              <div className="divide-y divide-rule">
                {items.map((item) => (
                  <button
                    key={item.notificationId}
                    onClick={() => handleItemClick(item)}
                    className={`block w-full px-4 py-3 text-left transition-colors hover:bg-ink/[0.03] ${
                      item.isRead ? "" : "bg-brass/5"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!item.isRead && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ink">
                          {item.announcement.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-charcoal/60">
                          {item.announcement.body}
                        </p>
                        <p className="mt-1 text-[10px] text-charcoal/40">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
