import socket
import time

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(('0.0.0.0', 8080))
    server_socket.listen(1)
    print('Server is listening on port 8080')

    # Simulate an application failure after 30 seconds
    time.sleep(30)
    server_socket.close()
    print('Server stopped listening on port 8080')

    # Prevent the script from exiting
    while True:
        time.sleep(1)

if __name__ == '__main__':
    start_server()
