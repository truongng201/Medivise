from ..QueryBase import QueryBase

class LogoutQuery(QueryBase):
    def check_refresh_token_exists(self, account_id, refresh_token):
        query = "SELECT log_id FROM login_logs WHERE account_id = %s AND refresh_token = %s"
        response = self.db.execute_query(query, (account_id, refresh_token))
        if not response or len(response) == 0:
            return None
        return response[0][0]
    
    def delete_refresh_token(self, log_id):
        query = "DELETE FROM login_logs WHERE log_id = %s"
        rowaffected = self.db.execute_non_query(query, (log_id,))
        if not rowaffected or rowaffected == 0:
            return False
        return True