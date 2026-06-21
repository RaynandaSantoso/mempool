import NodeInfo from './components/NodeInfo'
import BlockList from './components/BlockList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Local Mempool</h1>
        <div className="grid grid-cols-2 gap-6">
            <NodeInfo />
            <BlockList />
        </div>
    </div>
)
}

export default App