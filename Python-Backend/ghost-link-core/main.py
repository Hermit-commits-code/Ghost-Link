# 1. IMPORTING TOOLS: Bringing in the 'FastAPI' framework to help us build the bridge
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # This is the 'Security Guard'
from engine import run_linux_command

# 2. INITIALIZATION: Creating the actual application object
app = FastAPI()

# 3. SECURITY (CORS): Browsers are scared of talking to servers by default.
# We have to tell the 'Security Guard' to let our Terminal Frontend (the island) talk to Python.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all 'islands' to connect for now
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. THE FIRST ROUTE: This is the 'Root' or the 'Welcome Mat'
# When the browser hits the home address, this function runs.
@app.get("/")
def read_root():
    # We return a 'Dictionary' (Key: Value pairs)
    # Python will automatically turn this into JSON for the browser to read.
    return {"status": "Ghost-Link Core is Active", "version": "1.0.0"}

# 5. THE COMMAND ROUTE: This is where the terminal magic happens
# We are creating a path called /cmd/ that takes a 'command' as a variable.
@app.get("/cmd/{command}")
def execute_command(command: str):
    # For now, we are just 'Echoing' back to verify the bridge works.
    # In the next step, we will make this run real Linux commands!
    result = run_linux_command(command) 
    return{"response": result}