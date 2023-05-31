from aiohttp import web
import asyncio
import json
from rtcbot import Websocket, RTCConnection
import logging
logging.basicConfig(level=logging.DEBUG)

routes = web.RouteTableDef()

from rtcbot import RTCConnection, getRTCBotJS, CVCamera

conn = RTCConnection()

camera = CVCamera()
conn.video.putSubscription(camera)

@conn.subscribe
def onMessage(m):
    print("Key:", m)

# Serve the RTCBot javascript library at /rtcbot.js
@routes.get("/rtcbot.js")
async def rtcbotjs(request):
    return web.Response(content_type="application/javascript", text=getRTCBotJS())


# This sets up the connection
@routes.post("/connect")
async def connect():
    ws = Websocket("https://rtcbot.dev/tommas")
    remoteDescription = await ws.get()
    robotDescription = await conn.getLocalDescription(remoteDescription)
    ws.put_nowait(robotDescription)
    await conn.onReady()

    if conn.error is not None:
        print("Had conn error", conn.error)
    print("\n\n\nConnection ready!\n\n\n")
    conn.put_nowait("Hello!")
    
    await ws.close()
    print("Closed socket")


@routes.get("/")
async def index(request):
    return web.Response(
        content_type="text/html",
        text=r"""
    <html>
        <head>
            <title>RTCBot: Skeleton</title>
            <script src="/rtcbot.js"></script>
        </head>
        <body style="text-align: center;padding-top: 30px;">
            <video autoplay playsinline muted controls></video>
            <p>
            tommaselli $$$$$$$$$$22222121dd
            Open the browser's developer tools to see console messages (CTRLSHIFTC)
            </p>
            <script>
                var conn = new rtcbot.RTCConnection();
                var kb = new rtcbot.Keyboard();

                // When the video stream comes in, display it in the video element
                conn.video.subscribe(function(stream) {
                    document.querySelector("video").srcObject = stream;
                });

                async function connect() {
                    let offer = await conn.getLocalDescription();

                    let response = await fetch("https://rtcbot.dev/tommas", {
                        method: "POST",
                        cache: "no-cache",
                        body: JSON.stringify(offer),
                    });

                    await conn.setRemoteDescription(await response.json());
                    kb.subscribe(conn.put_nowait);

                    console.log("Ready!");
                }
                connect();

            </script>
        </body>
    </html>
    """)

async def cleanup(app=None):
    await conn.close()
    camera.close() # Singletons like a camera are not awaited on close

# app = web.Application()
# app.add_routes(routes)
# app.on_shutdown.append(cleanup)
# web.run_app(app)
asyncio.ensure_future(connect())
asyncio.get_event_loop().run_forever()