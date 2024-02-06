import paramiko
import re
import json


def init_connexion(hostname, port, username, password):
    # La connexion est géré par paramiko, on retourne le client pour garder la même connexion pour une itération de l'application.
    try:
        client = paramiko.SSHClient()
        client.load_system_host_keys()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy)

        client.connect(hostname, port=port, username=username, password=password)

        return client
    except Exception:
        # Si la connexion échoue, on gère l'exception sans arreter le programme.
        return "Connexion failed"


def do_command(client: paramiko.SSHClient, command):
    # Cette fonction est appelé à chaque fois qu'on a une command a exécuter sur la machine a monitorer. La sortie est une string.
    _, stdout, stderr = client.exec_command(command)
    output: str = stdout.read().decode("utf-8")
    return output


def display_command(output: str):
    # Fonction utiliser pour le débogage, surtout dans les débuts du projets avant que les testes unitaires soient en place.
    # Elle affiche ligne par ligne le résultat de la commande exécuté sur la machine.
    for line in output.splitlines():
        print(line)

# Ensemble de fonctions permétant de récuperer les informations qu'on souhaite monitorer sur les machines distantes.


def get_memory(client):
    return do_command(client, 'free')


def get_error_log(client, path):
    # Pour les logs d'erreurs, on récupères des champs spécifiques pour avoir la date et le pid de l'erreur
    # petit hack pour le parsing de error log, on nous avait dit que le format était toujours le même, en fait non
    out = do_command(client, "cd " + path + ";cat error.log| awk '{ print $1 \" \" $2 \" \" $3 \" \" $4 \" \" $5 \" \" $6}'")
    return out


def get_access_log(client, path):
    # Pour les logs d'acces, on récupère des champs spécifiques pour avoir l'ip et le chemin de l'acces.
    return do_command(client, "cd " + path + "; cut -d ' ' -f 1,7 access.log")


def get_processes(client):
    # Pour cette fonction, on décide de ne récupérer que les 10 premiers processes par ordre décroissant d'utilisation de la mémoire.
    # Les 6 premieres lignes renvoyer par la commande top donne des informations divers, dont on ne eux pas.
    return do_command(client, 'top -b -o "%MEM" -n 1').splitlines()[6:16]


def get_current_processes(client):
    return do_command(client, 'ps').splitlines()


def get_vmstat(client):
    return do_command(client, 'vmstat')


def get_machine_name(client):
    return do_command(client, 'uname').splitlines()[0]


def memory_stat(vmStat: str, memory: str):
    # Pour la mémoire on assemble les informations des commandes free et vmStat.
    statLine = vmStat.splitlines()[2]  # Les données sont sur la ligne 2.
    statLine = re.sub(r'\s+', ' ', statLine)  # cette ligne permet de remplacer chaque groupes d'espace par un unique espace.
    stat = statLine.split(' ')

    memLine = memory.splitlines()[1]  # Les dnnées sont sur la ligne 1.
    memLine = re.sub(r'\s+', ' ', memLine)
    mem = memLine.split(' ')

    # Si on a pas utiliser seulement "vmstat", c'est parceque "free" est plus complet en terme de mémoire.
    memory_ = {
        'totalMem': mem[1],
        'usedMem': mem[2],
        'freeMem': mem[3],
        'sharedMem': mem[4],
        'buffCacheMem': mem[5],
        'availableMem': mem[6],
        'swapIn': stat[7],  # infos sur le memory swap, voir https://www.linuxtricks.fr/wiki/performance-vmstat
        'swapOut': stat[8],
        'blockIn': stat[9],        # infos sur l'utilisation du disque
        'blockOut': stat[10],
        'userTime': stat[13],      # infos sur l'utilisation CPU
        'sysTime': stat[14],
        'idle': stat[15],
        'wait': stat[16]
    }
    return memory_


def error_parser(errorLog: str):
    log_pars = []
    for line in errorLog.splitlines()[-20:]:  # Avec cette ligne on décide de ne récupérer que les 20 dernières lignes de logs.
        # Les deux champs de logs d'erreurs qu'on récupèrent ressemblent à ça : [Fri Dec 17 00:00:37.445049 2021] [pid 512:tid 140058767688832]
        # On ne peux donc pas utiliser des espaces comme séparateurs. On a donc choisie le groupe de charactère "] [" qui est unique.
        error = line.split('] [')
        log_pars.append({
            "date": error[0][1:],  # Ici on fait bien attention de ne pas récupérer le premier charactère pour la date, pour ne pas avoir de "[" au début
            "pid": error[1][0:-1]  # De même, on ne récupère pas le dernier charactère.
        })
    return (log_pars)


def access_parser(accessLog: str):
    log_pars = []
    for line in accessLog.splitlines()[-20:]:  # Pareil que pour les logs d'erreurs, on ne récupère que les dernières.
        access = line.split(' ')
        log_pars.append({
            "ip": access[0],
            "path": access[1]
        })
    return(log_pars)


def DEBUG_clean_machinesJson():
    # Cette fonction a été utiliser pendant le débugagepour réinitialiser le fichier machines.json
    with open('static/assets/machines.json', 'w') as json_file:
        json.dump({}, json_file)


def update_json():
    with open('static/assets/config.json', 'r') as config_file:
        config_data = json.load(config_file)
    with open('static/assets/machines.json', 'r') as json_file:
        json_data: dict = json.load(json_file)
        for machine in config_data["Machines"]:
            client = init_connexion(machine['hostname'], machine['port'], machine['username'], machine['password'])
            hostname = machine['hostname']
            if client == "Connexion failed":
                data = {
                    'status': "No connexion"
                }
                # Chaque machines est identifier dans le fichier machines.json par son hostname, qui nous est donner dans le fichier de configuration.
                json_data.update({hostname: data})
            else:
                machine_name = get_machine_name(client)
                error = error_parser(get_error_log(client, machine["log_path"]))
                access_log = access_parser(get_access_log(client, machine["log_path"]))
                processes = get_processes(client)
                current_processes = get_current_processes(client)
                memory = memory_stat(get_vmstat(client), get_memory(client))
                data = {
                    'status': "Connected",
                    'machine_name': machine_name,
                    'memory': memory,
                    'error': error,
                    'access_log': access_log,
                    'processes': processes,
                    'current_processes': current_processes
                }
                json_data.update({hostname: data})
    with open('static/assets/machines.json', 'w') as json_file:
        json.dump(json_data, json_file)
