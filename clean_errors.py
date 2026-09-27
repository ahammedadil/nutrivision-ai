import os

with open('frontend/src/pages/Scanner.tsx', 'r') as f:
    code = f.read()

catch_target = """        let errorMsg = 'Failed to analyze image. Make sure the backend is running.';
        
        if (error.response) {
            if (error.response.data && error.response.data.error) {
                errorMsg = 'Backend JSON Error: ' + error.response.data.error;
            } else if (typeof error.response.data === 'string') {
                errorMsg = 'Backend HTTP Error ' + error.response.status + ': (HTML Returned)';
            } else {
                errorMsg = 'Backend Error Status: ' + error.response.status;
            }
        } else if (error.message) {
            errorMsg = 'Network/Client Error: ' + error.message;
        }
        
        setErrorUI(errorMsg);"""

catch_replace = """        let errorMsg = 'Nova failed to analyze the image. Please check your internet connection and try again.';
        
        if (error.response) {
            const status = error.response.status;
            if (status === 429) {
                errorMsg = "Nova AI Rate Limit Exceeded. You have scanned too many items too quickly! Please wait 60 seconds before scanning again.";
            } else if (status === 503 || status === 502) {
                errorMsg = "Nova AI servers are currently experiencing extremely high traffic. Please wait a moment and try again.";
            } else if (status === 400) {
                errorMsg = "Nova AI could not understand this image. Please make sure the food is clearly visible and try again.";
            } else {
                errorMsg = "Nova AI encountered an unexpected server error. Please try another image.";
            }
        }
        
        setErrorUI(errorMsg);"""

if catch_target in code:
    code = code.replace(catch_target, catch_replace)
else:
    print("Could not find the target code to replace. Please check the source.")

with open('frontend/src/pages/Scanner.tsx', 'w') as f:
    f.write(code)
