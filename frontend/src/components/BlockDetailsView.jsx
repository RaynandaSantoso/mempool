import { useState, useEffect } from 'react';

function BlockDetailsView({ block, onSelectTx }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetch(`/api/block/${block.hash}`)
      .then(res => res.json())
      .then(json => setDetails(json));
  }, [block.hash]);

  if (details === null) return <p>Loading Block Data...</p>

  return (
    <div className="...">
      <p>Block {block.height}</p>
      <p>{block.nTx} transactions</p>
      <p>{block.size} bytes</p>

      <div>
        <p>First 10 transactions:</p>
        {details.tx.slice(0, 10).map(txid => (
          <p
            key={txid}
            onClick={() => onSelectTx({ txid, blockHash: block.hash })}
            className="cursor-pointer hover:underline"
          >
            {txid}
          </p>
        ))}
        <p>...and {details.tx.length - 10} more</p>
      </div>
    </div>
  );
}

export default BlockDetailsView;