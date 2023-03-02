import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv
from nats.aio.client import Client as Nats
from nats.aio.msg import Msg
from dacite import from_dict
from json import loads
import aiohttp
from runner import run_analyzer
from messages import OnAnalyzingMessage, Suggest

load_dotenv()

async def main():
    nats = Nats()

    await nats.connect(os.environ.get('QUEUE_URL'))

    print(f'{datetime.now()} connected to queue')

    async def handle_message(message: Msg):
        raw = loads(message.data.decode('UTF-8'))
        payload = from_dict(data_class=OnAnalyzingMessage, data=raw)
        print(f'{datetime.now()} received {payload}')
        suggests = await run_analyzer(payload)
        result_message = Suggest.schema().dumps(suggests ,many=True)
        print(f'{datetime.now()} sended {result_message}')
        api = aiohttp.ClientSession(f'{os.environ.get("API_URL")}', timeout=aiohttp.ClientTimeout(total=5))
        async with api.put(f'/api/v1/demands/{payload.demand_id}', json={'status': 'ON_VERIFICATION', 'suggests': result_message}) as resp:
            await resp.text()
        await api.close()

    await nats.subscribe('OnAnalyzing', cb=handle_message)

if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main())
    try:
        loop.run_forever()
    finally:
        loop.close()
