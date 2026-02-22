import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState, useEffect } from 'react';

// --- Backend URL ---
// Point this to your backend (Google Sheets, Cloudflare Worker, etc.)
// Leave empty for local-only mode (localStorage).
const API_URL = 'https://script.google.com/macros/s/AKfycbwOvQclf3UMopaiRXm0XqMRTI2QZGxi9CB1Rk_WhDrBd2BzUzUn7m1BdHzIg3sFo03slg/exec';

const Signature = () => {
    const [votes, setVotes] = useState({ up: 0, down: 0 });
    const [userVote, setUserVote] = useState(null); // 'up' | 'down' | null
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('signature-vote');
        if (saved) setUserVote(saved);

        if (!API_URL) return;
        fetch(API_URL, { redirect: 'follow' })
            .then(res => res.json())
            .then(data => setVotes({ up: data.up || 0, down: data.down || 0 }))
            .catch(() => { });
    }, []);

    const handleVote = async (type) => {
        if (userVote === type || loading) return;
        setLoading(true);

        const prev = { ...votes };
        const newVotes = { ...votes };
        if (userVote) newVotes[userVote] = Math.max(0, newVotes[userVote] - 1);
        newVotes[type] = newVotes[type] + 1;
        setVotes(newVotes);
        setUserVote(type);
        localStorage.setItem('signature-vote', type);

        if (API_URL) {
            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain' },
                    body: JSON.stringify({ type, previous: userVote }),
                    redirect: 'manual',
                });
                // Google Apps Script returns 302 — the write happens before the redirect,
                // so we don't need to follow it or read the response.
            } catch {
                setVotes(prev);
            }
        }
        setLoading(false);
    };

    const score = votes.up - votes.down;

    return (
        <section className="py-16 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-8"
            >
                <img
                    src="/cy-signature.png"
                    alt="Christian Yoon signature"
                    className="h-20 md:h-28 object-contain invert opacity-80"
                />

                <div className="flex flex-col items-center gap-5">
                    <p className="text-neutral-500 text-md">rate my signature :)</p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleVote('up')}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${userVote === 'up'
                                ? 'text-green-400 bg-green-400/10'
                                : 'text-neutral-500 hover:text-green-400 hover:bg-green-400/5'
                                }`}
                            aria-label="Upvote signature"
                        >
                            <ThumbsUp size={25} />
                        </button>

                        <AnimatePresence mode="wait">
                            <motion.span
                                key={score}
                                initial={{ y: 5, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className={`text-sm font-mono min-w-[2ch] text-center ${score > 0 ? 'text-green-400' : score < 0 ? 'text-red-400' : 'text-neutral-500'
                                    }`}
                            >
                                {score}
                            </motion.span>
                        </AnimatePresence>

                        <button
                            onClick={() => handleVote('down')}
                            disabled={loading}
                            className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${userVote === 'down'
                                ? 'text-red-400 bg-red-400/10'
                                : 'text-neutral-500 hover:text-red-400 hover:bg-red-400/5'
                                }`}
                            aria-label="Downvote signature"
                        >
                            <ThumbsDown size={25} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Signature;
