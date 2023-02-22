import asyncio
import os
from dotenv import load_dotenv
from nats.aio.client import Client as Nats

load_dotenv()

async def run():
    nats = Nats()

    await nats.connect(os.environ.get('QUEUE_URL'))

    async def handle_message(message):
        print(message)

    await nats.subscribe('ON_ANALYZING', cb=handle_message)

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete()
    loop.run_forever()
    loop.close()
