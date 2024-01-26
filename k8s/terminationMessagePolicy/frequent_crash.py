import sys
import random
import time
import os

termination_message_file = os.getenv('TERMINATION_MESSAGE_FILE', '/dev/termination-log')

def write_termination_message(message):
    with open(termination_message_file, 'w') as file:
        file.write(message)

def process_data(data):
    print(data)
    # Simulate data processing, which might fail
    if data < 0.1:  # 10% chance of failure
        raise ValueError("Data processing error")

def main():
    print("Starting the application...")
    try:
        while True:
            # Simulate data processing
            random_value = random.random()
            process_data(random_value)
            time.sleep(1)

    except Exception as e:
        write_termination_message(f"Application error: {e}")
        print("An error occurred, exiting...")
        sys.exit(1)

if __name__ == "__main__":
    main()
