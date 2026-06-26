
function TabSwitcher({ activeTab, onChange }) {
    const tabs = [
        { id: 'blocks', label: 'Blocks' },
        { id: 'mempool', label: 'Mempool' },
    ];

    return (
        <div className="">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                        ? 'bg-orange-500 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default TabSwitcher