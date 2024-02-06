import json
import time
from datetime import datetime
from flask import Flask, Response, render_template, request
import InterfaceAdmin as IA

app = Flask(__name__)
global hostname
hostname = ""


@app.route('/')
def machines():
    IA.DEBUG_clean_machinesJson()
    IA.update_json()
    return render_template('home/ui-machines.html')


@app.route("/array_post", methods=['GET', 'POST'])
def array_post():
    if request.method == 'POST':
        a = request.form.getlist("contacts[]")
        with open('./static/assets/config.json', "r") as file:
            data = json.load(file)
        data["Machines"].append({
            "nom": a[0],
            "hostname": a[1],
            "port": int(a[2]),
            "log_path": a[3],
            "username": a[4],
            "password": a[5]
        })
        with open('./static/assets/config.json', "w") as file:
            json.dump(data, file)
    return ""


@app.route('/Machine/')
def machine():
    global hostname
    hostname = request.args.get('hostname')
    return render_template('home/ui-machine-detail.html')


def generate_random_data():
    while True:
        global hostname
        IA.DEBUG_clean_machinesJson()
        IA.update_json()
        # Open our JSON file and load it into python
        input_file = open('static/assets/machines.json')
        global hostname
        if(hostname != ""):
            json_array = json.load(input_file)[hostname]
            if(json_array["status"] == "Connected"):
                json_data = json.dumps({
                    'time': datetime.now().strftime('%H:%M:%S'),
                    'machine_name': json_array['machine_name'],
                    'status': json_array["status"],
                    'totalMem': json_array['memory']['totalMem'],
                    'usedMem': json_array['memory']['usedMem'],
                    'freeMem': json_array['memory']['freeMem'],
                    'sharedMem': json_array['memory']['sharedMem'],
                    'buffCacheMem': json_array['memory']['buffCacheMem'],
                    'availableMem': json_array['memory']['availableMem'],
                    "swapIn": json_array['memory']['swapIn'],
                    "swapOut": json_array['memory']['swapOut'],
                    "blockIn": json_array['memory']['blockIn'],
                    "blockOut": json_array['memory']['blockOut'],
                    "userTime": json_array['memory']['userTime'],
                    "sysTime": json_array['memory']['sysTime'],
                    "idle": json_array['memory']['idle'],
                    "wait": json_array['memory']['wait'],
                    'error': json_array['error'][:],
                    'access_log': json_array['access_log'][:],
                    'processes': json_array['processes'][:],
                    'current_processes': json_array['current_processes'][:]
                })
            else:
                json_data = json.dumps({
                    'time': datetime.now().strftime('%H:%M:%S'),
                    'machine_name': json_array['machine_name'],
                    'status': json_array["status"]
                })
        yield f"data:{json_data}\n\n"
        input_file.close()
        time.sleep(1)


@app.route('/chart-data')
def chart_data():
    return Response(generate_random_data(), mimetype='text/event-stream')
