from fastapi import FastAPI
from server.routers import model_router

app = FastAPI(
    title="CVD Prediction API",
    description="API for predicting cardiovascular disease using multiple ML models",
    version="1.0.0"
)

# Include all model routes
app.include_router(model_router.router)

@app.get("/")
def root():
    return {"message": "Welcome to the CVD Prediction API!"}
