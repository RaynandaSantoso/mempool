import { useState, useEffect } from 'react'
import BlockDetailsView from './BlockDetailsView';

function BlockList({ onSelectTx }) {
    const [data, setData] = useState(null)
    const [selectedBlock, setSelectedBlock] = useState(null);

    useEffect(() => {
        fetch('/api/blocks/latest')
            .then(res => res.json())
            .then(json => setData(json))
    }, [])

    if (data === null) return <p>Loading Block List...</p>
    return (
        <>
            <div className="flex gap-3 overflow-x-auto pb-3">
                {data.map(block => {
                    const minutesAgo = (Math.floor((Date.now() - block.time * 1000) / 60000))
                    const isSelected = selectedBlock?.height === block.height
                    return (
                        <div
                            key={block.height}
                            onClick={() => setSelectedBlock(block)}
                            className="flex flex-col items-center flex-shrink-0 cursor-pointer"
                        >
                            <h3 className="font-mono text-lg">{block.height}</h3>
                            <div className={`bg-zinc-900 border rounded-md p-4 w-32 mt-1 transition-colors ${isSelected ? 'border-orange-500 ring-2 ring-orange-500' : 'border-zinc-800 hover:border-zinc-600'}`}>
                                <p className="font-mono text-lg text-zinc-100">{block.nTx}</p>
                                <p className="text-xs text-zinc-500">transactions</p>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">{minutesAgo}m ago</p>
                        </div>
                    )
                })}
            </div>

            {selectedBlock && <BlockDetailsView block={selectedBlock} onSelectTx={onSelectTx} />}
        </>
    );
}

export default BlockList