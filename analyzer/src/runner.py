from messages import OnAnalyzingMessage, OnVerificationMessage
from typing import List
from lib import data_type_analyzer
from messages import Suggest
from collections import Counter

def pick_most_method(samples: List[str]) -> str:
    hits = dict()
    for sample in samples:
        suggest = data_type_analyzer(sample)
        if hits.get(suggest) == None:
            hits[suggest] = 1
        else:
            hits[suggest] += 1
    max_hit = Counter(hits).most_common()
    return max_hit[0][0]

async def run_analyzer(message: OnAnalyzingMessage) -> OnVerificationMessage:
    suggests: List[Suggest] = []
    for table, columns  in message.schema.items():
        for column in columns:
            suggest = Suggest(table=table, column=column.column_name, method=pick_most_method(column.example_data))
            suggests.append(suggest)
    return list(filter(lambda s: s.method != 'UNKNOWN', suggests))
