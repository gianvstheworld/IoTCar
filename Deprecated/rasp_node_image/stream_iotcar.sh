#!/bin/bash

ffmpeg -s 640x360 -r 12 -i /dev/video0 -pix_fmt yuv420p -g 20 -c:v libx264 -b:v 1.5M -bufsize 52M -maxrate 10M -preset ultrafast -tune zerolatency -rtsp_transport tcp -f rtsp rtsp://34.207.147.164:1935/iotcar
