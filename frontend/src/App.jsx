import { useState } from 'react'
import NodeInfo from './components/NodeInfo'
import BlockList from './components/BlockList'
import TransactionDetailView from './components/TransactionDetailView'
import './App.css'

function App() {
  const [selectedTx, setSelectedTx] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Local Mempool</h1>
        <div className="grid grid-row-2 gap-20">
            <NodeInfo />
            <BlockList onSelectTx={setSelectedTx} />
        </div>

        {selectedTx && <TransactionDetailView selection={selectedTx} />}
    </div>
)
}

export default App