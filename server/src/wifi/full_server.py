import asyncio
import json
from rtcbot import Websocket, RTCConnection
import logging
# logging.basicConfig(level=logging.DEBUG)

from rtcbot import RTCConnection, getRTCBotJS, CVCamera

conn = RTCConnection()
camera = CVCamera()
conn.video.putSubscription(camera)

async def connect():
    ws = Websocket("https://rtcbot.dev/tommaselli_test")
    await ws.onReady()
    if ws.error is not None:
        print("Had error", ws.error)
        return
    remoteDescription = await ws.get()
    print("Received Description")
    myDescription = await conn.getLocalDescription(remoteDescription)
    ws.put_nowait(myDescription)

    await ws.close()

    print("Closed socket")

    await conn.onReady()
    if conn.error is not None:
        print("Had conn error", conn.error)
    print("\n\n\nConnection ready!\n\n\n")
    conn.put_nowait("Hello! 123")
    conn.put_nowait("eval(\"document.querySelector('h1').innerText = 'TESTE'\")")


asyncio.ensure_future(connect())
asyncio.get_event_loop().run_forever()