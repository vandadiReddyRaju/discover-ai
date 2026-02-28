import React, { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import AskQuery from './components/AskQuery';
import { Bot, LogIn, LogOut } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { API_BASE_URL } from './config';

function App() {
  const [products, setProducts] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  useEffect(() => {
    fetchAllProducts();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
      setAiSummary(null);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchResults = (matchedProducts, summary) => {
    setProducts(matchedProducts);
    setAiSummary(summary);
  };

  const handleReset = () => {
    setAiSummary(null);
    fetchAllProducts();
  };

  return (
    <ThemeProvider>
      <div className="app-container">
        <div className="top-bar">
          <ThemeToggle />

          <div className="auth-section">
            {authLoading ? (
              <div className="loader auth-loader"></div>
            ) : user ? (
              <div className="user-profile">
                <div className="avatar text-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <a href={`${API_BASE_URL}/auth/logout`} className="logout-btn" title="Logout">
                  <LogOut size={20} />
                </a>
              </div>
            ) : (
              <a href={`${API_BASE_URL}/auth/google`} className="google-icon-btn" title="Sign in with Google">
                <div className="google-icon-circle">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" className="google-icon" />
                </div>
                <LogIn size={20} className="login-icon" />
              </a>
            )}
          </div>
        </div>

        <header>
          <h1>Discover.AI</h1>
          <p className="subtitle">Find exactly what you need with magic AI curation</p>
        </header>

        <AskQuery onResults={handleSearchResults} isAuthenticated={!!user} />

        {aiSummary && (
          <div className="ai-summary">
            <span><Bot size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} /> AI says:</span> {aiSummary}
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: '1px solid #ec4899',
                  color: '#ec4899',
                  padding: '5px 15px',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>
                Clear Search & Show All
              </button>
            </div>
          </div>
        )}

        <main>
          {isLoading ? (
            <div style={{ textAlign: 'center', margin: '3rem 0', color: '#94a3b8' }}>Loading catalog...</div>
          ) : (
            <>
              <h2 style={{ marginBottom: '1.5rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {aiSummary ? `Found ${products.length} matches` : 'Complete Catalog'}
              </h2>

              {products.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  No products found matching your search.
                </div>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
