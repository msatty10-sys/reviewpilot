# ReviewPilot Backend

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   export PYTHONPATH=$PYTHONPATH:.
   alembic upgrade head
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Project Structure

- `app/api`: API endpoints
- `app/core`: Configuration and security
- `app/crud`: CRUD operations
- `app/db`: Database session and base models
- `app/models`: SQLAlchemy models
- `app/schemas`: Pydantic schemas
- `alembic`: Database migrations
