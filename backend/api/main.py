from fastapi import FastAPI, Request
from app.queue_manager import image_queue, audio_queue, video_queue

app = FastAPI()

@app.post("/generate/image")
async def generate_image(request: Request):
    payload = await request.json()
    await image_queue.put(payload)
    return {"status": "queued"}

@app.post("/generate/audio")
async def generate_audio(request: Request):
    payload = await request.json()
    await audio_queue.put(payload)
    return {"status": "queued"}

@app.post("/generate/video")
async def generate_video(request: Request):
    payload = await request.json()
    await video_queue.put(payload)
    return {"status": "queued"}

@app.on_event("startup")
async def startup():
    from app.workers.image_worker import start_image_workers
    from app.workers.audio_worker import start_audio_workers
    from app.workers.video_worker import start_video_workers

    await start_image_workers()
    await start_audio_workers()
    await start_video_workers()

