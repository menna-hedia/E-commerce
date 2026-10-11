export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[50vh] items-center justify-center gap-1.5"
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="loader-bar h-8 w-1.5 rounded-full bg-brand"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  )
}