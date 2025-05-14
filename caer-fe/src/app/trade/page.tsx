'use client';

import React from 'react';
import SwapPanel from './components/SwapPanel';

export default function TradePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="container mx-auto max-w-xl">
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-200">
                    <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Swap Token</h1>
                    <SwapPanel />
                </div>
            </div>
        </div>
    );
}
