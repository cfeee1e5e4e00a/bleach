import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv
from nats.aio.client import Client as Nats
from nats.aio.msg import Msg
from json import dumps, loads
import aiohttp
from runner import run_exporter
from messages import OnExportingMessage, OnAnalyzingMessage

load_dotenv()

async def main():
    nats = Nats()

    await nats.connect(os.environ.get('QUEUE_URL'))

    print(f'{datetime.now()} connected to queue')

    async def handle_message(message: Msg):
        payload: OnExportingMessage = OnExportingMessage.from_json(message.data.decode('UTF-8'))
        print(f'{datetime.now()} received {payload}')
        schema = await run_exporter(payload)
        result_message = OnAnalyzingMessage(demand_id=payload.demand_id, schema=schema).to_json().encode('UTF-8')
        await nats.publish('OnAnalyzing', result_message)
        print(f'{datetime.now()} sended {result_message}')
        parsed = loads(result_message)
        del parsed['demand_id']
        api = aiohttp.ClientSession(f'{os.environ.get("API_URL")}')
        async with api.put(f'/api/v1/demands/{payload.demand_id}', json={'status': 'ON_ANALYZING', 'schema': dumps(parsed)}) as resp:
            await resp.text()
        await api.close()

    await nats.subscribe('OnExporting', cb=handle_message)

if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main())
    try:
        loop.run_forever()
    finally:
        loop.close()
