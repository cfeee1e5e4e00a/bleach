import asyncio
import os
from datetime import datetime
from dotenv import load_dotenv
from nats.aio.client import Client as Nats
from nats.aio.msg import Msg
from messages import OnMigrationGenerationMessage
from runner import run_migrator
import aiohttp
import pathlib

load_dotenv()

async def main(loop):
    nats = Nats()

    await nats.connect(os.environ.get('QUEUE_URL'))

    print(f'{datetime.now()} connected to queue')

    async def handle_message(message: Msg):
        payload = OnMigrationGenerationMessage.from_json(message.data.decode('UTF-8'))
        print(f'{datetime.now()} received {payload}')
        migration = await run_migrator(payload)
        pathlib.Path('./migrations').mkdir(parents=True, exist_ok=True)
        file = open(f'./migrations/migration-{payload.demand_id}.sql', 'w')
        file.write(migration)
        file.close()
        print(f'{datetime.now()} generating migration-{payload.demand_id}.sql done')

        # print(f'{datetime.now()} sended {result_message}')
        # api = aiohttp.ClientSession(f'{os.environ.get("API_URL")}')
        # await api.put(f'/api/v1/demands/{payload.demand_id}', json={'status': 'ON_VERIFICATION', 'suggests': result_message})
        # await api.close()

    await nats.subscribe('OnMigrationGeneration', cb=handle_message)

if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(main(loop))
    try:
        loop.run_forever()
    finally:
        loop.close()
