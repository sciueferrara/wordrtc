# WordRTC

**WordRTC** is a WebRTC-based application. It represents a **real-time collaborative word processor** for two users.

## Getting Started

To get up and running this application, simply you can download the package in your local machine. It is necessary to set some parameters that you can find in the first three lines of wordRTC.js with some examples.

### Prerequisites

You need to register at www.peerjs.com and www.grabz.it. You need to use this application with a WebRTC-supporting browser. Remember that Google Chrome can use the getUserMedia method only with secure origins.

## How the connection works

We used the **PeerJS** library to obtain the connection establishment. PeerJS, using a signaling server, gives an unique ID to the peers when an user create a Peer object with

```
var peer = new Peer({host:'host', port:'port', path:'path'});
```
if you have a PeerJS server installed. But PeerJS allows to write

```
var peer = new Peer({key: 'YOUR_API_KEY'});
```
using the key obtained at www.peerjs.com.

## What the application can do

The UI is in Italian. You can write a document with a friend simply sending him the link appearing at the top. The editing will be real-time and collaborative. You can also start an audio call with your friend to obtain a better experience. Remember that the application cannot store your document, but you can save it as PDF.

## Other infos

You can read more at http://bit.ly/wordrtc-doc (in Italian).

## Authors

The authors are **Flavio Fanigliulo** and **Antonio Ferrara** from **Politecnico di Bari**. The application was built under the supervision of **Luca De Cicco** and **Saverio Mascolo**.
