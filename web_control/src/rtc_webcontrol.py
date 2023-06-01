from aiohttp import web
routes = web.RouteTableDef()

from rtcbot import RTCConnection, CVCamera, getRTCBotJS
cam = CVCamera()

# For this example, we use just one global connection
conn = RTCConnection()
conn.video.putSubscription(cam)

keystates = {"w": False, "a": False, "s": False, "d": False}

@conn.subscribe
def onMessage(m):
    global keystates
    if m["keyCode"] == 87:  # W
        keystates["w"] = m["type"] == "keydown"
    elif m["keyCode"] == 83:  # S
        keystates["s"] = m["type"] == "keydown"
    elif m["keyCode"] == 65:  # A
        keystates["a"] = m["type"] == "keydown"
    elif m["keyCode"] == 68:  # D
        keystates["d"] = m["type"] == "keydown"
    print({
            "forward": keystates["w"] * 1 - keystates["s"] * 1,
            "leftright": keystates["d"] * 1 - keystates["a"] * 1,
        })

# Serve the RTCBot javascript library at /rtcbot.js
@routes.get("/rtcbot.js")
async def rtcbotjs(request):
    return web.Response(content_type="application/javascript", text=getRTCBotJS())

# This sets up the connection
@routes.post("/connect")
async def connect(request):
    clientOffer = await request.json()
    serverResponse = await conn.getLocalDescription(clientOffer)
    return web.json_response(serverResponse)

def read_html_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
        message = ''.join(lines)
        return message

@routes.get("/")
async def index(request):
    html_message = read_html_file('index.html')
    return web.Response(
        content_type="text/html",
            text= html_message)

async def cleanup(app=None):
    await conn.close()

app = web.Application()
app.add_routes(routes)
app.on_shutdown.append(cleanup)
web.run_app(app)