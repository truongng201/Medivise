from abc import ABC
from utils import Database

class QueryBase(ABC):
    def __init__(self):
        self.db = Database()

    def close(self):
        self.db.close_pool()