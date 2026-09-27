import re

with open('backend/services/gemini_service.py', 'r') as f:
    code = f.read()

target = """        try:
            response = self.client.models.generate_content(
                model='gemini-3.8-flash',
                contents=[
                    prompt,
                    types.Part.from_bytes(
                        data=open(image_path, "rb").read(),
                        mime_type='image/jpeg',
                    )
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=FoodResponse,
                    temperature=0.1,
                ),
            )
            
            parsed_json = json.loads(response.text)
            return parsed_json.get("foods", [])
        except Exception as e:
            print("Failed to parse Gemini response:", e)
            raise e"""

retry = """        import time
        for attempt in range(4):
            try:
                response = self.client.models.generate_content(
                    model='gemini-3.8-flash',
                    contents=[
                        prompt,
                        types.Part.from_bytes(
                            data=open(image_path, "rb").read(),
                            mime_type='image/jpeg',
                        )
                    ],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=FoodResponse,
                        temperature=0.1,
                    ),
                )
                
                parsed_json = json.loads(response.text)
                return parsed_json.get("foods", [])
            except Exception as e:
                if '503' in str(e) and attempt < 3:
                    time.sleep(2)
                    continue
                print("Failed to parse Gemini response:", e)
                raise e"""

code = code.replace(target, retry)

with open('backend/services/gemini_service.py', 'w') as f:
    f.write(code)
