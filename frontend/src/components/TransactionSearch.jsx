import { useState } from 'react'

function TransactionSearch() {
    const [txid, setTxid] = useState('')

    return (
        <div>
            <input 
            value={txid}
            onChange={event => setTxid(event.target.value)}
            placeholder="Transaction ID"
            />
            <p>{txid}</p>
        </div>
    )
}

export default TransactionSearch