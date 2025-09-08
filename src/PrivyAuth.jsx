import { createContext, useContext, useEffect, useState } from 'react';
import { usePrivy, PrivyProvider } from '@privy-io/react-auth';

// Create context for authentication state
const AuthContext = createContext();

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const { ready, authenticated, user, logout, getAccessToken } = usePrivy();
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    authenticated: false,
    accessToken: null
  });

  useEffect(() => {
    if (ready) {
      if (authenticated && user) {
        // Get access token for API calls
        getAccessToken().then(token => {
          setAuthState({
            user: user,
            loading: false,
            authenticated: true,
            accessToken: token
          });
        }).catch(error => {
          console.error('Error getting access token:', error);
          setAuthState({
            user: user,
            loading: false,
            authenticated: true,
            accessToken: null
          });
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          authenticated: false,
          accessToken: null
        });
      }
    }
  }, [ready, authenticated, user, getAccessToken]);

  const value = {
    ...authState,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Wrapper component that includes the PrivyProvider
export const PrivyAuthProvider = ({ children }) => {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;
  
  // Validate Privy app ID
  if (!privyAppId || privyAppId.length < 10) {
    console.error('Invalid Privy App ID. Please check your .env file.');
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
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

  const privyConfig = {
    appearance: {
      theme: 'dark',
      accentColor: '#676FFF',
      logo: '/assets/playrush-logo.png',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
    loginMethods: ['wallet', 'google'],
    supportedChains: ['solana'],
    defaultChain: 'solana',
    privyWalletOverride: {
      solanaClusters: [
        {
          name: 'mainnet-beta',
          rpcUrl: 'https://api.mainnet-beta.solana.com',
        },
      ],
    },
    walletConnectors: [
      {
        name: 'Phantom',
        connector: 'phantom',
      },
      {
        name: 'Solflare',
        connector: 'solflare',
      },
      {
        name: 'Coinbase Wallet',
        connector: 'coinbase_wallet',
      },
    ],
  };

  // Defensive check for privyWalletOverride
  if (!privyConfig.privyWalletOverride) {
    console.warn('privyWalletOverride is undefined, using default configuration');
    privyConfig.privyWalletOverride = {
      solanaClusters: [
        {
          name: 'mainnet-beta',
          rpcUrl: 'https://api.mainnet-beta.solana.com',
        },
      ],
    };
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={privyConfig}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </PrivyProvider>
  );
}
