from abc import ABC
from utils import Database

class QueryBase(ABC):
    def __init__(self):
        self.db = Database()

    def close(self):
        self.db.close_pool()
        
    def stop(self):
        self.db.rollback()
        self.db.close_pool()