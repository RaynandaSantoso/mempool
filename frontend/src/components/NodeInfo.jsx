function NodeInfo({ nodeInfo }) {
    if (!nodeInfo) return <p>Loading node info...</p>

    return (
        <div>
            <p>Chain: {nodeInfo.chain}</p>
            <p>Pruned: {nodeInfo.pruned ? 'Yes' : 'No'}</p>
        </div>
    )
}

export default NodeInfo