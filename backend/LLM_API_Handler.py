import os
from openai import OpenAI
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import json
import logging
from graphviz import Source

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LLMHandler:
    def __init__(self, openrouter_model="anthropic/claude-3.5-haiku-20241022:beta",
                 groq_model="llama-3.3-70b-versatile"):
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
        provide the top 5 career recommendations. For each recommendation, include:  
        1. Job role title  
        2. Brief description of the role in less than 30 words
        3. The match percentage of how well the recommendation aligns with the input prompt, in percentage (e.g., 75%).

        Provide the output strictly in a valid, well-structured JSON format.  
        Ensure the recommedations order is sorted based on the match percentage, highest being at the top.
        STRICTLY the response should **only** contain a JSON object without extra text.  

        ### Example Output Format:  
        {
          "career_recommendations": [
            {
              "job_role": "Example Job Role",
              "description": "Brief description of the role.",
              "match_percentage": "85%"
            }
          ]
        }
        """

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

    def generate_dot_code(self, user_prompt, job_title):
        """
        Generate DOT code using OpenRouter/Claude.
        """
        # Validate inputs
        if not user_prompt or not isinstance(user_prompt, str) or not job_title or not isinstance(job_title, str):
            logger.error("Invalid prompt or job title provided")
            return {
                "error": "Invalid or empty prompt/job title",
                "dot_code": ""
            }
        system_prompt = (

            f"You are responsible for generating DOT language code to create a clear and visually understandable education roadmap. "
            f"This roadmap should illustrate the educational journey a user must take from their current education level (extract from the user prompt) "
            f"to achieving the target job title: {job_title}. The roadmap can have multiple branches or a single path, depending on what best fits the user's background. "

            f"Follow these **guidelines** while generating the DOT code:\n\n"
            f"1. Begin the DOT code with [resolution=900] to ensure high resolution.\n"
            f"2. STRICTLY The graph name **must not** contain spaces, but node and edge names may include spaces."
            f"  - for example [digraph machinelearningengineer] is right way of naming a graph, but not [digraph machine learning engineer]\n"
            f"3. The DOT code must define the appropriate graph type (e.g., digraph for directed graphs or graph for undirected graphs) based on the user's query \n "
            f"4. Choose the most suitable layout engine [dot, neato, fdp, sfdp, circo, twopi, osage, and patchwork] for rendering the graph, "
            f"considering factors such as clarity, visual appeal, and the structure of the relationships being depicted. \n"
            f"5. Use valid Graphviz-supported or custom hexadecimal colors (\"#4CAF50\").\n"
            f"6. If the user query does not specify colors, default to pastel shades that are visually suitable for flowcharts with good text contrast to ensure readability.\n"
            f"7. Validate the DOT code to ensure it adheres to Graphviz syntax, including the use of valid node names and avoiding reserved keywords. \n"
            f"This is the example structure you can follow for the parameters to include in the start of the code:\n"
            f"digraph nameofgraph {{resolution = 900 layout= circo; rest of the code}}"
            f"8. If the input cannot be expressed in a flowchart (e.g., typos or meaningless queries), generate a generic response stating to elaborate the query"
            f"in the dot code with one square border to the text.:\n"
            f"9. The output should only be DOT CODE, STRICTLY Avoid preamble, unnecessary comments, or extraneous symbols,  \n\n"

        )

        try:
            response = self.openrouter_client.chat.completions.create(
                model=self.openrouter_model,
                messages=[{"role": "system", "content": system_prompt},
                          {"role": "user", "content": user_prompt}]
                # extra_headers={"X-Custom-Provider": str(self.provider_config)}
            )

            dot_code = response.choices[0].message.content.strip()

            # Extract and validate DOT code
            if "digraph" in dot_code:
                dot_code_start = dot_code.find("digraph")
                dot_code = dot_code[dot_code_start:].strip()
            elif "graph" in dot_code:
                dot_code_start = dot_code.find("graph")
                dot_code = dot_code[dot_code_start:].strip()
            else:
                print("Warning: Generated DOT code does not contain 'digraph' or 'graph'.")

            # Cleanup DOT code
            # dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\\\[\]=#\+\-\*/\^%()]", " ", dot_code)
            return dot_code

        except Exception as e:
            raise Exception(f"Error in OpenRouter API call: {e}")

    def fix_dot_code(self, dot_code, error_message):
        """
        Use OpenRouter/Claude to fix the DOT code based on the error message.
        """
        prompt = (
            f"Your task is to fix errors in the given DOT code and generate an error-free version that successfully renders as an education roadmap flowchart.\n"
            f"The DOT code is:\n{dot_code}\n"
            f"The error message is: {error_message}\n\n"

            f"Please follow these **guidelines** while correcting the DOT code:\n"
            f"1. Identify the issues mentioned in the error message and correct them while maintaining the original intent of the roadmap.\n"
            f"2. Ensure the graph name does not contain spaces. For example, [digraph EducationRoadmap] is correct, but not [digraph Education Roadmap].\n"
            f"3. If node or edge labels include spaces, enclose them in double quotes to avoid syntax errors.\n"
            f"   - Example: [\"High School\" -> \"Bachelor's Degree\"] is valid.\n"
            f"4. Set the resolution of the DOT code as 900 [resolution=900] at the beginning.\n"
            f"5. The corrected DOT code must preserve the intended roadmap structure, ensuring logical education progression towards the given job title.\n"
            f"6. The response DOT code MUST use 'digraph' since education roadmaps represent a directional progression.\n"
            f"7. Validate the DOT code to ensure compliance with Graphviz syntax, avoiding reserved keywords or invalid node names.\n"
            f"8. Ensure the correct use of '->' to represent the flow of education steps.\n"
            f"9. STRICTLY NO PREAMBLE OR UNNECESSARY COMMENTS. Generate only the corrected DOT code as output.\n"
        )
        # return prompt

        try:
            response = self.openrouter_client.chat.completions.create(
                model=self.openrouter_model,
                messages=[{"role": "user", "content": prompt}]
                # extra_headers={"X-Custom-Provider": str(self.provider_config)}
            )

            dot_code = response.choices[0].message.content.strip()

            # Extract and validate DOT code
            if "digraph" in dot_code:
                dot_code_start = dot_code.find("digraph")
                dot_code = dot_code[dot_code_start:].strip()
            elif "graph" in dot_code:
                dot_code_start = dot_code.find("graph")
                dot_code = dot_code[dot_code_start:].strip()
            else:
                print("Warning: Generated DOT code does not contain 'digraph' or 'graph'.")

            # Cleanup DOT code
            # dot_code = re.sub(r"[^a-zA-Z0-9\s\-\->;{}\"\\\[\]=#\+\-\*/\^%()]", " ", dot_code)
            return dot_code

        except Exception as e:
            raise Exception(f"Error in OpenRouter API call: {e}")

    def generate_text_response(self, job_title, user_prompt):
        """
        Generate a textual explanation using Groq/Llama.
        """
        system_prompt = (
            f"You are an AI career advisor. Your task is to generate a structured response based on the given job title and user prompt."
            f" Provide insights into the job role, why it aligns with the user's background and interests, and the average salary range."
            f"\n\nFollow these **guidelines** while generating the response:\n"
            f"1. Explain what the job title '{job_title}' entails in **less than 50 words**.\n"
            f"2. Provide a brief explanation of why this role aligns with the user based on their prompt: '{user_prompt}'.\n"
            f"3. Determine the salary based on the user's origin country given in the prompt, if users country is not mentioned give the salary based in USA.\n"
            f"4. If the user mentions interest in studying abroad, generate:\n"
            f"   - The average salary range in their origin country.\n"
            f"   - The salary range for this job in the USA (if applicable).\n"
            f"5. Return the response strictly in **JSON format** with the following keys:\n\n"
            f"Example JSON structure:\n"
            f"{{\n"
            f'  "job_description": "Brief job description in less than 50 words.",\n'
            f'  "alignment": "Explanation based on user prompt.",\n'
            f'  "average_salary": {{\n'
            f'      "local_salary": "XX,XXX - YY,YYY [Currency]",\n'
            f'      "usa_salary ": "XX,XXX - YY,YYY USD"\n'
            f"  }}\n"
            f"}}\n\n"
            f"Ensure that the JSON output is **well-structured, accurate, and free from unnecessary text**."
            f"STRICTLY the response should **only** contain a JSON object without extra text."
        )

        try:
            response = self.groq_client.invoke(system_prompt)
            response_content = response.content.strip()

        # Debugging: Print raw response
            print("Raw Response from LLM:", repr(response_content))

        # **Fix: Remove triple backticks if present**
            if response_content.startswith("```json"):
                response_content = response_content[7:]  # Remove ```json\n
            if response_content.endswith("```"):
                response_content = response_content[:-3]  # Remove \n```

        # Handle empty response
            if not response_content:
                return {"error": "Empty response from LLM", "raw_response": ""}

        # Attempt to parse JSON
            try:
                response_json = json.loads(response_content)
            except json.JSONDecodeError:
                print("error" "Invalid JSON format from model");
                return {"raw_response": response_content}

        # Normalize key names (case and spacing)
            normalized_response = {k.strip().lower(): v for k, v in response_json.items()}

            if "average salary" in normalized_response:
                avg_salary = normalized_response.pop("average salary")
                normalized_avg_salary = {k.strip().lower().replace(" ", "_"): v for k, v in avg_salary.items()}
                normalized_response["average_salary"] = normalized_avg_salary

        # Ensure correct format
            explanation = {
            "job_description": normalized_response.get("job_description", ""),
            "alignment": normalized_response.get("alignment", ""),
            "average_salary": {
                "local_salary": normalized_response.get("average_salary", {}).get("local_salary", ""),
                "usa_salary": normalized_response.get("average_salary", {}).get("usa_salary", "")
            }
        }

        # Debugging: Print parsed output
            print("Parsed Explanation:", json.dumps(explanation, indent=2))

            return explanation

        except Exception as e:
           raise Exception(f"Error in Groq API call: {e}")

    def validate_and_render_dot_code(self, dot_code, output_file="flowchart"):
        """
        Validate and render the DOT code. Use LLM to fix errors if encountered.
        """
        max_retries = 5
        for attempt in range(max_retries):
            try:
                graphviz_path = r"C:\Program Files\Graphviz\bin"
                os.environ["PATH"] += os.pathsep + graphviz_path

                src = Source(dot_code, format="jpeg", engine="dot")
                output_path = src.render(output_file, cleanup=True)
                return output_path
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"Render attempt {attempt + 1} failed. Sending error to LLM...")
                    dot_code = self.fix_dot_code(dot_code, str(e))
                else:
                    raise RuntimeError(f"DOT code validation failed after {max_retries} attempts. Error: {e}")
