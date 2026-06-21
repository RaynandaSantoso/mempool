import NodeInfo from './components/NodeInfo'
import BlockList from './components/BlockList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Local Mempool</h1>
        <div className="grid grid-row-2 gap-20">
            <NodeInfo />
            <p>Hello!</p>
            <BlockList className="flex gap-10 overflow-x-auto"/>
        </div>
    </div>
)
}

export default App