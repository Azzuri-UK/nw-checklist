
export type RegionId = 'EU Central' | 'US East' | 'US West' | 'SA East' | 'AP Southeast';

export interface Region {
    id: RegionId;
    label: string;
    timeZone: string;
}

/**
 * Regions as shown on NWDB (https://nwdb.info/server-status).
 * Time zones are chosen to match the AWS region that hosts each:
 * - EU Central -> Europe/Berlin (eu-central-1 / CET-CEST)
 * - US East    -> America/New_York (us-east-1 / ET)
 * - US West    -> America/Los_Angeles (us-west-2 / PT)
 * - SA East    -> America/Sao_Paulo (sa-east-1 / BRT)
 * - AP Southeast -> Australia/Sydney (ap-southeast-2 / AEST/AEDT)
 */
export const REGIONS: Region[] = [
    { id: 'EU Central', label: 'EU Central', timeZone: 'Europe/Berlin' },
    { id: 'US East', label: 'US East', timeZone: 'America/New_York' },
    { id: 'US West', label: 'US West', timeZone: 'America/Los_Angeles' },
    { id: 'SA East', label: 'SA East', timeZone: 'America/Sao_Paulo' },
    { id: 'AP Southeast', label: 'AP Southeast', timeZone: 'Australia/Sydney' },
];

/** Get a region by id; defaults to EU Central if unknown. */
export function getRegion(id?: string | null): Region {
    const found = REGIONS.find(r => r.id === id);
    return found ?? REGIONS[0];
}

/** Returns localStorage key for region selection. */
export const REGION_STORAGE_KEY = 'nw-region';

/** Persist + load selected region */
export function saveRegion(id: RegionId) {
    try { localStorage.setItem(REGION_STORAGE_KEY, id); } catch {}
}
export function loadRegion(): Region {
    try {
        const id = localStorage.getItem(REGION_STORAGE_KEY) as RegionId | null;
        return getRegion(id);
    } catch {
        return getRegion(null);
    }
}

/**
 * Compute the absolute timestamp (ms since epoch) for the next occurrence of
 * 05:00 in `timeZone` (server time). This handles DST via Intl roundtrips.
 */
export function nextDailyResetMs(timeZone: string, now: Date = new Date()): number {
    // Current date parts in the server tz
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(now);

    const get = (t: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find(p => p.type === t)?.value);

    const y = get('year');
    const m = get('month');
    const d = get('day');
    const h = get('hour');
    const min = get('minute');

    // Determine if today's 05:00 has passed (in server tz)
    const hasPassedReset = h > 5 || (h === 5 && min >= 0);

    // Pick target date components in server tz
    const targetDate = new Date(Date.UTC(y, m - 1, d, 5, 0, 0, 0));
    if (hasPassedReset) {
        // add 1 day (still as a naive UTC date container)
        targetDate.setUTCDate(targetDate.getUTCDate() + 1);
    }

    // Convert the *server tz wall time* (05:00) to an absolute UTC timestamp.
    // Technique: get the tz-specific offset by round-tripping through toLocaleString.
    // 1) Build a UTC date with the same Y-M-D 05:00
    const utcCandidate = targetDate; // already UTC-based container
    // 2) Convert that instant into server tz wall clock, as a system-date
    const tzWallAsLocal = new Date(
        utcCandidate.toLocaleString('en-US', { timeZone })
    );
    // 3) Difference between the two reveals the offset at that date
    const offset = tzWallAsLocal.getTime() - utcCandidate.getTime();
    // 4) Adjust in the opposite direction to get the real UTC ms for tz wall time
    const targetUtcMs = utcCandidate.getTime() - offset;
    return targetUtcMs;
}
