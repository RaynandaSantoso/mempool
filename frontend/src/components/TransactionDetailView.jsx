import { useState, useEffect } from 'react';

function TransactionDetailView({ selection }) {
  const [tx, setTx] = useState(null);

  useEffect(() => {
    setTx(null);
    const url = selection.blockHash
      ? `/api/tx/${selection.txid}?blockhash=${selection.blockHash}`
      : `/api/tx/${selection.txid}`;

    fetch(url)
      .then(res => res.json())
      .then(json => setTx(json));
  }, [selection.txid]);

  if (tx === null) return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-zinc-800 rounded w-2/3 mb-4" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-zinc-800 rounded-md" />)}
      </div>
    </div>
  );

  if (tx.error) return (
    <div className="mt-6 bg-zinc-900 border border-red-900 rounded-lg p-6">
      <p className="text-sm text-red-400">{tx.error}</p>
      {tx.hint && <p className="text-xs text-zinc-500 mt-1">{tx.hint}</p>}
    </div>
  );

  const data = tx.data;
  const isConfirmed = tx.source === 'confirmed';

  const totalOut = isConfirmed && data.vout
    ? data.vout.reduce((sum, o) => sum + (o.value ?? 0), 0)
    : null;

  return (
    <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-base font-semibold text-zinc-100">Transaction</h2>
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isConfirmed ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
          {tx.source}
        </span>
      </div>
      <p className="font-mono text-xs text-zinc-500 break-all mb-5">{selection.txid}</p>

      {isConfirmed && data.vin && data.vout ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Inputs</p>
              <p className="font-mono text-zinc-100 text-sm">{data.vin.length}</p>
            </div>
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Outputs</p>
              <p className="font-mono text-zinc-100 text-sm">{data.vout.length}</p>
            </div>
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Size</p>
              <p className="font-mono text-zinc-100 text-sm">{data.size} B</p>
            </div>
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Total Out</p>
              <p className="font-mono text-zinc-100 text-sm">
                {totalOut !== null ? `${totalOut.toFixed(8)}` : '—'} <span className="text-orange-400">BTC</span>
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Outputs</p>
            <div className="space-y-1">
              {data.vout.map((output, index) => (
                <div key={index} className="flex items-center justify-between bg-zinc-800 rounded px-3 py-2 gap-4">
                  <span className="text-xs text-zinc-500 font-mono shrink-0">#{output.n ?? index}</span>
                  <span className="text-xs text-zinc-400 font-mono truncate flex-1">
                    {output.scriptPubKey?.address ?? output.scriptPubKey?.type ?? 'non-standard'}
                  </span>
                  <span className="font-mono text-sm text-zinc-100 shrink-0">
                    {output.value?.toFixed(8)} <span className="text-orange-400">BTC</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {data.vsize && (
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">vSize</p>
              <p className="font-mono text-zinc-100 text-sm">{data.vsize} vB</p>
            </div>
          )}
          {data.fees?.base !== undefined && (
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Fee</p>
              <p className="font-mono text-zinc-100 text-sm">{(data.fees.base * 1e8).toFixed(0)} sats</p>
            </div>
          )}
          {data.fees?.base !== undefined && data.vsize && (
            <div className="bg-zinc-800 rounded-md p-3">
              <p className="text-xs text-zinc-500 mb-1">Fee Rate</p>
              <p className="font-mono text-zinc-100 text-sm">
                {((data.fees.base * 1e8) / data.vsize).toFixed(1)} sat/vB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TransactionDetailView;