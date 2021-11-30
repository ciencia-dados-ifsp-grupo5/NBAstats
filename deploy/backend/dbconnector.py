import pandas as pd
import mysql.connector
from mysql.connector import errorcode


class DbConnector():
    def __init__(self, config) -> None:
        self.config = config
        self.connection = None

    def mysql_connect(self):
        
        try:
            self.connection = mysql.connector.connect(**self.config)
            return self.connection

        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print(f'[CONNERROR] Invalid credentials: {err}')
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print(f'[CONNERROR] Database does not exist: {err}')
            else:
                print(f'[CONNERROR] {err}')

        finally:
            return self.connection

    def mysql_close_connection(self):   
        try:
            self.connection.close()
        
        except mysql.connector.Error as err:
            print(f'[CLOSEERROR] Failed closing connection to mysql: {err}')
            raise

    def query(self, query):
        connection = self.mysql_connect()
        cursor = connection.cursor()
    
        cursor.execute(query)
        df = pd.DataFrame(cursor.fetchall(), columns=cursor.column_names)
    
        self.mysql_close_connection()
        return df.to_dict('records')
  