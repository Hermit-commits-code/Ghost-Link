import subprocess
ALLOWED_COMMANDS =["ls", "whoami","pwd","date"]

def run_linux_command(user_input):
    if user_input.strip() not in ALLOWED_COMMANDS:
        return f"ACCESS DENIED: '{user_input}' is not a Ghost-Link approved command"

    try:
        output = subprocess.check_output(user_input, shell=True, text=True, stderr=subprocess.STDOUT)

        # If it works return a successful output
        return output


    # The Backup plan if the command fails like a typo, do this instead.
    except subprocess.CalledProcessError as e:
        # Catch the error and return the text of the error. (e.g.... Command not found..)
        return f"Linux Error: {e.output}"

    # The CATCH-ALL if anything else weird happens
    except Exception as e:
        return f"Unexpectd Error: {str(e)}"