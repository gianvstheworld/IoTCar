#!/bin/bash

VIDSOURCE="/dev/video0"  # Caminho para o dispositivo de vídeo USB
AUDIO_OPTS=""  # Nenhum áudio disponível para a câmera
VIDEO_OPTS="-s 854x480 -c:v libx264 -b:v 800000"  # Opções de vídeo conforme necessário
OUTPUT_HLS="-rtsp_transport tcp -f rtsp"
OUTPUT_FILE="rtsp://igbt.eesc.usp.br:1935/teste"

ffmpeg -f v4l2 -input_format mjpeg -i "$VIDSOURCE" -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS $OUTPUT_FILE