import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { usePrivy, PrivyProvider } from '@privy-io/react-auth';

// Loading screen during wallet initialization
const PrivyLoading = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-blue mx-auto mb-4"></div>
      <p className="text-white text-xl font-orbitron">Initializing Wallet...</p>
      <p className="text-gray-400 text-sm mt-2">Connecting to Solana network</p>
    </div>
  </div>
);

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy();
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    authenticated: false,
    accessToken: null,
  });

  useEffect(() => {
    if (!ready) return;

    const setLoggedOut = () =>
      setAuthState({
        user: null,
        loading: false,
        authenticated: false,
        accessToken: null,
      });

    if (!authenticated || !user) {
      setLoggedOut();
      return;
    }

    getAccessToken()
      .then((token) => {
        setAuthState({
          user,
          loading: false,
          authenticated: true,
          accessToken: token ?? null,
        });
      })
      .catch((err) => {
        console.error('Error getting access token:', err);
        setAuthState({
          user,
          loading: false,
          authenticated: true,
          accessToken: null,
        });
      });
  }, [ready, authenticated, user, getAccessToken]);

  if (authState.loading) return <PrivyLoading />;

  return (
    <AuthContext.Provider value={{ ...authState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const PrivyAuthProvider = ({ children }) => {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

  // Fail-fast if APP ID is not valid
  if (!privyAppId || typeof privyAppId !== 'string' || privyAppId.trim().length < 10) {
    console.error('Invalid Privy App ID. Please check your .env file.');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
          <p className="text-gray-300 mb-4">
            Invalid Privy App ID. Please check your environment configuration.
          </p>
          <p className="text-sm text-gray-500">
            Make sure VITE_PRIVY_APP_ID is properly set in your .env file.
          </p>
        </div>
      </div>
    );
  }

  // Base config (Solana + embedded wallet + Google)
  const baseConfig = useMemo(() => ({
    appearance: {
      theme: 'dark',
      accentColor: '#676FFF',
      logo: '/assets/playrush-logo.png',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      privyWalletOverride: false,
    },
    loginMethods: ['wallet', 'google'],
    supportedChains: [
      {
        name: 'Solana',
        id: 'solana',
      },
    ],
    defaultChain: {
      name: 'Solana',
      id: 'solana',
    },
    // External Solana wallets
    externalWallets: {
      enabled: true,
      connectors: [
        { name: 'Phantom', connector: 'phantom', privyWalletOverride: false },
        { name: 'Solflare', connector: 'solflare', privyWalletOverride: false },
        { name: 'Coinbase Wallet', connector: 'coinbase_wallet', privyWalletOverride: false },
      ],
    },
  }), []);

  // Defensive normalization to guarantee the SDK never sees undefined
  const normalizeConnectors = useMemo(() => (cfg) => {
    const ext = cfg?.externalWallets ?? {};
    const raw = Array.isArray(ext.connectors) ? ext.connectors : [];
    const connectors = raw
      .filter(Boolean)
      .map((c) => ({
        name: String(c?.name ?? ''),
        connector: String(c?.connector ?? ''),
        privyWalletOverride: Boolean(c?.privyWalletOverride),
      }))
      // keep only valid entries
      .filter((c) => c.name && c.connector);

    return {
      ...cfg,
      externalWallets: {
        enabled: Boolean(ext.enabled),
        connectors, // always an array, never undefined
      },
    };
  }, []);

  const privyConfig = useMemo(() => normalizeConnectors(baseConfig), [baseConfig, normalizeConnectors]);

  // Visibility for runtime verification
  console.log('Privy App ID:', privyAppId);
  console.log('Privy Config:', privyConfig);

  return (
    <PrivyProvider appId={privyAppId} config={privyConfig}>
      <AuthProvider>{children}</AuthProvider>
    </PrivyProvider>
  );
};
