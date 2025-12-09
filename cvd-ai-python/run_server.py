#!/usr/bin/env python3
import sys
import os

# Add the python directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    # Use PORT from environment (for Render) or default to 8001
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("server.main:app", host="0.0.0.0", port=port, reload=False)
