import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from LLM_API_Handler import LLMHandler

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize LLM Handler
llm_handler = LLMHandler()


@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    try:
        data = request.get_json()
        initial_context = data.get('initial_context', '')
        highest_education = data.get('highest_education', '')  # Fixed field name to match request
        country = data.get('country', '')

        if not initial_context:
            return jsonify({"error": "Initial context is required"}), 400

        questions = llm_handler.generate_questions(initial_context, highest_education, country)

        if not isinstance(questions, list):
            return jsonify({"error": "Invalid response format from LLM"}), 500

        return jsonify({"questions": questions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/generate-prompt', methods=['POST'])
def generate_prompt():
    try:
        data = request.json

        # Extract required fields
        initial_context = data.get('initial_context', '')
        questions = data.get('questions', [])
        answers = data.get('answers', {})

        # Validate input
        if not initial_context:
            return jsonify({"error": "Initial context is required"}), 400

        if not questions or not answers:
            return jsonify({"error": "Questions and answers are required"}), 400

        # Generate prompt
        prompt = llm_handler.generate_prompt(
            initial_context=initial_context,
            questions=questions,
            answers=answers
        )

        return jsonify({"prompt": prompt})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate-recommendations', methods=['POST'])
def generate_recommendations():
    try:
        data = request.json
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        recommendations = llm_handler.generate_recommendations(prompt)
        return jsonify(recommendations)
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)