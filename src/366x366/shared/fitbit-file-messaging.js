import { inbox, outbox } from 'file-transfer';
import { encode } from 'cbor';

const MESSAGE_FILE_NAME = 'messaging4d9b79c40abe.cbor';

let fileUid = -1;
const MAX_FILE_UIDS = 9;

// event handler for messages
const eventHandlers = {
    message: [],
    open: [],
    close: [],
    error: []
}

// when incoming data arrives - calls all "onmessage" handlers and passes the data
function onMessage(payload) {
    for (let handler of eventHandlers.message) {
        handler(payload)
    }
}

// on app start calls all "onopen" handlers
function onOpen() {
    for (let handler of eventHandlers.open) {
        handler()
    }
}

export const messaging = {

    // *** Setters for manual event handler assignments
    set onmessage(handler) {
        eventHandlers.message.push(handler);
    },

    set onopen(handler) {
        eventHandlers.open.push(handler);
    },

    set onclose(handler) {
        eventHandlers.close.push(handler);
    },

    set onerror(handler) {
        eventHandlers.error.push(handler);
    },
    // ***

    addEventListener: function (event, handler) {
        eventHandlers[event].push(handler)
    },

    // simulation of `messaging.peerSocket.send` - sends data externally
    // from device to phone or from phone to device via file transfer
    send: function (data) {
        fileUid++; if (fileUid > MAX_FILE_UIDS) fileUid = 0;
        outbox.enqueue(`${fileUid}${MESSAGE_FILE_NAME}`, encode(data))
            .catch(err => {
                for (let handler of eventHandlers.error) {
                    handler(`Error queueing transfer: ${err}`)
                }
            });
    },

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
            if (file.name.substring(1) === MESSAGE_FILE_NAME) {
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
            if (file.name.substring(1) === MESSAGE_FILE_NAME) {
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
        let fileName;
        while (fileName = inbox.prevNextFile()) {
            if (fileName.substring(1) === MESSAGE_FILE_NAME) {
                myFiles.push(fileName)
            }
            else {
                return fileName;
            }
        }
        return undefined;
    }

    const getNextMyFile = () => {
        if (myFiles.length > 0) {
            return myFiles.pop()
        }
        let fileName;
        while (fileName = inbox.prevNextFile()) {
            if (fileName.substring(1) === MESSAGE_FILE_NAME) {
                return fileName;
            }
            otherFiles.push(fileName);
        }
        return undefined;
    }

    init()

}

setTimeout(() => { onOpen(); }, 1)