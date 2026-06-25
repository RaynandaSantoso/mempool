import { useState, useEffect } from 'react';

function StatBox({ label, value }) {
  return (
    <div className="bg-zinc-800 rounded-md p-3">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="font-mono text-zinc-100 text-sm">{value}</p>
    </div>
  );
}

function TransactionDetailView({ selection, onClose }) {
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose])

  let content;

  if (tx === null) {
    content = (
      <div className="animate-pulse">
        <div className="h-4 bg-zinc-800 rounded w-2/3 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-zinc-800 rounded-md" />)}
        </div>
      </div>
    );
  }

  else if (tx.error) {
    content = (
      <div>
        <p className="text-sm text-red-400">{tx.error}</p>
        {tx.hint && <p className="text-xs text-zinc-500 mt-1">{tx.hint}</p>}
      </div>
    );
  }

  else {
    const data = tx.data;
    const isConfirmed = tx.source === 'confirmed';

    const totalOut = isConfirmed && data.vout
      ? data.vout.reduce((sum, o) => sum + (o.value ?? 0), 0)
      : null;

    content = (
      <>
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
              <StatBox label="Inputs" value={data.vin.length} />
              <StatBox label="Outputs" value={data.vout.length} />
              <StatBox label="Size" value={`${data.size} B`} />
              <StatBox
                label="Total Out"
                value={<>{totalOut !== null ? totalOut.toFixed(8) : '—'} <span className="text-orange-400">BTC</span></>}
              />
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
              <StatBox label="vSize" value={`${data.vsize} vB`} />
            )}
            {data.fees?.base !== undefined && (
              <StatBox label="Fee" value={`${(data.fees.base * 1e8).toFixed(0)} sats`} />
            )}
            {data.fees?.base !== undefined && data.vsize && (
              <StatBox label="Fee Rate" value={`${((data.fees.base * 1e8) / data.vsize).toFixed(1)} sat/vB`} />
            )}
          </div>
        )}
      </>
    );
}
return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-zinc-200 hover:text-zinc-400 transition-colors">X</button>
      {content}
    </div>
  </div>
);
}

export default TransactionDetailView;