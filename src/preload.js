
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('Bridge', {
    GET: async (opts) => {
        console.log("GET:", opts);
        const data = await ipcRenderer.invoke('getInfo', opts);
        return data;
    },
    POST: async (opts) =>{
        console.log("POST:", opts)
        await ipcRenderer.invoke('postInfo', opts)
    }
})