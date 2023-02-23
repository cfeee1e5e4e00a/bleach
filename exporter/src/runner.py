from libpy.messages import OnExportingMessage, OnAnalyzingMessage

async def run_exporter(message: OnExportingMessage) -> OnAnalyzingMessage:
    columns = {
        'id': 'integer',
        'first_name': 'text',
        'second_name': 'text',
        'email': 'text',
        'phone': 'text',
        'avatar': 'text',
        'created_at': 'timestamp'
    }

    samples = [
        {
            'id': 1,
            'first_name': 'Максим',
            'second_name': 'Нерлих',
            'email': 'nerlihmax@yandex.ru',
            'phone': '+799946946937',
            'avatar': 'https://sun9-1.userapi.com/impg/Skt9ohuEhsY2EFMFXqs4cX7s3q7BDME57m3T7w/2dxULg9nalk.jpg?size=2126x1535&quality=95&sign=7f993accd31d554721a7e2bb5ba17e95&type=album',
            'created_at': '2011-01-01 00:00:00'
        },
    ]

    result = OnAnalyzingMessage(demand_id=message.demand_id, columns=columns, samples=samples)

    return result
