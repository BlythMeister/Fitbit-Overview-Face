import { inbox, outbox } from 'file-transfer';
import { encode } from 'cbor';

const MESSAGE_FILE_NAME = 'overview-message';

let debugMessages = false;

// event handler for messages
const onMessageHandlers = [];

// when incoming data arrives - calls all "onmessage" handlers and passes the data
function onMessage(payload) {    
    if (debugMessages) {
        console.log(`FM::OnMessage: ${JSON.stringify(payload)}`);
    }
    for (let handler of onMessageHandlers) {
        handler(payload)
    }
}

export const messaging = {
    // *** Setters for manual event handler assignments
    set onmessage(handler) {
        onMessageHandlers.push(handler);
    },
    // ***

    addEventListener: function (event, handler) {
        if (event == "message") {
            onMessageHandlers.push(handler);
        } else {
            throw `Unknown event ${event}`;
        }
    },

    // sends data externally from device to phone or from phone to device via file transfer
    send: function (uuid, data) {
        let name = `${MESSAGE_FILE_NAME}.${uuid}.cbor`;
        if (debugMessages) {
            console.log(`FM::Send '${name}' : ${JSON.stringify(data)}`);
        }
        outbox.enqueue(name, encode(data));
    }
}

const otherFiles = [];
const myFiles = [];

if (inbox.pop) { // this is a companion
    inbox.prevPop = inbox.pop;

    const init = () => {
        inbox.addEventListener("newfile", processCompanionFiles);
        processCompanionFiles();
    }

    const processCompanionFiles = async (evt) => {

        let file = await getNextMyFile();
        if (file === undefined) return;

        const payload = {};
        payload.data = await file.cbor();

        onMessage(payload)
    }

    inbox.pop = async () => {
        if (otherFiles.length > 0) {
            return otherFiles.pop();
        }
        let file;
        while (file = await inbox.prevPop()) {
            let fileName = file.name.substring(0, file.name.indexOf("."));
            if (debugMessages) {
                console.log(`FM::Pop file '${file.name}' search: ${fileName}`);
            }
            if (fileName === MESSAGE_FILE_NAME) {
                myFiles.push(file)
            }
            else {
                return file;
            }
        }
        return undefined;
    }

    const getNextMyFile = async () => {
        if (myFiles.length > 0) {
            return myFiles.pop()
        }
        let file;
        while (file = await inbox.prevPop()) {
            let fileName = file.name.substring(0, file.name.indexOf("."));
            if (debugMessages) {
                console.log(`FM::getNextMyFile '${file.name}' search: ${fileName}`);
            }
            if (fileName === MESSAGE_FILE_NAME) {
                return file;
            }
            otherFiles.push(file);
        }
        return undefined;
    }

    init();

} else { // this is a device
    const { readFileSync } = require("fs");
    inbox.prevNextFile = inbox.nextFile;

    const init = () => {
        inbox.addEventListener("newfile", processDeviceFiles);
        processDeviceFiles();
    }

    const processDeviceFiles = (evt) => {

        let fileName = getNextMyFile();
        if (fileName === undefined) return;

        const payload = {};
        payload.data = readFileSync(fileName, "cbor");

        onMessage(payload)
    }

    inbox.nextFile = () => {
        if (otherFiles.length > 0) {
            return otherFiles.pop();
        }
        let file;
        while (file = inbox.prevNextFile()) {
            let fileName = file.substring(0, file.indexOf("."));
            if (debugMessages) {
                console.log(`FM::inbox.next '${file}' search: ${fileName}`);
            }        
            if (fileName === MESSAGE_FILE_NAME) {
                myFiles.push(file)
            }
            else {
                return file;
            }
        }
        return undefined;
    }

    const getNextMyFile = () => {
        if (myFiles.length > 0) {
            return myFiles.pop()
        }
        let file;
        while (file = inbox.prevNextFile()) {
            let fileName = file.substring(0, file.indexOf("."));
            if (debugMessages) {
                console.log(`FM::getNextMyFile '${file}' search: ${fileName}`);
            }        
            if (fileName === MESSAGE_FILE_NAME) {
                return file;
            }
            otherFiles.push(file);
        }
        return undefined;
    }

    init()

}