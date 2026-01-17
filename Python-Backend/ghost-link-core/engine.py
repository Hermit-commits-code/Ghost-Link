# 1. standard toolkit
import subprocess

# 2. Updated Whitelist (The "Root" Commands)
# I only need the base commands for now, not every variation.
ALLOWED_BASES = ['ls', 'whoami', 'pwd', 'date','neofetch', 'echo']

def run_linux_command(user_input):
    # 3. The LOGIC UPGRADE:
    # Take the input, strip spaces, and split it into a list of words
    # Example "ls -la" becomes ["ls", "-la"]
    parts = user_input.strip().split()

    # 4. SAFETY CHECK: if the user just hit enter, do nothing.
    if not parts:
        return ""

    # 5. The SMART CHECK: we only check if the FIRST word is allowed
    command_base = parts[0]

    if command_base not in ALLOWED_BASES:
        return f"ACCESS DENIED: '{command_base}' is not  a Ghost-Link approved tool."

    # 6. THE EXECUTION: Now we run the full user_input (with flags!)
    try:
        # We still use shell=True so Linux can handle the flags correctly
        output = subprocess.check_output(user_input, shell=True, text=True, stderr=subprocess.STDOUT)
        return output
    
    except subprocess.CalledProcessError as e:
        return f"Linux Error: {e.output}"
    except Exception as e:
        return f"Unexpected Error: {str(e)}"