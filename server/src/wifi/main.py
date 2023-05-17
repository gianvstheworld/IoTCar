import asyncio
import aiohttp
from aiohttp import web

routes = web.RouteTableDef()

websockets = {}

MSG_MAX = 8 * 1024

async def websocketHandler(request):
    cid = request.match_info['cid']
    if cid in websockets:
        return web.HTTPConflict(text="Already have a connection here")

    ws = web.WebSocketResponse(max_msg_size=MSG_MAX, heartbeat=60.0)
    await ws.prepare(request)
    websockets[cid] = {"ws": ws, "recv": None}
    print(f'({len(websockets)}) {cid}: connection opened')

    try:
        msg = await ws.receive_str()
        if websockets[cid]["recv"] is not None:
            websockets[cid]["recv"].put_nowait(msg)
    except:
        # Clear the queue
        if websockets[cid]["recv"] is not None:
            try:
                websockets[cid]["recv"].put_nowait("")
            except:
                pass

    del websockets[cid]
    print(f'({len(websockets)}) {cid}: connection closed')


@routes.get("/")
async def index(request):
    return web.Response(text="Hello, RTCBot!")


app = web.Application(client_max_size=MSG_MAX)
app.add_routes(routes)
web.run_app(app, port=1452)