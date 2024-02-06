import unittest
from InterfaceAdmin import access_parser
from InterfaceAdmin import error_parser
from InterfaceAdmin import memory_stat


class TestStringMethods(unittest.TestCase):

    def test_memory_stat(self):
        # memory_stat() parse les informatations récupérées par getMemory() et getVmstat() contenues dans des strings
        # memory.txt et stat.txt sont des exemples de ce que getMemory() et getVmstat() pourraient renvoyer
        memoryReader = open("./Tests/memory.txt")
        memoryRead = memoryReader.read()
        memoryReader.close()
        statsReader = open("./Tests/stats.txt")
        stats = statsReader.read()
        statsReader.close
        memory = memory_stat(stats, memoryRead)
        self.assertEqual("2045616", memory['totalMem'])
        self.assertEqual("888056", memory['usedMem'])
        self.assertEqual("947208", memory['freeMem'])
        self.assertEqual("24324", memory['sharedMem'])
        self.assertEqual("210352", memory['buffCacheMem'])
        self.assertEqual("978848", memory['availableMem'])
        self.assertEqual("0", memory["swapIn"])
        self.assertEqual("0", memory["swapOut"])
        self.assertEqual("0", memory["blockIn"])
        self.assertEqual("1", memory["blockOut"])
        self.assertEqual("9", memory["userTime"])
        self.assertEqual("7", memory["sysTime"])
        self.assertEqual("83", memory["idle"])
        self.assertEqual("1", memory["wait"])

    def test_access_parser(self):
        # on passe raw à access_parser pour vérifier que la fonction est bien capable de parser une ligne et retourner l'IP et le path séparément
        raw = '127.1.1.1 /'
        s = {
            'ip': "127.1.1.1",
            'path': "/"
        }
        self.assertEqual(s['ip'], access_parser(raw)[0]['ip'])
        self.assertEqual(s['path'], access_parser(raw)[0]['path'])
        # on passe ensuite à la fonction le contenu d'un fichier d'accessLog de test
        # pour vérifier qu'elle ne traite bien que les 20 dernières lignes de l'access log
        f = open("./Tests/AccesLogExemple.txt", "r")
        lines = f.read()
        f.close()
        nmbr_of_lines = len(access_parser(lines))
        self.assertEqual(20, nmbr_of_lines)

    def test_error_parser(self):
        # on ouvre un fichier d'error logs de test et on lance la fonction error_parser() en passant son contenu en paramètre
        # pour vérifier que la fonction error_parser() renvoie bien la date de l'errur et le PID du processus ayant généré l'erreur
        f = open("./Tests/ErrorLogExemple.txt", "r")
        lines = f.read()
        f.close()

        self.assertEqual('Fri Dec 17 00:00:37.445049 2021',
                         error_parser(lines)[0]['date'])
        self.assertEqual('pid 512:tid 140058767688832',
                         error_parser(lines)[0]['pid'])
        self.assertEqual('Fri Dec 17 00:00:37.445062 2021',
                         error_parser(lines)[1]['date'])
        self.assertEqual('pid 512:tid 140058767688832',
                         error_parser(lines)[1]['pid'])


if __name__ == '__main__':
    unittest.main()
