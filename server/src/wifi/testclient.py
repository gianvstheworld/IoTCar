from rtcbot import RTCConnection, Gamepad, CVDisplay
import asyncio
import aiohttp
import json
import logging
# logging.basicConfig(level=logging.DEBUG)
conn = RTCConnection()


def callme(msg):
    print(30*'-')
    print(msg)
    print(30*'-')

async def connect():
    localDescription = await conn.getLocalDescription()
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://rtcbot.dev/tommaselli", data=json.dumps(localDescription)
        ) as resp:
            response = await resp.json()
            await conn.setRemoteDescription(response)
    conn.subscribe(callme)

asyncio.ensure_future(connect())
try:
    asyncio.get_event_loop().run_forever()
finally:
    conn.close()