'use client';

import React from 'react';
import Modal from '@/components/Modal';
import {RefreshCcw} from 'lucide-react';

type Props = {
    open: boolean;
    onClose: () => void;

    onExport: () => void;
    onImport: (json: string) => void;

    onQuickAddChestByTag: () => void;
    onResetCounters: () => void;
    onRestoreDefaults: () => void; // should clear localStorage and reload
};

export default function SettingsModal({
                                          open,
                                          onClose,
                                          onExport,
                                          onImport,
                                          onQuickAddChestByTag,
                                          onResetCounters,
                                          onRestoreDefaults,
                                      }: Props) {
    return (
        <Modal open={open} onClose={onClose} title="Settings & Data">
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onRestoreDefaults}
                    className="inline-flex items-center gap-2 rounded-2xl px-3 py-2"
                    style={{background: '#141414', border: '1px solid #2a2518'}}
                    title="Restore today's list & order to defaults"
                >
                    <RefreshCcw className="h-4 w-4"/> Restore defaults
                </button>

                <button
                    onClick={onClose}
                    className="ml-auto inline-flex items-center gap-2 rounded-2xl px-3 py-2"
                    style={{background: '#c8a74e', color: '#111'}}
                    title="Close"
                >
                    Close
                </button>
            </div>

            <p className="mt-3 text-sm opacity-80">
                Data is stored locally in your browser. Each day auto-resets at midnight (Europe/London).
            </p>
        </Modal>
    );
}
