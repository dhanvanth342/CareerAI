import os
from openai import OpenAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import json

load_dotenv()


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

    def generate_questions(self, initial_context):
        """
        Generate questions based on initial context
        """
        prompt = f"""Based on the user's initial context: {initial_context}
        Generate 8-12 focused questions to gather necessary information 
        for creating personalized career advice. Include multiple choice 
        options where appropriate.

        The questions should help understand:
        - Educational background
        - Career interests
        - Skills
        - Geographic location
        - Personal preferences
        - Professional goals

        Provide output in strict JSON format with optional choices."""

        try:
            response = self.groq_client.invoke(prompt)
            # Process and validate the response
            questions = json.loads(response.content)
            return questions
        except Exception as e:
            return [
                {"question": "What is your highest level of education?",
                 "choices": ["High School", "Bachelor's", "Master's", "PhD"]},
                {"question": "Which country are you currently located in?"},
                {"question": "What are your primary career interests?",
                 "choices": ["Technology", "Healthcare", "Business", "Creative Fields", "Other"]}
            ]

    def generate_prompt(self, initial_context, questions, answers):
        """
        Generate a comprehensive prompt for career recommendations
        """
        # Format questions and answers
        formatted_answers = []
        for i, question in enumerate(questions):
            # Use str(i) to match the string keys in the answers dictionary
            answer = answers.get(str(i), "")
            formatted_answers.append(f"Q: {question['question']}\nA: {answer}")

        answers_text = "\n".join(formatted_answers)

        # Create detailed prompt
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

    def generate_recommendations(self, final_prompt):
        """
        Generate top 5 career recommendations
        """
        enhanced_prompt = f"""{final_prompt}

        IMPORTANT INSTRUCTIONS FOR GENERATING CAREER RECOMMENDATIONS:
        1. Provide EXACTLY 5 career recommendations
        2. Ensure each recommendation is comprehensive and detailed
        3. Format MUST be a valid JSON array of objects
        4. Include the following detailed information for each career:

        Recommended JSON Structure:
        {{
            "career": "Exact Job Title",
            "overview": "Comprehensive 2-3 sentence description of the role",
            "job_responsibilities": [
                "Key responsibility 1",
                "Key responsibility 2",
                "Key responsibility 3"
            ],
            "education": {{
                "minimum_requirement": "Degree type required",
                "recommended_majors": ["Major 1", "Major 2"],
                "certifications": ["Optional cert 1", "Optional cert 2"]
            }},
            "average_salary": {{
                "entry_level": {{"range": "$X - $Y", "median": "$Z"}},
                "mid_level": {{"range": "$X - $Y", "median": "$Z"}},
                "senior_level": {{"range": "$X - $Y", "median": "$Z"}}
            }},
            "skills_required": {{
                "technical_skills": ["Skill 1", "Skill 2"],
                "soft_skills": ["Skill 1", "Skill 2"]
            }},
            "career_growth_potential": {{
                "promotion_paths": ["Path 1", "Path 2"],
                "industry_demand": "High/Medium/Low"
            }},
            "work_environment": {{
                "typical_work_settings": ["Office", "Remote", "Hybrid"],
                "work_life_balance_score": "X/10"
            }}
        }}

        CRITICAL REQUIREMENTS:
        - Ensure JSON is perfectly formatted
        - Provide realistic, data-driven information
        - Tailor recommendations to the user's specific context
        - Include diverse career options
        - Provide actionable insights"""

        try:
            response = self.openrouter_client.chat.completions.create(
                model=self.openrouter_model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system",
                     "content": "You are an expert career advisor AI. Provide precise, structured career recommendations."},
                    {"role": "user", "content": enhanced_prompt}
                ],
                max_tokens=1500  # Increased token limit for detailed response
            )

            # Extract and parse the response
            response_content = response.choices[0].message.content

            # Additional parsing to ensure valid JSON
            try:
                recommendations = json.loads(response_content)

                # Validate the structure
                if not isinstance(recommendations, list) or len(recommendations) != 5:
                    raise ValueError("Recommendations must be a list of 5 items")

                return recommendations


            except (json.JSONDecodeError, ValueError) as json_err:

                error_message = f"JSON Parsing Error: {str(json_err)}"

                print(error_message)

                return error_message


        except Exception as e:

            error_message = f"Recommendation Generation Error: {str(e)}"

            print(error_message)

            return error_message
