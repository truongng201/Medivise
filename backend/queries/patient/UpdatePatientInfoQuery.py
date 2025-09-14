from ..QueryBase import QueryBase
from datetime import datetime

class UpdatePatientInfoQuery(QueryBase):
    def update_account_info(self, account_id, fields):
        """Update account information"""
        if not fields:
            return True
        
        # Build dynamic query
        set_clauses = []
        params = []
        
        for field, value in fields.items():
            set_clauses.append(f"{field} = %s")
            params.append(value)
        
        params.append(account_id)
        
        query = f"""
            UPDATE accounts 
            SET {', '.join(set_clauses)}
            WHERE account_id = %s
        """
        
        result = self.db.execute_non_query(query, tuple(params))
        if not result or result == 0:
            return False
        return True
    
    
    def update_patient_info(self, account_id, fields):
        """Update patient-specific information"""
        if not fields:
            return True
        
        # First get patient_id from account_id
        patient_id_query = """
            SELECT patient_id FROM patients WHERE account_id = %s
        """
        patient_result = self.db.execute_query(patient_id_query, (account_id,))
        
        if not patient_result or len(patient_result) == 0:
            return False
        
        patient_id = patient_result[0][0]
        
        # Build dynamic query
        set_clauses = []
        params = []
        
        for field, value in fields.items():
            set_clauses.append(f"{field} = %s")
            params.append(value)
        
        params.append(patient_id)
        
        query = f"""
            UPDATE patients 
            SET {', '.join(set_clauses)}
            WHERE patient_id = %s
        """
        
        
        result = self.db.execute_non_query(query, tuple(params))
        if not result or result == 0:
            return False
        return True
    
    def update_health_metrics(self, account_id, fields):
        """Update patient health metrics"""
        if not fields:
            return True
        
        # First get patient_id from account_id
        patient_id_query = """
            SELECT patient_id FROM patients WHERE account_id = %s
        """
        patient_result = self.db.execute_query(patient_id_query, (account_id,))
        
        if not patient_result or len(patient_result) == 0:
            return False
        
        patient_id = patient_result[0][0]
        
        # Check if health metrics record exists
        check_query = """
            SELECT COUNT(*) FROM patient_health_metrics WHERE patient_id = %s
        """
        check_result = self.db.execute_query(check_query, (patient_id,))
        
        if check_result and check_result[0][0] > 0:
            # Update existing record
            set_clauses = []
            params = []
            
            for field, value in fields.items():
                set_clauses.append(f"{field} = %s")
                params.append(value)
            
            # Add recorded_time update
            set_clauses.append("recorded_time = %s")
            params.append(datetime.now())
            params.append(patient_id)
            print(query)
            query = f"""
                UPDATE patient_health_metrics 
                SET {', '.join(set_clauses)}
                WHERE patient_id = %s
            """
        else:
            # Insert new record
            field_names = list(fields.keys()) + ['patient_id', 'recorded_time']
            field_values = list(fields.values()) + [patient_id, datetime.now()]
            placeholders = ', '.join(['%s'] * len(field_names))
            
            query = f"""
                INSERT INTO patient_health_metrics ({', '.join(field_names)})
                VALUES ({placeholders})
            """
            params = field_values
        
        result = self.db.execute_non_query(query, tuple(params))
        if not result or result == 0:
            return False
        return True
