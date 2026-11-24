import sqlite3, os, sys
os.makedirs("data", exist_ok=True)
p = "data/app.db"
if os.path.exists(p): os.remove(p)
c = sqlite3.connect(p)
c.execute("CREATE TABLE orders (order_id INTEGER PRIMARY KEY, customer TEXT, amount REAL, status TEXT)")
c.executemany("INSERT INTO orders VALUES (?,?,?,?)", [
 (1,"Alice",120.5,"paid"),(2,"Bob",35.0,"pending"),(3,"Carla",80.0,"paid"),(4,"Dan",15.25,"paid"),(5,"Eve",60.0,"pending")])
c.commit(); c.close(); print("app.db created: 5 rows")
