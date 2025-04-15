import psycopg2
from getpass import getpass

# Get connection details from user input
host = input("Enter host: ")
dbname = input("Enter database name: ")
user = input("Enter user: ")
password = getpass("Enter password: ")
port = input("Enter port: ")

try:
    conn = psycopg2.connect(
        host=host,
        dbname=dbname,
        user=user,
        password=password,
        port=port
    )
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    result = cur.fetchone()
    if result:
        print("Connection successful!")
    else:
        print("Connection test failed: No result returned")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Connection failed: {str(e)}")