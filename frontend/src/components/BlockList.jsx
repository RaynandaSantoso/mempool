import { useState, useEffect } from 'react'

function BlockList() {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api/blocks/latest')
            .then(res => res.json())
            .then(json => setData(json))
    }, [])

    if (data === null) return <p>Loading Block List...</p>
    return (
        <div className="flex gap-4 overflow-x-auto">
            {data.map(block => {
                const minutesAgo = (Math.floor((Date.now() - block.time * 1000) / 60000))
                return (
                <div key={block.height} className="flex flex-col items-center flex-shrink-0">
                    <p>{block.height}</p>
                    <div className="bg-gray-500 rounded-lg p-4 w-32">
                        <p>{block.nTx}</p>
                        <p>transactions</p>
                    </div>
                    <p>{minutesAgo} minutes ago</p>
                </div>
            )
        })}
        </div>
    )
}

export default BlockList