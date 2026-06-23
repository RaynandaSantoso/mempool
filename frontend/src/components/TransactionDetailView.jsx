import { useState, useEffect } from 'react';

function TransactionDetailView({ selection }) {
  const [tx, setTx] = useState(null);

  useEffect(() => {
    const url = selection.blockHash
      ? `/api/tx/${selection.txid}?blockhash=${selection.blockHash}`
      : `/api/tx/${selection.txid}`;

    fetch(url)
      .then(res => res.json())
      .then(json => setTx(json));
  }, [selection.txid]);

  if (tx === null) return <p>Loading Transaction...</p>
  if (tx.error) return <p>Error: {tx.error}</p>

  return (
    <div className="...">
      <p>Transaction {selection.txid}</p>
      <p>Source: {tx.source}</p>
      <p>{tx.data.vin.length} inputs</p>
      <p>{tx.data.vout.length} outputs</p>
      <p>{tx.data.size} bytes</p>

      <div>
        <p>Outputs:</p>
        {tx.data.vout.map((output, index) => (
          <p key={index}>{output.value} BTC</p>
        ))}
      </div>
    </div>
  );
}

export default TransactionDetailView;