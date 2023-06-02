import torch
import cv2

# Model
model = torch.hub.load("ultralytics/yolov5", "yolov5s")  # or yolov5n - yolov5x6, custom

# Images
# img = "test.png"  # or file, Path, PIL, OpenCV, numpy, list

# Video
vid = "test.mp4"  # or file, Path, PIL, OpenCV, numpy, list


# Inference for video 
# results = model(vid) DONT WORK, JUST FOR IMAGES AND FRAMES


# show img with detection 
results.show()

# Results
results.print() 