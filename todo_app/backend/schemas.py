from pydantic import BaseModel
from typing import Optional

class TodoBase(BaseModel):
    title: str

class TodoCreate(TodoBase):
    completed: bool = False

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase):
    id: int
    completed: bool

    model_config = {"from_attributes": True}
