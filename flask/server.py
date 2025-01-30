
from flask import Flask, request, jsonify
import sqlite3
import hashlib
import hmac
import os

app = Flask(__name__)
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")

# Database setup
def init_db():
    with sqlite3.connect("game.db") as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                balance INTEGER DEFAULT 0,
                tool TEXT DEFAULT 'wood',
                tool_level INTEGER DEFAULT 1
            )
        """)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS inventory (
                user_id INTEGER,
                item TEXT,
                quantity INTEGER,
                FOREIGN KEY(user_id) REFERENCES users(id),
                PRIMARY KEY(user_id, item)
            )
        """)
        conn.commit()

init_db()

ORE_PRICING = {
    "land_surface": {"coal": 5, "iron": 10, "gold": 20},
    "cave_1": {"silver": 15, "ruby": 40},
    "moon": {"opal": 50, "diamond": 100, "magic": 500}
}

TOOLS = ["wood", "stone", "iron", "gold", "emerald", "ruby", "opal", "diamond", "magic"]

# Utility functions
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def verify_signature(data, signature):
    expected_signature = hmac.new(SECRET_KEY.encode(), data.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected_signature, signature)

# API Routes
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
    
    password_hash = hash_password(password)
    try:
        with sqlite3.connect("game.db") as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, password_hash))
            conn.commit()
        return jsonify({"message": "User registered successfully"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already taken"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400
    
    with sqlite3.connect("game.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        if user and user[0] == hash_password(password):
            return jsonify({"message": "Login successful"})
        else:
            return jsonify({"error": "Invalid credentials"}), 401

@app.route("/sell", methods=["POST"])
def sell():
    data = request.json
    username = data.get("username")
    item = data.get("item")
    quantity = data.get("quantity")
    area = data.get("area")
    signature = data.get("signature")
    
    if not username or not item or quantity is None or not signature or not area:
        return jsonify({"error": "Missing parameters"}), 400
    
    transaction_data = f"{username}:{item}:{quantity}:{area}"
    if not verify_signature(transaction_data, signature):
        return jsonify({"error": "Invalid signature"}), 403
    
    if item not in ORE_PRICING.get(area, {}):
        return jsonify({"error": "Invalid ore for this area"}), 400
    
    price = ORE_PRICING[area][item] * quantity
    
    with sqlite3.connect("game.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, balance FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        user_id, balance = user
        
        cursor.execute("SELECT quantity FROM inventory WHERE user_id = ? AND item = ?", (user_id, item))
        inventory = cursor.fetchone()
        if not inventory or inventory[0] < quantity:
            return jsonify({"error": "Not enough items"}), 400
        
        cursor.execute("UPDATE inventory SET quantity = quantity - ? WHERE user_id = ? AND item = ?", (quantity, user_id, item))
        cursor.execute("UPDATE users SET balance = balance + ? WHERE id = ?", (price, user_id))
        conn.commit()
        return jsonify({"message": "Item sold successfully", "new_balance": balance + price})

@app.route("/upgrade_tool", methods=["POST"])
def upgrade_tool():
    data = request.json
    username = data.get("username")
    signature = data.get("signature")
    
    if not username or not signature:
        return jsonify({"error": "Missing parameters"}), 400
    
    transaction_data = f"{username}:upgrade"
    if not verify_signature(transaction_data, signature):
        return jsonify({"error": "Invalid signature"}), 403
    
    with sqlite3.connect("game.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT tool, tool_level, balance FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        tool, tool_level, balance = user
        
        if tool_level >= 10:
            tool_index = TOOLS.index(tool)
            if tool_index < len(TOOLS) - 1:
                tool = TOOLS[tool_index + 1]
                tool_level = 1
            else:
                return jsonify({"error": "Max tool level reached"}), 400
        else:
            tool_level += 1
        
        upgrade_cost = tool_level * 100
        if balance < upgrade_cost:
            return jsonify({"error": "Not enough balance"}), 400
        
        cursor.execute("UPDATE users SET tool = ?, tool_level = ?, balance = balance - ? WHERE username = ?", (tool, tool_level, upgrade_cost, username))
        conn.commit()
        return jsonify({"message": "Tool upgraded successfully", "new_tool": tool, "new_level": tool_level})

if __name__ == "__main__":
    app.run(debug=True)
