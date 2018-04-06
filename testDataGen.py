import random as r
import time as t
import os

roundNum = 6

delim = "|"
logFile = "data.txt"

boundsLatPos = 90.0
boundsLatNeg = -90.0
boundsLonPos = 180.0
boundsLonNeg = -180.0

threats = ["Telnet","FTP","SSH","Remote Code Execution","HTTP"]

def testFileExistence():
    if not os.path.isfile(logFile):
        touch = open(logFile,"a")

def checkSize():
    if os.path.getsize(logFile) > 1000 * 1024:
        newFile = open(logFile,"w")


testFileExistence()
while True:
    secondsToSleep = round(r.uniform(0.1,0.5),1)
    randLat = round(r.uniform(boundsLatNeg,boundsLatPos),roundNum)
    randLon = round(r.uniform(boundsLonNeg,boundsLonPos),roundNum)
    randThreat = r.choice(threats)
    logLine = randThreat+delim+str(randLat)+","+str(randLon)+"\n"
    print("Writing Log: "+logLine)
    with open(logFile,"a") as f:
        f.write(logLine)
        print("Log Written")
        f.close()
    checkSize()
    t.sleep(secondsToSleep)

        