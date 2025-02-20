from huggingface_hub import InferenceClient
import os

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
