import os
from openai import OpenAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import json
import logging
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
class LLMHandler:
    def __init__(self, openrouter_model="perplexity/sonar-reasoning",
                 groq_model="llama-3.3-70b-specdec"):
        # OpenRouter initialization
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable not set.")

        self.openrouter_client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.openrouter_api_key,
            default_headers={
                "HTTP-Referer": "null",
                "X-Title": "CareerAdvisor",
            }
        )
        self.openrouter_model = openrouter_model

        # Groq initialization
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable not set.")

        self.groq_client = ChatGroq(
            groq_api_key=self.groq_api_key,
            model_name=groq_model
        )
        self.groq_model = groq_model

    def generate_questions(self, initial_context, highest_education, country):
        """
        Generate questions based on initial context
        """
        prompt = f"""Based on the user's initial context: {initial_context},
        highest education level: {highest_education}, and country user lives in: {country}.

        Generate 8-12 focused questions to gather necessary information
        for creating personalized career advice. Include multiple choice
        options where appropriate.

        The questions should help understand:
        - Career interests
        - Skills
        - Personal preferences
        - Professional goals

        Provide output in strict JSON format with optional choices.
        Return the questions in this exact JSON format:
        [
            {{"question": "Question 1", "choices": ["Choice 1", "Choice 2"]}},
            {{"question": "Question 2"}},
            {{"question": "Question 3", "choices": ["Choice 1", "Choice 2", "Choice 3"]}}
        ]

        For multiple choice questions, keep Other as compulsory option as must. 

        
        """

        default_questions = [
            {
                "question": "What are your primary career interests?",
                "choices": ["Technology", "Healthcare", "Business", "Creative Fields", "Other"]
            },
            {
                "question": "If you were to wake up in your dream job, what would make you jump out of bed with excitement?",
                "choices": ["Making an Impact", "Learning something new every day", "Money",
                            "Freedom and Flexibility at work", "Other"]
            }
        ]

        try:
            response = self.groq_client.invoke(prompt)
            response_text = response.content.strip()

            if not response_text:
                raise ValueError("Received empty response from LLM")

            start_idx = response_text.find('[')
            end_idx = response_text.rfind(']') + 1

            if start_idx == -1 or end_idx == 0:
                raise ValueError("Could not find JSON array in response")

            json_str = response_text[start_idx:end_idx]
            questions = json.loads(json_str)

            if not isinstance(questions, list):
                raise ValueError("Parsed JSON is not a list")

            for question in questions:
                if 'question' not in question:
                    raise ValueError(f"Invalid question format: {question}")

            return questions, initial_context

        except Exception as e:
            print(f"Error in generate_questions: {e}")
            return default_questions, initial_context

    def generate_prompt(self, initial_context, questions, answers):
        """
        Generate a comprehensive prompt for career recommendations
        """
        formatted_answers = []
        for i, question in enumerate(questions):
            answer = answers.get(str(i), "")
            formatted_answers.append(f"Q: {question['question']}\nA: {answer}")

        answers_text = "\n".join(formatted_answers)

        prompt = f"""Your task is to generate a prompt for career recommendation generation using the below context and answers:

                Initial Context given by user: {initial_context}

                Detailed User Responses:
                {answers_text}
                Please follow the below instructions while drafting the prompt: 
                1. Use the complete information in the context and answers.
                2. You should draft best suitable prompt that can be used for generating personalized career recommendations based on information provided by user.
                3. Generate only the prompt and STRICTLY NO PREAMBLE.

                The goal is by using this prompt, the user can obtain personalized career recommendation that gives extreme clarity on what career paths you would choose."""

        try:
            response = self.groq_client.invoke(prompt)
            return response.content
        except Exception as e:
            return f"Unable to generate personalized prompt. Error: {str(e)}"

    def generate_recommendations(self, prompt):
        """
        Generate career recommendations based on the provided prompt
        with comprehensive error handling and logging
        """
        # Validate input
        if not prompt or not isinstance(prompt, str):
            logger.error("Invalid prompt provided")
            return {
                "error": "Invalid or empty prompt",
                "career_recommendations": []
            }

        # System prompt
        system_prompt = """You are a career advisor expert. Based on the user's information,  
        provide the top 2 career recommendations. For each recommendation, include:  
        1. Job role title  
        2. Brief description of the role  
        3. The top 5 influential individuals in this field, ranked based on their significant contributions.  
           - Include their name and a relevant profile URL (e.g., LinkedIn, personal website, or research page).  

        Provide the output strictly in a valid, well-structured JSON format.  
        Ensure the response **only** contains a JSON object without extra text.  

        ### Example Output Format:  
        {
          "career_recommendations": [
            {
              "job_role": "Example Job Role",
              "description": "Brief description of the role.",
              "influential_figures": [
                {"name": "Influential 1", "profile_url": "https://example.com"},
                {"name": "Influential 2", "profile_url": "https://example.com"},
                {"name": "Influential 3", "profile_url": "https://example.com"},
                {"name": "Influential 4", "profile_url": "https://example.com"},
                {"name": "Influential 5", "profile_url": "https://example.com"}
              ]
            }
          ]
        }
        }"""

        try:
            # API Call
            response = self.openrouter_client.chat.completions.create(
                model=self.openrouter_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )

            # Extract response content
            response_content = response.choices[0].message.content.strip()

            # **Fix: Remove triple backticks if present**
            if response_content.startswith("```json"):
                response_content = response_content[7:]  # Remove ```json\n
            if response_content.endswith("```"):
                response_content = response_content[:-3]  # Remove \n```

            # Parse JSON
            parsed_response = json.loads(response_content)

            # Validate structure
            if isinstance(parsed_response, dict) and "career_recommendations" in parsed_response:
                logger.info("Recommendations generated successfully")
                return parsed_response

            # If structure is unexpected, return error
            logger.error("Unexpected response structure")
            return {
                "error": "Unexpected response structure",
                "raw_response": response_content,
                "career_recommendations": []
            }

        except json.JSONDecodeError as json_err:
            logger.error(f"JSON Parsing Error: {json_err}")
            logger.error(f"Problematic Response Content: {response_content}")
            return {
                "error": "Failed to parse model response",
                "raw_response": response_content,
                "career_recommendations": []
            }

        except Exception as e:
            logger.error(f"Recommendation Generation Error: {str(e)}")
            return {
                "error": f"Failed to generate recommendations: {str(e)}",
                "career_recommendations": []
            }
