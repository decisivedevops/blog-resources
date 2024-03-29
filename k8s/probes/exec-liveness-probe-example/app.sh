#!/usr/local/bin/bash

# Simulate application startup
echo "Application is starting..."
sleep 5
echo "I am healthy" | tee -a /tmp/healthz >/dev/null

# Simulate application running
i=0
while [ "$i" -lt 60 ]; do
    echo "Application is running. - $i"
    sleep 2
    if [ $i == 10 ]; then rm /tmp/healthz; fi;
    ls /tmp
    ((i++))
done
