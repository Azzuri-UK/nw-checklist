'use client';

import React, {useEffect, useRef} from 'react';

export default function Modal({
                                  open,
                                  onClose,
                                  title,
                                  children,
                              }: {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}) {
    const dialogRef = useRef<HTMLDivElement>(null);

    // Close on ESC
    useEffect(() => {
        if (!open) return;

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    // Basic focus handling + scroll lock
    useEffect(() => {
        if (!open) return;
        const el = dialogRef.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        // Focus first focusable element inside modal
        const focusables = el?.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusables?.[0]?.focus();

        // Lock body scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
            previouslyFocused?.focus?.();
        };
    }, [open]);

    if (!open) return null;

    const closeOnBackdrop = (e: React.MouseEvent) => {
        // Only close if the click originated on the backdrop (not inside the dialog)
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onMouseDown={closeOnBackdrop}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background: 'rgba(0,0,0,0.6)'}}
            aria-hidden={!open}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title ?? 'Dialog'}
                className="w-full max-w-3xl rounded-2xl border shadow-lg"
                style={{background: '#0e0d09', borderColor: '#2a2518'}}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {title && (
                    <div
                        className="px-4 py-3 text-lg font-semibold border-b"
                        style={{borderColor: '#2a2518', color: '#c8a74e'}}
                    >
                        {title}
                    </div>
                )}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
