import { useState, useEffect, useRef } from 'react';
import { signInWithGoogle, signInWithSolana } from '../firebase';
import PropTypes from 'prop-types';

export default function SignInModal({ isOpen, onClose, setAccount }) {
  const modalRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setError(null);
      // Redirect result handled in App.jsx
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSolanaSignIn = async () => {
    try {
      const { user, publicKey } = await signInWithSolana();
      setAccount(user);
      setError(null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to connect Solana wallet.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#0A0A0A] bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="signin-modal-title"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="glass-card p-8 max-w-md w-full rounded-md bg-[#0A0A0A] border border-[#00CCFF]"
        tabIndex="-1"
      >
        <h2 id="signin-modal-title" className="text-2xl font-bold text-[#00CCFF] font-bebas mb-4">
          Sign In
        </h2>
        {error && <p className="text-[#FF00FF] font-orbitron mb-4">{error}</p>}
        <div className="space-y-4">
          <button
            className="bg-[#00CCFF] text-[#0A0A0A] px-6 py-3 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors touch-manipulation w-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
          >
            Sign In with Google
          </button>
          <button
            className="bg-[#FF00FF] text-[#0A0A0A] px-6 py-3 rounded-md hover:bg-[#00CCFF] font-orbitron font-bold transition-colors touch-manipulation w-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            onClick={handleSolanaSignIn}
            aria-label="Connect Solana wallet"
          >
            Connect Solana Wallet
          </button>
        </div>
        <button
          className="mt-4 text-[#00CCFF] hover:text-[#FF00FF] font-orbitron focus:outline-none focus:underline"
          onClick={onClose}
          aria-label="Close sign-in modal"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

SignInModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setAccount: PropTypes.func.isRequired,
};