import asyncio
from rtcbot import Websocket, RTCConnection, CVCamera

cam = CVCamera()
conn = RTCConnection()
conn.video.putSubscription(cam)

async def connect():
    ws = Websocket("https://rtcbot.dev/myRandomSequence11")
    remoteDescription = await ws.get()
    robotDescription = await conn.getLocalDescription(remoteDescription)
    ws.put_nowait(robotDescription)
    print("Started WebRTC")
    await ws.close()

asyncio.ensure_future(connect())
try:
    asyncio.get_event_loop().run_forever()
finally:
    cam.close()
    conn.close()