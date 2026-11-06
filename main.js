const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const TMDB_TOKEN = require("./config.js");

function createWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 700,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    window.loadFile(path.join(__dirname, "index.html"));
}

ipcMain.handle("search-movies", async function(event, movieName) {

    try {
        const url = "https://api.themoviedb.org/3/search/movie?query="
            + encodeURIComponent(movieName);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + TMDB_TOKEN,
                accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("TMDB API request failed: " + response.status);
        }

        const data = await response.json();

        return {
            success: true,
            movies: data.results
        };

    } catch (error) {

        return {
            success: false,
            message: error.message
        };
    }
});

app.whenReady().then(() => {
    createWindow();
});