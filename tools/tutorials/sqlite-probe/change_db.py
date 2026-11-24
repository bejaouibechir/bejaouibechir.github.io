import sqlite3
c = sqlite3.connect("data/app.db")
c.execute("UPDATE orders SET status='paid' WHERE order_id=2")
c.execute("INSERT INTO orders VALUES (6,'Fay',200.0,'paid')")
c.commit(); c.close(); print("app.db changed: order 2 paid, order 6 added")
