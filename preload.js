const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("movieAPI", {
    searchMovies: (movieName) => ipcRenderer.invoke("search-movies", movieName)
});