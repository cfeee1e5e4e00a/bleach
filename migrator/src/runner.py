from messages import OnMigrationGenerationMessage
from jinja2 import Environment, FileSystemLoader

environment = Environment(loader=FileSystemLoader('templates/'))

async def run_migrator(message: OnMigrationGenerationMessage):
    template = environment.get_template('main.sql')

    for table, columns in message.plan.items():
        for column, method in columns.items():
            if method == 'skip':
                continue
            print(template.render(table=table, column=column, value="'value'", selector='id=0'))
            

