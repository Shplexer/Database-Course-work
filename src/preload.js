
const { contextBridge, ipcRenderer } = require('electron');
//ИСПОЛЬЗОВАТЬ THEN!!!!!!!!!!!!!!!!!!!!!!!
contextBridge.exposeInMainWorld('Bridge', {
    doSomething: async (opts) => {
        console.log(opts);
        const data = await ipcRenderer.invoke('getInfo', opts);
        return data;
    }
})