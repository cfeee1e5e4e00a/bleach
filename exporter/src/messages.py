from typing import Literal, Any
from dataclasses import dataclass
from dataclasses_json import dataclass_json

DatabaseBrand = Literal['postgresql']

@dataclass_json
@dataclass
class OnExportingMessage:
    demand_id: int
    database: DatabaseBrand
    uri: str

@dataclass_json
@dataclass
class OnAnalyzingMessage:
    demand_id: int
    columns: dict[str, str]
    samples: list[dict[str, Any]]
