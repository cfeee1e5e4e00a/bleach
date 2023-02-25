from typing import Literal, Any
from dataclasses import dataclass
from dataclasses_json import dataclass_json
from type_info import TypeInformation

DatabaseBrand = Literal['postgresql']

@dataclass_json
@dataclass
class OnExportingMessage:
    demand_id: int
    database_type: DatabaseBrand
    db_name: str
    user: str
    password: str
    host: str
    port: int
    schema: str

@dataclass_json
@dataclass
class OnAnalyzingMessage:
    demand_id: int
    shema: dict[str, TypeInformation]
