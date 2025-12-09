from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routers import model_router
import os

app = FastAPI(
    title="CVD Prediction API",
    description="API for predicting cardiovascular disease using multiple ML models",
    version="1.0.0"
)

# Get allowed origins from environment variable or use defaults
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000"
).split(",")

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all model routes
app.include_router(model_router.router)


@app.get("/")
def root():
    return {"message": "Welcome to the CVD Prediction API!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
