# Mempool
A self-hosted Bitcoin block explorer connected directly to your own node (full/pruned). This project is inspired by mempool.space, and serve as a practice for building full-stack application: React frontend, FastAPI backend which talks to Bitcoin Core raw JSON-RPC.

## Screenshots

## Architecture
```
React (Vite) frontend
        │
        │  fetch('/api/...')
        ▼
FastAPI backend
        │
        │  JSON-RPC
        ▼
Bitcoin Core (bitcoind) — your local node 
```

## Setup
### 1. Configure Bitcoin Core for RPC access
In your bitcoin.conf:
```
server=1
rpcuser=yourusername
rpcpassword=yourpassword
```

### 2. Clone the repo
```
git clone https://github.com/RaynandaSantoso/mempool.git
cd mempool
```

### 3. Create .env file
create .env file containing this:
```
RPC_USER=youruser
RPC_PASSWORD=yourpassword
RPC_HOST=127.0.0.1
RPC_PORT=8332
```

### 4. Backend & frontend setup
Run these commands in project repo
```
python3 -m venv .venv
source .venv/bin/activate
```
Backend:
```
uvicorn backend.main:app --reload  
```

Frontend:
```
npm run dev --prefix frontend
```
Open the local URL Vite prints (ex: http://localhost:5173).

# Note on pruned nodes
Bitcoin Core normally indexes transactions by txid for instant lookup. Pruned nodes discard old block data, so transaction search only works for blocks above the prunedheight, and requires BlockHash as additional parameter.
