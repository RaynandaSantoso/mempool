import { useState, useEffect } from 'react'
import NodeInfo from './components/NodeInfo'
import BlockList from './components/BlockList'
import TransactionDetailView from './components/TransactionDetailView'
import TabSwitcher from './components/TabSwitcher'
import MempoolTab from './components/MempoolTab'
import './App.css'

function App() {
    const [selectedTx, setSelectedTx] = useState(null);
    const [txidQuery, setTxidQuery] = useState('')
    const [blockHashQuery, setBlockHashQuery] = useState('')
    const [nodeInfo, setNodeInfo] = useState(null)
    const [activeTab, setActiveTab] = useState('blocks')

    useEffect(() => {
        fetch('/api/node/info')
            .then(res => res.json())
            .then(json => setNodeInfo(json))
    }, [])

    const isPruned = nodeInfo?.pruned ?? false
    const handleSearch = () => {
        if (!txidQuery.trim()) return;

        setSelectedTx({
            txid: txidQuery.trim(),
            blockHash: isPruned && blockHashQuery.trim() ? blockHashQuery.trim() : undefined,
        });
    };
    return (
        <div className="min-h-screen flex flex-col gap-8 bg-gray-950 text-white p-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Local Mempool</h1>
                <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
                <NodeInfo nodeInfo={nodeInfo} />
            </div>

            {/* Search Row */}
            <div className="flex flex-row gap-4 items-center">
                <h2>Search Transaction</h2>
                <input
                    type="text"
                    value={txidQuery}
                    onChange={e => setTxidQuery(e.target.value)}
                    placeholder="Search by txid or Block Height"
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors w-80"
                />

                {isPruned && (
                    <input
                        type="text"
                        value={blockHashQuery}
                        onChange={e => setBlockHashQuery(e.target.value)}
                        placeholder="BlockHash (pruned)"
                        className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                )}

                <button
                    onClick={handleSearch}
                    disabled={!txidQuery.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-colors ${txidQuery.trim()
                        ? 'bg-orange-500 hover:bg-orange-400 text-white cursor-pointer'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    Search
                </button>
            </div>

            {(activeTab === "blocks") ?
                <BlockList onSelectTx={setSelectedTx} /> : <MempoolTab onSelectTx={setSelectedTx} />
            }

            {selectedTx && (
                <TransactionDetailView
                    selection={selectedTx}
                    onClose={() => setSelectedTx(null)}
                />
            )}
        </div>
    )
}

export default App