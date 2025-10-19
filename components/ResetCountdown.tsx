'use client';

import React from 'react';
import { getRegion, nextDailyResetMs, RegionId } from '@/lib/regions';

function fmt2(n: number) { return n.toString().padStart(2, '0'); }

export default function ResetCountdown({ regionId }: { regionId: RegionId }) {
    const region = getRegion(regionId);
    const [targetMs, setTargetMs] = React.useState(() => nextDailyResetMs(region.timeZone));
    const [now, setNow] = React.useState(() => Date.now());

    // Tick every second
    React.useEffect(() => {
        const i = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(i);
    }, []);

    // Recompute when region changes (also re-evaluate DST if date flips)
    React.useEffect(() => {
        setTargetMs(nextDailyResetMs(region.timeZone));
    }, [regionId]);

    // If we crossed the target, schedule the next one
    React.useEffect(() => {
        if (now >= targetMs) setTargetMs(nextDailyResetMs(region.timeZone));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [now, targetMs]);

    const remaining = Math.max(0, targetMs - now);
    const sec = Math.floor(remaining / 1000) % 60;
    const min = Math.floor(remaining / (1000 * 60)) % 60;
    const hrs = Math.floor(remaining / (1000 * 60 * 60));
    const localTimeStr = new Date(targetMs).toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short',
        month: 'short',
        day: '2-digit',
    });

    return (
        <div className="text-sm opacity-90">
            Daily reset in <span className="font-semibold">{fmt2(hrs)}:{fmt2(min)}:{fmt2(sec)}</span>
            {' '}(<span title={`5:00 in ${region.label} server time`}>
        {localTimeStr} local
      </span>)
        </div>
    );
}
