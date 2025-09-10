from abc import ABC
from utils import Database

class QueryBase(ABC):
    def __init__(self):
        self.db = Database()

    def close_query(self):
        self.db.close_pool()
        
    def stop_query(self):
        self.db.rollback()
        self.db.close_pool()