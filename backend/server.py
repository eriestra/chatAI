import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from anthropic import Anthropic

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    
    response = anthropic.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1000,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )
    
    return jsonify({"response": response.content[0].text})

if __name__ == '__main__':
    app.run(debug=True)