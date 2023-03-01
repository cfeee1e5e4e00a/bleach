from dataclasses import dataclass
from dataclasses_json import dataclass_json

@dataclass_json
@dataclass
class OnMigrationGenerationMessage:
    demand_id: int
    uri: str
    plan: dict[str, dict[str, str]]
