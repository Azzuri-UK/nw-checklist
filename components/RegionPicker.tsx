'use client';

import React from 'react';
import { REGIONS, RegionId, loadRegion, saveRegion } from '@/lib/regions';

export default function RegionPicker({
                                         value,
                                         onChange,
                                     }: {
    value?: RegionId;
    onChange?: (id: RegionId) => void;
}) {
    const [current, setCurrent] = React.useState<RegionId>(
        (value ?? loadRegion().id) as RegionId
    );

    React.useEffect(() => {
        if (value && value !== current) setCurrent(value);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handle = (id: RegionId) => {
        setCurrent(id);
        saveRegion(id);
        onChange?.(id);
    };

    return (
        <div className="flex items-center gap-2 text-sm">
            <label className="opacity-80">Region:</label>
            <select
                value={current}
                onChange={(e) => handle(e.target.value as RegionId)}
                className="rounded-xl border px-2 py-1"
                style={{ background: '#141414', borderColor: '#2a2518', color: '#f1e9d2' }}
            >
                {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                        {r.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
