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
            <div className="flex flex-row gap-4">
                <h2>Search Transaction</h2>
                <input
                    type="text"
                    value={txidQuery}
                    onChange={e => setTxidQuery(e.target.value)}
                    placeholder="Search by txid or block height..."
                />

                {isPruned && (
                    <input
                        type="text"
                        value={blockHashQuery}
                        onChange={e => setBlockHashQuery(e.target.value)}
                        placeholder="BlockHash (pruned)"
                    />
                )}

                <button
                    onClick={handleSearch}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-4 py-2 rounded-md transition-colors"
                >
                    Search
                </button>
            </div>
            
            {(activeTab === "blocks") ?
                <BlockList onSelectTx={setSelectedTx} /> : <MempoolTab onSelectTx={setSelectedTx}/>
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