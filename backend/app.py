from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "Backend is running on AWS!"})

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.get_json() or request.form.to_dict()
    name = data.get('name', 'Guest')
    email = data.get('email', 'Not provided')
    return jsonify({
        "message": f"Data received successfully for {name}!",
        "name": name,
        "email": email
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
