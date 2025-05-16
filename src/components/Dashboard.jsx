export default function Dashboard({ account }) {
  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Dashboard</h2>
      {account ? (
        <div>
          <p>Welcome, {account.slice(0, 6)}...{account.slice(-4)}!</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl">Your NFTs</h3>
              <p>3 Owned Assets</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl">PRUSH Balance</h3>
              <p>1000 PRUSH</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Please connect your wallet to view your dashboard.</p>
      )}
    </div>
  );
}