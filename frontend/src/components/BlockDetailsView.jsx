import { useState, useEffect } from 'react';

function BlockDetailsView({ block, onSelectTx }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    setDetails(null);
    fetch(`/api/block/${block.hash}`)
      .then(res => res.json())
      .then(json => setDetails(json));
  }, [block]);

  if (details === null) return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-zinc-800 rounded w-1/3 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-zinc-800 rounded-md" />)}
      </div>
    </div>
  );

  const date = new Date(block.time * 1000).toLocaleString();

  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-5">
        <h2 className="text-base font-semibold text-zinc-100">Block <span className="font-mono text-orange-400">#{block.height}</span></h2>
        <span className="font-mono text-xs text-zinc-500 break-all">{block.hash}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-800 rounded-md p-3">
          <p className="text-xs text-zinc-500 mb-1">Transactions</p>
          <p className="font-mono text-zinc-100 text-sm">{details.nTx.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-800 rounded-md p-3">
          <p className="text-xs text-zinc-500 mb-1">Size</p>
          <p className="font-mono text-zinc-100 text-sm">{(details.size / 1000).toFixed(1)} kB</p>
        </div>
        <div className="bg-zinc-800 rounded-md p-3">
          <p className="text-xs text-zinc-500 mb-1">Difficulty</p>
          <p className="font-mono text-zinc-100 text-sm">{(details.difficulty / 1e12).toFixed(2)} T</p>
        </div>
        <div className="bg-zinc-800 rounded-md p-3">
          <p className="text-xs text-zinc-500 mb-1">Mined</p>
          <p className="font-mono text-zinc-100 text-sm">{date}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">
          Transactions <span className="text-zinc-600 font-normal normal-case">(showing first 10 of {details.tx.length.toLocaleString()})</span>
        </p>
        <div className="space-y-1">
          {details.tx.slice(0, 10).map(txid => (
            <button
              key={txid}
              onClick={() => onSelectTx({ txid, blockHash: block.hash })}
              className="block w-full text-left font-mono text-xs text-orange-400 hover:text-orange-300 truncate py-0.5 transition-colors"
            >
              {txid}
            </button>
          ))}
        </div>
        {details.tx.length > 10 && (
          <p className="text-xs text-zinc-600 mt-3">+{(details.tx.length - 10).toLocaleString()} more transactions</p>
        )}
      </div>
    </div>
  );
}

export default BlockDetailsView;