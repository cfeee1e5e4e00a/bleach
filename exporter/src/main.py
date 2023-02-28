import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv
from nats.aio.client import Client as Nats
from nats.aio.msg import Msg
import aiohttp
from runner import run_exporter
from messages import OnExportingMessage

load_dotenv()

async def main():
    nats = Nats()

    await nats.connect(os.environ.get('QUEUE_URL'))

    print(f'{datetime.now()} connected to queue')
    
    api = aiohttp.ClientSession(f'{os.environ.get("API_URL")}')

    async def handle_message(message: Msg):
        payload: OnExportingMessage = OnExportingMessage.from_json(message.data.decode('UTF-8'))
        print(f'{datetime.now()} received {payload}')
        result = await run_exporter(payload)
        await nats.publish('OnAnalyzing', result.to_json().encode('UTF-8'))
        print(f'{datetime.now()} sended {result}')
        await api.put(f'/api/v1/demands/{payload.demand_id}', json={'status': 'ON_ANALYZING'})

    await nats.subscribe('OnExporting', 'Exporter', cb=handle_message)

if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main())
    loop.run_forever()
    loop.close()
