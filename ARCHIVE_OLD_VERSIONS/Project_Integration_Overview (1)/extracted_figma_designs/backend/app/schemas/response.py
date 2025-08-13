from pydantic import BaseModel
from typing import Generic, TypeVar, Optional, Dict, List

T = TypeVar('T')

class APIResponse(BaseModel, Generic[T]):
    data: T
    success: bool
    message: Optional[str] = None
    errors: Optional[Dict[str, List[str]]] = None
    
    class Config:
        from_attributes = True