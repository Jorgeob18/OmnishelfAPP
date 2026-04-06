export function SkeletonCard() {
    return (
        <div className="flex gap-3 p-3 rounded-xl bg-neutral-800/60 animate-pulse">
            <div className="w-14 h-20 rounded-lg bg-neutral-700 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-neutral-700 rounded w-3/4" />
                <div className="h-3 bg-neutral-700 rounded w-1/3" />
                <div className="h-3 bg-neutral-700 rounded w-full mt-2" />
                <div className="h-3 bg-neutral-700 rounded w-5/6" />
            </div>
        </div>
    )
}
