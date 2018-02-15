// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html";

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

import socket from "./socket";
import run_memory from "./memory";

function form_init() {
    let channel = socket.channel("games:demo", {});
    channel.join()
           .receive("ok", resp => { console.log("APP FORM_INIT: Joined successfully", resp) })
           .receive("error", resp => { console.log("APP FORM_INIT: Unable to join", resp) });
    $('#game-button').click(() => {
        window.gameName = document.getElementById('game-input').value;
        location.href = "/game/" + gameName
    });
}


function init() {
  let root = document.getElementById('game-page');
    if (root) {
        run_memory(root, window.gameName);
    }
    if (document.getElementById('index')) {
        form_init();
    }
}

// Use jQuery to delay until page loaded.
$(init);

