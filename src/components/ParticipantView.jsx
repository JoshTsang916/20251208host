import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateId } from '../utils';

export default function ParticipantView() {
    const [name, setName] = useState('');
    const [question, setQuestion] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!name || !question) return;
        setLoading(true);

        let id = localStorage.getItem('participant_id');
        // Validate UUID format (simple regex check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!id || !uuidRegex.test(id)) {
            id = generateId();
            localStorage.setItem('participant_id', id);
        }

        try {
            const { error } = await supabase
                .from('participants')
                .upsert({ id, name, question, is_active: true });

            if (error) {
                console.error('Error joining:', error);
                alert(`加入失敗: ${error.message || error.details || '請檢查網路連線'}`);
            } else {
                setHasJoined(true);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            alert('發生未預期的錯誤，請稍後再試。');
        }
        setLoading(false);
    };

    if (hasJoined) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Tech Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-brand-accent/30 rounded-tl-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-brand-accent/30 rounded-br-3xl"></div>
                </div>

                <div className="bg-brand-bg/80 backdrop-blur-md p-8 rounded-2xl tech-border max-w-sm w-full text-center relative z-10">
                    <h1 className="text-3xl font-bold mb-4 text-brand-primary amber-glow">加入成功！</h1>
                    <p className="text-gray-300 mb-8 font-mono">系統已登錄您的資料</p>

                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 border-4 border-brand-accent/20 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 border-4 border-brand-accent rounded-full flex items-center justify-center">
                            <span className="text-2xl">✓</span>
                        </div>
                    </div>

                    <p className="text-brand-accent animate-pulse font-mono">請關注大螢幕...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
            <div className="w-full max-w-md relative z-10">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold mb-2 text-brand-primary amber-glow tracking-wider">思維共振</h1>
                    <div className="h-1 w-24 bg-brand-accent mx-auto rounded-full shadow-[0_0_10px_#38BDF8]"></div>
                    <p className="mt-4 text-brand-accent font-mono text-sm tracking-widest">SYSTEM INITIALIZATION...</p>
                </header>

                <form onSubmit={handleJoin} className="bg-brand-bg/50 backdrop-blur-md p-8 rounded-2xl tech-border space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-brand-accent mb-2 font-mono tracking-wider">代號 (NAME)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-gray-600 transition-all font-mono"
                            placeholder="請輸入您的名字"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-brand-accent mb-2 font-mono tracking-wider">提問 (QUERY)</label>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:border-transparent text-white placeholder-gray-600 transition-all h-48 resize-none font-mono text-sm leading-relaxed"
                            placeholder={`請填寫一個問題，例如：
• 推薦型：「你今年最愛的一個電影or漫畫，為什麼推薦？」
• 腦洞型：「如果你能跟某個名人對談，你會選誰？為什麼？」
• 價值觀型：「如果可以擁有一項超能力，你希望是什麼？」`}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-brand-accent to-blue-600 rounded-lg font-bold text-white text-lg tracking-widest hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all disabled:opacity-50 border border-brand-accent/50 relative overflow-hidden group"
                    >
                        <span className="relative z-10">{loading ? '連線中...' : '確認接入系統'}</span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>
            </div>
        </div>
    );
}
