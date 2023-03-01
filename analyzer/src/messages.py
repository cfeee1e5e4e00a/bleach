from dataclasses import dataclass
from dataclasses_json import dataclass_json
from typing import List

@dataclass
class TypeInformation:
    human_type: str
    type: str
    is_nullable: bool
    column_name: str
    example_data: List[str]

@dataclass
class OnAnalyzingMessage:
    demand_id: int
    schema: dict[str, List[TypeInformation]]

@dataclass_json
@dataclass
class Suggest:
    table: str
    column: str
    method: str

OnVerificationMessage = List[Suggest]
