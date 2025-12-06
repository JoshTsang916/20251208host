import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SlotMachine from './SlotMachine';
import MusicPlayer from './MusicPlayer';

export default function HostView() {
    const [participants, setParticipants] = useState([]);
    const [gameState, setGameState] = useState('lobby');
    // states: lobby, picking_first_q, show_first_q, picking_answerer, answering, closing, show_next_q_transition, show_q_wait_for_draw

    const [currentQSource, setCurrentQSource] = useState(null);
    const [currentAnswerer, setCurrentAnswerer] = useState(null);
    const [spokenIds, setSpokenIds] = useState(new Set());
    const [spinTarget, setSpinTarget] = useState(null);

    useEffect(() => {
        const subscription = supabase
            .channel('participants')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
                fetchParticipants();
            })
            .subscribe();

        fetchParticipants();
        return () => { subscription.unsubscribe(); };
    }, []);

    const fetchParticipants = async () => {
        const { data } = await supabase.from('participants').select('*');
        if (data) setParticipants(data);
    };

    const startGame = () => {
        if (participants.length === 0) return;

        // Set Host as the first question source
        // You can customize the Host's name and question here
        const hostData = {
            id: 'host',
            name: '主持人',
            question: '大家今天最期待分享的一本書是什麼？' // Default Host Question
        };

        setCurrentQSource(hostData);
        setGameState('show_first_q');
    };

    const onFirstQPicked = () => {
        // This function is no longer needed for the first step, 
        // but we keep it if we want to revert to random pick later.
        setCurrentQSource(spinTarget);
        setGameState('show_first_q');
    };

    const drawAnswerer = () => {
        setGameState('picking_answerer');
        const available = participants.filter(p => !spokenIds.has(p.id) && p.id !== currentQSource.id);

        if (available.length === 0) {
            setGameState('closing');
            return;
        }

        const randomP = available[Math.floor(Math.random() * available.length)];
        setSpinTarget(randomP);
    };

    const onAnswererPicked = () => {
        setCurrentAnswerer(spinTarget);
        setSpokenIds(prev => new Set(prev).add(spinTarget.id));
        setGameState('answering');
    };

    const nextRound = () => {
        setCurrentQSource(currentAnswerer);
        setCurrentAnswerer(null);

        const available = participants.filter(p => !spokenIds.has(p.id) && p.id !== currentAnswerer.id);
        if (available.length === 0 && participants.length > 1) {
            setGameState('closing');
        } else {
            setGameState('show_next_q_transition');
            setTimeout(() => {
                setGameState('show_q_wait_for_draw');
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col p-8 font-sans relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-10 left-10 w-64 h-64 border border-brand-accent/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 border border-brand-primary/10 rounded-full animate-pulse delay-1000"></div>

            {/* Floating Data Packets Animation */}
            {gameState === 'lobby' && participants.map((p, i) => (
                <div
                    key={p.id}
                    className="absolute animate-float pointer-events-none"
                    style={{
                        left: `${(i * 17 + 10) % 80}%`,
                        top: `${(i * 23 + 20) % 60 + 20}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${10 + (i % 5)}s`
                    }}
                >
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-brand-accent/20 border border-brand-accent rounded-lg flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                            <span className="text-2xl">📦</span>
                        </div>
                        <div className="mt-2 text-brand-accent font-mono text-xs bg-black/50 px-2 py-1 rounded border border-brand-accent/30">
                            {p.name}
                        </div>
                    </div>
                </div>
            ))}

            <div className="max-w-7xl mx-auto w-full relative z-10">
                <header className="flex justify-between items-center mb-12 border-b border-brand-accent/20 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-12 bg-brand-primary shadow-[0_0_15px_#FFB703]"></div>
                        <h1 className="text-4xl font-bold text-brand-primary amber-glow tracking-widest">
                            思維共振 <span className="text-xl text-brand-accent/80 font-mono align-middle ml-2">MIND RESONANCE</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 px-6 py-2 rounded-full border border-brand-accent/30">
                        <span className="text-brand-accent font-mono text-sm">連線人數:</span>
                        <span className="text-2xl font-mono font-bold text-white">{participants.length.toString().padStart(2, '0')}</span>
                    </div>
                </header>

                {gameState === 'lobby' && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <div className="bg-white p-4 rounded-xl mb-8 shadow-[0_0_50px_rgba(56,189,248,0.3)]">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin)}`} alt="QR Code" />
                        </div>
                        <p className="text-3xl text-brand-accent mb-12 font-mono tracking-widest animate-pulse">請掃描 QR Code 加入</p>

                        <button onClick={startGame} className="px-12 py-5 bg-brand-primary text-black text-2xl font-bold rounded-sm hover:bg-yellow-400 transition-all shadow-[0_0_30px_rgba(255,183,3,0.4)] tracking-widest uppercase clip-path-polygon">
                            開始活動
                        </button>

                        <div className="mt-16 flex flex-wrap gap-4 justify-center max-w-4xl z-20">
                            {participants.map((p) => (
                                <div key={p.id} className="px-6 py-2 bg-brand-accent/10 border border-brand-accent/40 text-brand-accent rounded-sm font-mono text-sm animate-fade-in flex items-center gap-2">
                                    <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                                    {p.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'picking_first_q' && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <h2 className="text-4xl mb-12 text-brand-accent font-mono tracking-widest">正在抽取第一題...</h2>
                        <SlotMachine items={participants} target={spinTarget} onFinished={onFirstQPicked} />
                    </div>
                )}

                {(gameState === 'show_first_q' || gameState === 'show_q_wait_for_draw') && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="mb-6 text-brand-accent font-mono tracking-widest text-xl border-b border-brand-accent/30 pb-2 px-8">提問者</div>
                        <div className="text-5xl font-bold text-brand-primary amber-glow mb-12">{currentQSource?.name}</div>

                        <div className="text-5xl font-bold mb-16 max-w-5xl leading-tight text-white drop-shadow-lg">
                            "{currentQSource?.question}"
                        </div>

                        <button onClick={drawAnswerer} className="px-10 py-5 bg-transparent border-2 border-brand-accent text-brand-accent text-xl font-bold hover:bg-brand-accent hover:text-black transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] tracking-widest">
                            抽取回答者
                        </button>
                    </div>
                )}

                {gameState === 'picking_answerer' && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <h2 className="text-4xl mb-12 text-brand-primary font-mono tracking-widest">尋找目標回答者...</h2>
                        <SlotMachine items={participants} target={spinTarget} onFinished={onAnswererPicked} />
                    </div>
                )}

                {gameState === 'answering' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="flex items-center gap-16 mb-16">
                            <div className="text-center opacity-60 scale-90">
                                <div className="text-sm text-brand-accent font-mono mb-2">提問</div>
                                <div className="text-3xl font-bold text-white">{currentQSource?.name}</div>
                            </div>
                            <div className="text-4xl text-brand-primary animate-pulse">▶▶▶</div>
                            <div className="text-center scale-110 transform transition-transform p-8 border border-brand-primary/30 bg-brand-primary/5 rounded-xl shadow-[0_0_30px_rgba(255,183,3,0.1)]">
                                <div className="text-sm text-brand-primary font-mono mb-2">回答</div>
                                <div className="text-5xl font-bold text-brand-primary amber-glow">{currentAnswerer?.name}</div>
                            </div>
                        </div>

                        <div className="text-4xl font-bold mb-20 max-w-5xl leading-tight bg-black/40 p-10 rounded-2xl border-l-4 border-brand-accent backdrop-blur-sm">
                            "{currentQSource?.question}"
                        </div>

                        <button onClick={nextRound} className="px-10 py-4 bg-white text-black text-xl font-bold hover:bg-gray-200 transition-colors shadow-lg tracking-widest">
                            下一位
                        </button>
                    </div>
                )}

                {gameState === 'show_next_q_transition' && (
                    <div className="flex flex-col items-center justify-center h-[60vh]">
                        <h2 className="text-5xl font-bold text-brand-accent animate-pulse font-mono">系統更新中...</h2>
                    </div>
                )}

                {gameState === 'closing' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <h2 className="text-7xl font-bold mb-12 text-brand-primary amber-glow tracking-widest">
                            最終回合
                        </h2>
                        <div className="text-3xl text-gray-300 mb-8 font-mono">主持人請回答：</div>
                        <div className="text-6xl font-bold mb-12 text-white">
                            "{currentQSource?.question}"
                        </div>
                        <div className="text-xl text-brand-accent font-mono border border-brand-accent/30 px-6 py-2 rounded-full inline-block">
                            來自: {currentQSource?.name}
                        </div>
                    </div>
                )}

                <MusicPlayer />
            </div>
        </div>
    );
}
