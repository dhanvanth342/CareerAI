import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from LLM_API_Handler import LLMHandler
import base64
# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "https://nextenti-frontend.onrender.com",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
# Initialize LLM Handler
llm_handler = LLMHandler()

# Store questions temporarily
generated_questions = []
initial_context = ""

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    global generated_questions, initial_context
    #global initial_context
    try:
        data = request.get_json()
        initial_context = data.get('initial_context', '')
        highest_education = data.get('highest_education', '')
        country = data.get('country', '')

        if not initial_context:
            return jsonify({"error": "Initial context is required"}), 400

        questions, returned_initial_context = llm_handler.generate_questions(initial_context, highest_education, country)

        generated_questions = questions

        return jsonify({
            "questions": questions,
            "initial_context": returned_initial_context
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get-questions', methods=['GET'])
def get_questions():
    try:
        return jsonify({
            "questions": generated_questions,
            "initial_context": initial_context
        })

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
        prompt = data.get('prompt', '')

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        recommendations = llm_handler.generate_recommendations(prompt)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

job_title = ""
@app.route('/generate-roadmap', methods=['POST'])
def road_map():
    #if request.method == 'OPTIONS':
     #   return jsonify({}), 200

    try:
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        user_prompt = data.get('user_prompt')
        if not user_prompt:
            return jsonify({'error': 'No user prompt provided'}), 400
        job_title = data.get('job_title')
        if not job_title:
            return jsonify(({'error': 'Could not fetch job title'})), 400
        #query_handler = GrokHandler()
        dot_code = llm_handler.generate_dot_code(user_prompt, job_title)
        if not dot_code:
            return jsonify({'error': 'Failed to generate flowchart structure'}), 500

        output_image_path = llm_handler.validate_and_render_dot_code(
            dot_code,
            output_file="flowchart"
        )

        if not output_image_path or not os.path.exists(output_image_path):
            return jsonify({'error': 'Failed to generate flowchart image'}), 500

        explanation = llm_handler.generate_text_response(job_title, user_prompt)
        if not explanation:
            return jsonify({'error': 'Failed to generate explanation'}), 500

        try:
            with open(output_image_path, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode()
        except Exception as e:
            return jsonify({'error': 'Failed to process the generated image'}), 500

        try:
            if os.path.exists(output_image_path):
                os.remove(output_image_path)
            if os.path.exists(output_image_path + ".jpeg"):
                os.remove(output_image_path + ".jpeg")
        except Exception as e:
            print(f"Warning: Failed to clean up temporary files: {str(e)}")

        return jsonify({
            'flowchart': encoded_image,
            'explanation': explanation
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred. Please try again.'}), 500

if __name__ == '__main__':
    # Use the PORT environment variable for dynamic port binding
    port = int(os.environ.get('PORT', 5000))  # Default to 5000 if not set
    app.run(host='0.0.0.0', port=port)
