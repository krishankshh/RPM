import requests
import json
import os
from src.config import get_config

config = get_config()

class DeepSeekService:
    def __init__(self):
        self.api_key = config.DEEPSEEK_API_KEY
        self.base_url = config.DEEPSEEK_BASE_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
    
    def chat_completion(self, messages, max_tokens=1000):
        """Send chat completion request to DeepSeek"""
        url = f"{self.base_url}/chat/completions"
        
        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": 0.7
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            return {
                'content': data['choices'][0]['message']['content'],
                'tokens_used': data['usage']['total_tokens']
            }
        except Exception as e:
            return {'error': str(e), 'tokens_used': 0}
    
    def get_embeddings(self, text):
        """Get embeddings for text"""
        url = f"{self.base_url}/embeddings"
        
        payload = {
            "model": "deepseek-embedding",
            "input": text
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            return data['data'][0]['embedding']
        except Exception as e:
            print(f"Embedding error: {e}")
            return None

def load_prompt_template(template_name):
    """Load prompt template from file"""
    template_path = os.path.join('prompts', f'{template_name}.txt')
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return None

def fill_template(template, **kwargs):
    """Fill template with provided variables"""
    for key, value in kwargs.items():
        template = template.replace(f'{{{{{key}}}}}', str(value))
    return template

