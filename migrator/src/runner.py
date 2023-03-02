from messages import OnMigrationGenerationMessage
from jinja2 import Environment, FileSystemLoader
import json
import asyncio
import psycopg2
from urllib.parse import urlparse
from lib import anonimize_cell

environment = Environment(loader=FileSystemLoader('templates/'))

async def run_migrator(message: OnMigrationGenerationMessage):
    template = environment.get_template('main.sql')
    parsed_uri = urlparse(message.uri)
    username = parsed_uri.username
    password = parsed_uri.password
    database = parsed_uri.path[1:]
    hostname = parsed_uri.hostname
    port = parsed_uri.port
    conn = psycopg2.connect(
        database = database,
        user = username,
        password = password,
        host = hostname,
        port = port
    )

    migration = ''

    for table, columns in message.plan.items():
        for column, method in columns.items():
            if method == 'skip':
                continue
            cursor = conn.cursor()
            cursor.execute(f'''
            SELECT {column} FROM {table}
            ''')
            values = list(cursor)
            for value in values:
                migration += template.render(table=table, column=column, value=f'"{anonimize_cell(method, value[0])}"', selector=f'{column}="{value[0]}"') + '\n'

    return migration
            
if __name__ == '__main__':
    demand_id = 1
    plan = '{"seats": {"seat_no": "skip", "aircraft_code": "skip", "fare_conditions": "skip"}, "routes": {"duration": "skip", "flight_no": "skip", "arrival_city": "skip", "days_of_week": "skip", "aircraft_code": "skip", "departure_city": "skip", "arrival_airport": "skip", "departure_airport": "skip", "arrival_airport_name": "skip", "departure_airport_name": "skip"}, "flights": {"status": "skip", "flight_id": "skip", "flight_no": "skip", "aircraft_code": "skip", "actual_arrival": "skip", "arrival_airport": "skip", "actual_departure": "skip", "departure_airport": "skip", "scheduled_arrival": "skip", "scheduled_departure": "skip"}, "tickets": {"book_ref": "skip", "ticket_no": "phone", "contact_data": "skip", "passenger_id": "passport", "passenger_name": "skip"}, "airports": {"city": "skip", "timezone": "skip", "coordinates": "skip", "airport_code": "skip", "airport_name": "skip"}, "bookings": {"book_ref": "skip", "book_date": "skip", "total_amount": "skip"}, "aircrafts": {"model": "skip", "range": "skip", "aircraft_code": "skip"}, "flights_v": {"status": "skip", "flight_id": "skip", "flight_no": "skip", "arrival_city": "skip", "aircraft_code": "skip", "actual_arrival": "skip", "departure_city": "skip", "actual_duration": "skip", "arrival_airport": "skip", "actual_departure": "skip", "departure_airport": "skip", "scheduled_arrival": "skip", "scheduled_duration": "skip", "scheduled_departure": "skip", "actual_arrival_local": "skip", "arrival_airport_name": "skip", "actual_departure_local": "skip", "departure_airport_name": "skip", "scheduled_arrival_local": "skip", "scheduled_departure_local": "skip"}, "airports_data": {"city": "skip", "timezone": "skip", "coordinates": "skip", "airport_code": "skip", "airport_name": "skip"}, "aircrafts_data": {"model": "skip", "range": "skip", "aircraft_code": "skip"}, "ticket_flights": {"amount": "skip", "flight_id": "skip", "ticket_no": "phone", "fare_conditions": "skip"}, "boarding_passes": {"seat_no": "skip", "flight_id": "skip", "ticket_no": "phone", "boarding_no": "skip"}}'
    uri = 'postgresql://postgres:root@217.71.129.139:4070/demo?scheme=bookings'
    message = OnMigrationGenerationMessage(demand_id=demand_id, plan=json.loads(plan), uri=uri)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run_migrator(message))
    loop.close()
