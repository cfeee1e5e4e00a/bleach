FROM python:3.11-alpine
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY src src
COPY templates templates
CMD [ "python3", "src/main.py" ]
