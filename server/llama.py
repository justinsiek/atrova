from huggingface_hub import InferenceClient
import os
import json
import datetime

class LlamaChat:
    def __init__(self):
        self.client = InferenceClient(token=os.getenv("HUGGINGFACE_API_KEY"))
        self.MODEL = "meta-llama/Llama-3.2-3B-Instruct"

    def get_response(self, prompt):
        response = self.client.text_generation(
            prompt,
            model=self.MODEL,
            max_new_tokens=256,
            temperature=0.001
        )
        return response

    def extract_json(self, model_response):
        """Helper method to extract a JSON object from the model's response."""
        start_index = model_response.find('{')
        end_index = model_response.find('}', start_index)
        if start_index == -1 or end_index == -1:
            raise ValueError("Failed to extract JSON from model response.")
            
        json_extract = model_response[start_index:end_index+1]
        try:
            json_obj = json.loads(json_extract)
        except json.JSONDecodeError as e:
            raise ValueError("Extracted text is not valid JSON.") from e
        return json_obj, json_extract

    def extract_task(self, chat_str):
        extraction_prompt = (
            "[INST] Extract the task name and details from the following message and output ONLY a JSON object with exactly the key 'task'. "
            "Do NOT include any extra text, commentary, or additional keys. THE RESPONSE SHOULD BE A SINGLE JSON OBJECT.\n"
            f"Message: {chat_str}\n"
            "[/INST]"
        )
        
        model_response = self.get_response(extraction_prompt)
        return self.extract_json(model_response)

    def extract_timestamp(self, chat_str):

        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        extraction_prompt = (
            "[INST] Based on the following message and the current time, extract the complete timestamp for when the task should occur. "
            "Make sure the timestamp includes BOTH the date and the time, formatted as YYYY-MM-DD HH:MM:S. "
            "Output ONLY a JSON object with exactly the key 'date'. Do NOT include any additional text, commentary, or keys. "
            "THE RESPONSE SHOULD BE A SINGLE JSON OBJECT.\n"
            f"Message: {chat_str}\n"
            f"Current Date and Time: {current_time}\n"
            "[/INST]"
        )
        
        model_response = self.get_response(extraction_prompt)
        return self.extract_json(model_response)

    def get_task_details(self, chat_str):
        task_json, _ = self.extract_task(chat_str)
        timestamp_json, _ = self.extract_timestamp(chat_str)

        # Build a clean JSON object with the desired keys
        return {
            "task": task_json.get("task"),
            "timestamp": timestamp_json.get("date")
        }
