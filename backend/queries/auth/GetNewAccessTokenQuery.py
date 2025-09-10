from ..QueryBase import QueryBase

class GetNewAccessTokenQuery(QueryBase):
    def check_refresh_token_exists(self, refresh_token: str, account_id: int):
        query = "SELECT log_id FROM login_logs WHERE refresh_token = %s AND account_id = %s"
        params = (refresh_token, account_id)
        result = self.db.execute_query(query, params)
        if not result or len(result) == 0:
            return None
        return result[0][0]