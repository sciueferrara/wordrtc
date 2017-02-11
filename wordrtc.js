var path2wordrtc = "path/to/wordrtc"; // Without slash at the end, for example www.path2wordrtc.com or www.path2wordrtc.com/app
var peerJSkey = "YOUR_API_KEY"; // You can obtain it signing up at www.peerjs.com
var grabzItkey = "YOUR_API_KEY"; // You can obtain it signing up at www.grabz.it


var editor = new MediumEditor('.editable', {
	placeholder: false,
	anchor: {
		placeholderText: 'Inserite il link qui'
	},
	toolbar: {
		buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'pre', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'unorderedlist', 'orderedlist']
	},
	imageDragging: true,
	autolink: true,
	paste: {
		cleanPastedHTML: true,
		forcePlainText: false
	}
});

editor.subscribe('editableInput', function (event, editable) {
	if (dataChannel) {
		dataChannel.send(editable.innerHTML);
		console.log("Invio contenuto del documento...");
	}
});

var dataChannel=null;
var myPeer=null;

function setDocument(text) {	//setta il contenuto del documento a text
	var doc = document.getElementById('documento');
	doc.innerHTML=text;
}

function getParameter(sVar) {	//ottiene parametri dagli url
	return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"));
}

function init() {
	var id=getParameter('doc');	//ricava il parametro doc dall'url
	if (id) {	//controllo della presenza del parametro
		//ci staimo connettendo ad una stanza probabilmente preesistente
		second_peer(id);
		console.log("L'utente vuole connettersi al documento " + id);
	} else {
		//dobbiamo creare la stanza
		first_peer();
		console.log("L'utente crea un nuovo documento");
	}
}

function first_peer() {	//gestisce la connessione di chi crea il documento (per WebRTC è il chiamato)
	var peer = new Peer({key: peerJSkey}, {config: {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}});
	myPeer=peer;
	peer.on('open', function(){
		document.getElementById('link').innerHTML=path2wordrtc+"/?doc="+peer.id;
	});
	peer.on('connection', function(conn) {
		console.log("Il documento è stato creato (connessione aperta lato chiamante)");
		dataChannel=conn;
		document.getElementById('callButton').style.visibility = 'visible';
		conn.on('data', function(data){
			console.log("Dati ricevuti dall'altro peer, setting del documento")
			setDocument(data);
		});
	});
	peer.on('call', function(call) {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia({video: false,  audio: {  "optional": [   {"googEchoCancellation": "true"}, {"googAutoGainControl":"true"}, {"googNoiseSuppression":"true"}, {"googHighpassFilter":"true"}  ] }}, function(stream) {
			call.answer(stream); // Answer the call with an A/V stream.
			call.on('stream', function(remoteStream) {
				var audioStream = document.createElement('audio');
				audioStream.src = (URL || webkitURL || mozURL).createObjectURL(remoteStream);
				audioStream.play();
			});
		}, function(err) {
			console.log('Failed to get local stream' ,err);
		});
	});
}

function second_peer(id){	//gestisce la connessione di chi si collega al documento (per WebRTC è il chiamante)
	var peer = new Peer({key: peerJSkey}, {config: {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}});
	myPeer=peer;
	dataChannel=peer.connect(id);
	dataChannel.on('open', function(){
		console.log("Connessione al documento effettuata con successo (connessione aperta lato chiamato)");
		document.getElementById('callButton').style.visibility = 'visible';
		dataChannel.on('data', function(data){
			console.log("Dati ricevuti dall'altro peer, setting del documento");
			setDocument(data);
		});
	});
	peer.on('call', function(call) {
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		navigator.getUserMedia({video: false, audio: {  "optional": [   {"googEchoCancellation": "true"}, {"googAutoGainControl":"true"}, {"googNoiseSuppression":"true"}, {"googHighpassFilter":"true"}  ] }}, function(stream) {
			call.answer(stream); // Answer the call with an A/V stream.
			call.on('stream', function(remoteStream) {
				var audioStream = document.createElement('audio');
				audioStream.src = (URL || webkitURL || mozURL).createObjectURL(remoteStream);
				audioStream.play();
			});
		}, function(err) {
			console.log('Failed to get local stream', err);
		});
	});
}

function doAudioCall(){
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({video: false, audio: {  "optional": [   {"googEchoCancellation": "true"}, {"googAutoGainControl":"true"}, {"googNoiseSuppression":"true"}, {"googHighpassFilter":"true"}  ] }},function(stream) {
		var call = myPeer.call(dataChannel.peer, stream);
		call.on('stream', function(remoteStream) {
			var audioStream = document.createElement('audio');
			audioStream.src = (URL || webkitURL || mozURL).createObjectURL(remoteStream);
			audioStream.play();
		});
	}, function(err) {
		console.log('Failed to get local stream', err);
	});
}

function createPDF() {
	GrabzIt(grabzItkey).ConvertHTML(document.getElementById('documento').innerHTML, {"format": "pdf", "download": 1, "mtop":60, "mleft":63, "mbottom":60, "mright":63, "filename":"WordRTC_doc.pdf"}).Create();
}

init();
