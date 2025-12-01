import React, { useState, useEffect } from 'react';

export default function SlotMachine({ items, target, onFinished, duration = 2000 }) {
    const [displayItem, setDisplayItem] = useState(items[0]);

    useEffect(() => {
        let interval;
        const startTime = Date.now();

        interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;

            if (elapsedTime > duration) {
                clearInterval(interval);
                setDisplayItem(target);
                onFinished();
            } else {
                const randomIndex = Math.floor(Math.random() * items.length);
                setDisplayItem(items[randomIndex]);
            }
        }, 80);

        return () => clearInterval(interval);
    }, [items, target, duration, onFinished]);

    return (
        <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent to-brand-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative text-5xl font-bold text-center p-10 bg-black/80 rounded-2xl border border-brand-accent/50 shadow-[0_0_30px_rgba(56,189,248,0.2)] min-w-[350px] backdrop-blur-xl">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-brand-accent"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-brand-accent"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-brand-accent"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-brand-accent"></div>

                <div className="animate-bounce font-mono text-brand-text tech-glow tracking-wider">
                    {displayItem?.name || displayItem || "?"}
                </div>
            </div>
        </div>
    );
}
