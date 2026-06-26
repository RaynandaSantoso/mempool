import { useEffect, useState } from 'react'

function MempoolTab({ onSelectTx }) {
    const [mempoolData, setMempoolData] = useState([])

    useEffect(() => {
        fetch('/api/mempool')
            .then(res => res.json())
            .then(json => setMempoolData(json))
    }, [])

    return (
        <div className="max-h-[600px] overflow-y-auto flex flex-col gap-1">

            <div className="max-w-3xl w-full mx-auto max-h-[600px] overflow-y-auto flex flex-col gap-1">
                {mempoolData.map(tx => {
                    return (
                        <div
                            key={tx.txid}
                            onClick={() => onSelectTx({ txid: tx.txid })}
                            className="grid grid-cols-3 items-center px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md font-mono text-sm cursor-pointer hover:border-orange-500 transition-colors"
                        >
                            <span className="text-zinc-300 text-left">
                                {tx.txid.slice(0, 8)}...{tx.txid.slice(-8)}
                            </span>
                            <span className="text-zinc-400 text-center">{tx.vsize} vB</span>
                            <span className="text-orange-400 text-right">{tx.fee_rate} sat/vB</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MempoolTab