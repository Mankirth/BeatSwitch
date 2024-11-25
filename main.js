function songElement(sngTitle, sngArtist, desc, album, mp3, name){
    this.title = sngTitle;
    this.artist = sngArtist;
    this.description = desc;
    this.coverImg = album;
    this.audio = mp3;
    this.username = name;
}

function addElement() {
    let songs = [
        new songElement("IPad Kid", "Vincent Augustus", "I don't wanna listen I'm an ipad kid", "https://i.scdn.co/image/ab67616d0000b2733f9f380ac07ba89619ce81fb", "iPad kid (feat. Billy Marchiafava).mp3", "Mankuu"),
        new songElement("Articuno", "Ben Beal", "The new white macklemore", "https://i.scdn.co/image/ab67616d0000b2739a2675ba4296577a18ae414b", "Ben Beal - Articuno.mp3", "KrishTheFish")
    ];
    for (i = 0; i < songs.length; i++) {
        listSong(songs[i])
    }
}

function listSong(song){
    const container = document.createElement("div");
    container.className = "container";
    const newDiv = document.createElement("div");
    const pic = document.createElement("span");
    const text = document.createElement("span");
    let title = document.createElement("h4");
    title.innerHTML = song.title + " - " + song.artist;
    let user = document.createElement("small");
    user.innerHTML = " | Posted By: " + song.username;
    title.appendChild(user);
    let cover = document.createElement("img");
    cover.src = song.coverImg;
    let desc = document.createElement("p");
    desc.innerHTML = song.description;
    let aud = document.createElement("audio");
    aud.controls = true;
    aud.src = song.audio;
    newDiv.className = "row";
    pic.className = "col-4";
    text.className = "col-8";
  
    // add the text node to the newly created div
    newDiv.appendChild(pic);
    newDiv.appendChild(text);
    newDiv.appendChild(document.createElement("br"));
    newDiv.appendChild(aud);
    pic.appendChild(cover);
    text.appendChild(title);
    text.appendChild(document.createElement("hr"));
    text.appendChild(desc);
  
    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById("feed");
    document.body.insertBefore(newDiv, currentDiv);
}

function msgElement(msgTitle, username, msg, sng){
    this.title = msgTitle;
    this.sender = username;
    this.message = msg;
    this.audio = sng;
}

function loadDms() {
    let messages = [
        new msgElement("I hate you", "Vincent Augustus", "I don't wanna listen I'm an ipad kid", "iPad kid (feat. Billy Marchiafava).mp3"),
        new msgElement("Articuno", "Ben Beal", "The new white macklemore", null)
    ];
    for (i = 0; i < messages.length; i++) {
        listMessage(messages[i])
    }
}

function listMessage(message){
    const container = document.createElement("div");
    container.className = "container";
    const newDiv = document.createElement("div");
    const text = document.createElement("span");
    let title = document.createElement("h4");
    title.innerHTML = message.title;
    let user = document.createElement("small");
    user.innerHTML = " Sent By: " + message.sender;
    title.appendChild(user);
    let body = document.createElement("p");
    body.innerHTML = message.message;
    newDiv.className = "row";
    text.className = "col-12";
  
    // add the text node to the newly created div

    newDiv.appendChild(text);
    newDiv.appendChild(document.createElement("br"));

    if(message.audio != null){
        let aud = document.createElement("audio");
        aud.controls = true;
        aud.src = message.audio;
        newDiv.appendChild(aud);
    }

    text.appendChild(title);
    text.appendChild(document.createElement("hr"));
    text.appendChild(body);
  
    // add the newly created element and its content into the DOM
    const currentDiv = document.getElementById("feed");
    document.body.insertBefore(newDiv, currentDiv);
}