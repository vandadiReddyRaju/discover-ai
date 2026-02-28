import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

const AskQuery = ({ onResults, isAuthenticated }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!query.trim() || !isAuthenticated) return;

        setIsLoading(true);
        setError(null);

        try {
            // Connect to the backend
            const response = await fetch(`${API_BASE_URL}/api/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to fetch from AI endpoint');
            }

            const data = await response.json();
            onResults(data.products, data.summary);
        } catch (err) {
            setError(err.message || 'Oops! Standard issue connecting to the AI brain. Check console or try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ask-query-container glass-panel">
            {!isAuthenticated && (
                <div style={{ padding: '0.5rem', background: '#fef3c7', color: '#92400e', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                    Please <strong>Sign in with Google</strong> to access the AI assistant.
                </div>
            )}

            <form onSubmit={handleAsk} className="input-group">
                <input
                    type="text"
                    className="query-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isAuthenticated ? "Ask AI: e.g. 'I need a good laptop for gaming'..." : "Sign in to use AI Search"}
                    disabled={isLoading || !isAuthenticated}
                />
                <button type="submit" className="ask-btn" disabled={isLoading || !query.trim() || !isAuthenticated}>
                    {isLoading ? (
                        <div className="loader"></div>
                    ) : (
                        <>
                            <Sparkles size={20} /> Ask AI
                        </>
                    )}
                </button>
            </form>

            {error && <div style={{ color: '#ef4444', marginTop: '10px' }}>{error}</div>}
        </div>
    );
};

export default AskQuery;
