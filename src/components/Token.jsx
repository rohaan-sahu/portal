export default function Token() {
  const tokenInfo = {
    name: 'Playrush Token (PRUSH)',
    totalSupply: '1,000,000,000',
    utility: 'In-game purchases, governance, staking rewards',
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl mb-4">Playrush Token</h2>
      <div className="bg-gray-700 p-4 rounded">
        <p><strong>Name:</strong> {tokenInfo.name}</p>
        <p><strong>Total Supply:</strong> {tokenInfo.totalSupply}</p>
        <p><strong>Utility:</strong> {tokenInfo.utility}</p>
        <button className="bg-green-500 px-4 py-2 mt-4 rounded">Buy PRUSH</button>
      </div>
    </div>
  );
}