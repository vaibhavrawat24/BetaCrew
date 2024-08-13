# BetaCrew Mock Exchange Client

## Overview

This repository contains a Node.js client application designed to interact with the BetaCrew Mock Exchange Server. The client application requests and receives stock ticker data from the server processes it, and generates a JSON file as output. The JSON file includes an array of objects, each representing a packet of data with sequential packet sequences, ensuring no sequences are missing in the final output.

## Features

- **TCP Connection**: Connects to the BetaCrew Mock Exchange Server using the TCP protocol.
- **Stream and Request Data**: Sends payloads to request stock ticker data and handles missing sequences.
- **JSON Output**: Outputs the received packets into a JSON file, ensuring the sequence order is complete.

## Prerequisites

- **Node.js** version 16.17.0 or higher

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BetaCrew-Mock-Exchange-Client.git
cd BetaCrew-Mock-Exchange-Client
```

### 2. Install Dependencies

Before running the application, install the necessary dependencies using npm:

```
npm install
```

### 3. Configure the Server Connection

Ensure that the server address and port are correctly set in the configuration section of the client code.

### 4. Run the Application

Start the client application by running the following command:

```
node index.js
```
The client will connect to the BetaCrew Mock Exchange Server, request stock ticker data, and output the received data to a JSON file.

### 5. Review the Output
The JSON file containing the received packets will be generated in the project directory. You can open this file to inspect the ordered packet data.

### Sample test project:-

1. Run node main.js
2. Run node client.js
3. Output:-

   <img width="295" alt="betacrew" src="https://github.com/user-attachments/assets/762f3518-5b1f-471a-baba-2219cf06696f">

4. It also generated output.json file for the same


