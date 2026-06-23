from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.rpc import rpc

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/mempool")
def get_mempool():
    try:
        raw = rpc("getrawmempool", [True])
        filtered = []
        for txid, data in raw.items():
            filtered.append({
                "txid": txid,
                "vsize": data["vsize"],
                "fee": data["fees"]["base"],
                "fee_rate": round(data["fees"]["base"] / data["vsize"] * 100_000_000, 2),
                "time": data["time"]
            })
        return filtered[:100] 

    except Exception as e:
        error_code, error_message = e.args
        return {"error": error_message}

@app.get("/api/mempool/stats")
def get_mempool_stats():
    try:
        data = rpc("getmempoolinfo")
        return {
            "size": data["size"],
            "bytes": data["bytes"],
            "minfee": data["minfee"],
            "mempoolminfee": data["mempoolminfee"]
            }

    except Exception as e:
        error_code, error_message = e.args
        return {"error": error_message}

@app.get("/api/tx/{txid}")
def get_transaction(txid: str, blockhash: str = None):
    node_info = rpc("getblockchaininfo")
    is_pruned = node_info["pruned"]
    prune_height = node_info.get("pruneheight", None)

    # Step 1: Check mempool
    try:
        result = rpc("getmempoolentry", [txid])
        return {"source": "mempool", "data": result}
    except Exception as e:
        error_code, error_message = e.args
        # error code -5 means Transaction not in mempool
        if error_code == -5: 
            print(f"[DEBUG] no transaction in mempool with the id {txid}")
        else:
            return {"error": error_message}

    # Step 2: try confirmed
    if is_pruned:
        if not blockhash:
            return {
                "error": f"Node is pruned above block {prune_height}. Please provide a blockhash parameter.",
                "hint": f"GET /api/tx/{txid}?blockhash=<your_block_hash>"
            }
        try:
            result = rpc("getrawtransaction", [txid, True, blockhash])
            return {"source": "confirmed", "data": result}
        except Exception as e:
            error_code, error_message = e.args
            print(f"[DEBUG] confirmed tx lookup failed: {error_message}")
    else:
        # full node
        try:
            result = rpc("getrawtransaction", [txid, True])
            return {"source": "confirmed", "data": result}
        except Exception as e:
            error_code, error_message = e.args
            print(f"[DEBUG] confirmed tx lookup failed: {error_message}")

    # Step 3: nothing found
    return {"error": "Transaction not found."}

@app.get("/api/node/info")
def get_node_info():
    data = rpc("getblockchaininfo")
    node_info = {
        "chain": data["chain"],
        "blocks": data["blocks"],
        "difficulty": data["difficulty"],
        "pruned": data["pruned"],
        "pruneheight": data.get("pruneheight", None),
        "size_on_disk": data["size_on_disk"],
        "initialblockdownload": data["initialblockdownload"]
    }
    return node_info

# TODO: handle partial block fetch failures
@app.get("/api/blocks/latest")
def get_latest_blocks():
    try:
        current_height = rpc("getblockcount")
        blocks = []

        for num in range(50):
            current_hash = rpc("getblockhash", [current_height - num])
            block_data = rpc("getblock", [current_hash])
            blocks.append({
                "height": current_height - num,
                "hash": current_hash,
                "time": block_data["time"],
                "nTx": block_data["nTx"],
                "size": block_data["size"],
            })
        return blocks
    except Exception as e:
        error_code, error_message = e.args
        return {"error": error_message}

@app.get("/api/block/{block_hash}")
def get_block_data(block_hash):
    try:
        block_data = rpc("getblock", [block_hash])
        return {
            "height": block_data["height"], 
            "time": block_data["time"], 
            "nTx": block_data["nTx"], 
            "size": block_data["size"], 
            "difficulty": block_data["difficulty"],
            "tx": block_data["tx"]
        }
    except Exception as e:
        error_code, error_message = e.args
        return {"error": error_message}
