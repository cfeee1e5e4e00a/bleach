from dataclasses import dataclass
from dataclasses_json import dataclass_json

@dataclass
@dataclass_json
class TypeInformation:
    human_type:str
    type:str
    is_nullable:bool
    column_name:str
    example_data:list[str]

    def __init__(self, human_type, type, is_nullable, column_name) -> None:
        self.human_type = human_type
        self.type = type
        self.is_nullable = is_nullable
        self.column_name = column_name
        self.example_data = []
        pass
    
    def __str__(self) -> str:
        return f"""
        <human_type:{self.human_type}, 
        type:{self.type}, 
        is_nullable:{self.is_nullable}, 
        column_name:{self.column_name}
        example_data:{self.example_data}>
        """
    def __repr__(self) -> str:
        return str(self)
    