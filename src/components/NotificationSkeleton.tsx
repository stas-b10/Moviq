export default function NotificationSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading notifications"
      aria-busy="true"
      className="divide-y divide-gray-100 dark:divide-white/5"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="relative flex gap-3 overflow-hidden px-4 py-4"
        >
          <div
            className="pointer-events-none absolute inset-0 -translate-x-full
              animate-[notification-shimmer_1.8s_infinite]
              bg-gradient-to-r from-transparent
              via-gray-100/70 to-transparent
              dark:via-white/[0.035]"
          />

          <div className="relative flex w-2 shrink-0 justify-center">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-[#228EE5]/25" />
          </div>

          <div className="relative min-w-0 flex-1">
            <div className="h-3.5 w-[42%] rounded-md bg-gray-200 dark:bg-white/10" />

            <div className="mt-3 space-y-2">
              <div className="h-3 w-[95%] rounded-md bg-gray-200 dark:bg-white/10" />
              <div
                className={`h-3 rounded-md bg-gray-200 dark:bg-white/10 ${
                  index % 2 === 0 ? "w-[68%]" : "w-[52%]"
                }`}
              />
            </div>

            <div className="mt-4 h-2.5 w-[27%] rounded-md bg-gray-200/80 dark:bg-white/[0.07]" />
          </div>

          <div className="relative h-9 w-9 shrink-0 rounded-lg bg-gray-100 dark:bg-white/[0.06]" />
        </div>
      ))}

      <span className="sr-only">Loading notifications...</span>
    </div>
  );
}
