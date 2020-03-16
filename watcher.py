import sys
import time
import logging
import requests
import base64

from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler, FileSystemEventHandler

class Event(FileSystemEventHandler):

    def on_created(self, event):
        print('Foobar')
        print('Event: ', event.src_path, event.event_type)

        image = open(event.src_path, 'rb').read()
        img = base64.b64encode(image)
        data = {
            "content": img
        }
        # headers = {'content-type': 'image/png'}
        OW_HOST = "127.0.0.1:3000"
        image_url = "http://" + OW_HOST + "/api/image"
        response = requests.post(image_url, data=data)
        # print('Image: ', image)
        # OW_HOST = "127.0.0.1"
        # image.show()

    def dispath(self, event):
        # OW_HOST="172.31.36.188" 
        # OW_AUTH_USER="789c46b1-71f6-4ed5-8c54-816aa4f8c502" 
        # OW_AUTH_PASS="abczO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP"
        # params = {
        #     "EXECUTION_TYPE": "asynchronous",
        # }
        OW_HOST = "127.0.0.1"
        print('Foobar')
        print('Event: ', event)
        # url = "http://" + OW_HOST + "/api/v1/namespaces/_/actions/processImage"
        url = "http://" + OW_HOST + "/api/image"
        # r = requests.request(url, auth=(OW_AUTH_USER, OW_AUTH_PASS), body=params)
        r = requests.post(url)
        print('Request: ', r.json())

if __name__ == "__main__":

    


    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    event_handler = Event()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()