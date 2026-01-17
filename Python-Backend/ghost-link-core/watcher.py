# 1. we use PSUtil to read system hardware and stats
import psutil
# 2. we use datetime to calculate how long the system has been running.
import datetime

def get_system_vitals():
    # 3. Get CPU usage (wait .1 seconds for a quick sample)
    cpu_percent = psutil.cpu_percent(interval=0.1)

    # 4. Get RAM usage
    memory = psutil.virtual_memory()

    # 5. Get uptime
    # Take the boot time and subtract it from right now
    boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
    uptime = datetime.datetime.now() - boot_time

    # 6. Formatting the data into a "Packet" (Dictionary)
    # Strip the microseconds from the uptime to keep it clean
    return{
        "cpu": f"{cpu_percent}%",
        "ram": f"{memory.percent}%",
        "uptime": str(uptime).split('.')[0]
    }

    