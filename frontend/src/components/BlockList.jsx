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
        <div>
            {data.map(block => (
                <div key={block.height}>
                    <p>Height: {block.height}</p>
                    <p>Hash: {block.hash}</p>
                </div>
            ))} 
        </div>
    )
}

export default BlockList