from ..QueryBase import QueryBase

class GetNewAccessTokenQuery(QueryBase):
    def check_refresh_token_exists(self, refresh_token: str):
        query = """
            SELECT 
                login_logs.log_id, 
                accounts.account_id as account_id,
                accounts.email as email
            FROM login_logs 
            LEFT JOIN accounts ON login_logs.account_id = accounts.account_id
        """

        params = (refresh_token,)
        result = self.db.execute_query(query, params)
        if not result or len(result) == 0:
            return None
        return result[0]