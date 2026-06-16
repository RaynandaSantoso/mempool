import { useState, useEffect } from 'react'

function NodeInfo() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api/node/info')
            .then(res => res.json())
            .then(json => setData(json))
    }, []) 

    if (data === null) return <p>Loading...</p>
    return (
        <div>
            <p>chain: {data.chain}</p>
            <p>Block Height: {data.blocks}</p>
            <p>Synced: {String(data.initialblockdownload === false)}</p>
        </div>
    )
}

export default NodeInfo
