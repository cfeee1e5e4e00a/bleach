from messages import OnExportingMessage, OnAnalyzingMessage
from type_info import TypeInformation
import psycopg2
import asyncio

# find's rows by table name and converts it to TypeInformation class
def find_by_table(lst, table_name)->list[TypeInformation]:
    columns = list(
                map(lambda x: x[1:], 
                    filter(lambda x: x[0] == table_name, lst)
                )
            )
    return list(    
        map(
            lambda x: TypeInformation(
                column_name=x[0], 
                human_type=x[1], 
                is_nullable=(x[2]=='YES'), 
                type=x[3]
                ),
                columns
        )
    )

# exports schema of db 
def export_tables(connection, schema: str) -> dict[str, TypeInformation]: 
    cursor = connection.cursor()
    cursor.execute(f"""
    SELECT t1.table_name, t2.column_name, t2.data_type, t2.is_nullable, t2.udt_name
    FROM information_schema.tables as t1
    INNER JOIN information_schema.columns as t2
    ON t2.table_name = t1.table_name 
    WHERE t1.table_schema='{schema}'
    ORDER BY t1.table_name ASC
    """)
    data = list(cursor)
    tables = set([row[0] for row in data])
    r_val = {}
    for i in tables:
        r_val[i] = find_by_table(data, i)
    return r_val


async def run_exporter(message: OnExportingMessage):
    conn = psycopg2.connect(dbname=message.db_name, user=message.user, password=message.password, host=message.host, port=message.port)
    table_with_columns = export_tables(conn, message.schema)
    for table_name in table_with_columns.keys():
        for column in table_with_columns[table_name]:
            cur = conn.cursor()
            column_name = column.column_name
            cur.execute(f"""
            SELECT {column_name} 
            FROM {table_name}
            WHERE {column_name} IS NOT NULL
            ORDER BY random ()
            LIMIT 3
            """)
            column.example_data = list(map(str, map(lambda x: x[0], cur)))
    conn.close()
    t = OnAnalyzingMessage(demand_id=message.demand_id, shema=table_with_columns)
    print(t.to_json())
    return t

# t = OnExportingMessage(
#     demand_id=12,
#     database_type='postgresql',
#     db_name='demo',
#     user='root',
#     password='root',
#     host='localhost',
#     port=5432,
#     schema='bookings'
# )

# asyncio.run(run_exporter(t))
