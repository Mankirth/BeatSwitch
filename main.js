const BASE_URL = "http://localhost:3000"; // Backend base URL
let currentUser;

async function login(){//get all users and see if given login matches
    let usernam = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    try {
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();
        let userFound = false;

        users.forEach(user => {
            //check if the given username and pass match any of the stored users (caps sensitive)
            if(user.password == pass && user.username == usernam){
                localStorage.setItem("Current User", user.username);
                userFound = true;
                window.location.href = "home.html"; //only go to home page if found
            }
        });
        if(!userFound)
            alert("User Not Found. Register or try again.");
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function addUser(){
    //get input
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let passCheck = document.getElementById("checkPass").value;

    //invalid input check
    arr = [email, username, password, passCheck];
    if(arr.includes("") || password != passCheck){
        alert("Please fill all fields and make sure passwords match");
        return;
    }

    //add to database
    arr = {email, username, password}
    try {
        console.log(JSON.stringify(arr));
        const response = await fetch(`${BASE_URL}/adduser`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arr),
        });
        if(response.ok) //only go to next page if it acutally worked
            window.location.href = "login.html";
        else{
            alert("Error, user may already exist.");
            console.log("response not ok");
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

async function fetchAndDisplayData() { //list songs
    try {
        const response = await fetch(`${BASE_URL}/songs`);
        const songs = await response.json();

        songs.forEach(song => {
            //create a song row element for each song found using the database info
            const container = document.createElement("div");
            container.className = "container";
            container.dataset.id = song.id;
            const newDiv = document.createElement("div");
            const pic = document.createElement("span");
            const text = document.createElement("span");
            let title = document.createElement("h4");
            title.innerHTML = song.title + " - " + song.artist;
            let user = document.createElement("small");
            user.innerHTML = " | Posted By: " + song.user;
            title.appendChild(user);
            let cover = document.createElement("img");
            cover.src = song.image;
            let desc = document.createElement("p");
            desc.innerHTML = song.description;
            let aud = document.createElement("audio");
            aud.controls = true;
            aud.src = song.audio;
            newDiv.className = "row";
            pic.className = "col-2";
            text.className = "col-10";
        
            newDiv.appendChild(pic);
            newDiv.appendChild(text);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(aud);
            pic.appendChild(cover);
            if(song.link != null){ //only add link if it was given
                let link = document.createElement("a");
                link.href = song.link;
                link.target = "_blank";
                link.appendChild(title);
                text.appendChild(link);
            }
            else{
                text.appendChild(title);
            }
            text.appendChild(document.createElement("hr"));
            text.appendChild(desc);

            //add to the feed in order of newest first
            const currentDiv = document.getElementById("feed");
            currentDiv.innerText = ""; //get rid of empty feed message
            document.body.insertBefore(newDiv, currentDiv.nextSibling);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function newPost(){ //save a song
    //readers to store actual files in the database rather than file locations
    const imgReader = new FileReader();
    const picReader = new FileReader();
    let titl = document.getElementById("song title").value;
    let arti = document.getElementById("artist").value;
    let bod = document.getElementById("desc").value;
    let imag;
    let user = localStorage.getItem("Current User");
    let link = document.getElementById("link").value;

    //convert image and music to base64 then submit to database
    imgReader.readAsDataURL(document.querySelector("input[type=file]").files[0]);
    imgReader.addEventListener('load', () => { imag = imgReader.result; });

    picReader.readAsDataURL(document.querySelectorAll("input[type=file]")[1].files[0]);
    picReader.addEventListener('load', () => {
        let aud = picReader.result;
        if([titl, bod, user, imag, aud, arti].includes("")) {
            alert("Please fill all fields");
            return;
        }
        else{
            if(link != "")
                addSong({titl, bod, user, imag, aud, arti, link});
            else//only submit link if one was given
                addSong({titl, bod, user, imag, aud, arti})
        }
    });
}

async function addSong(arr){ 
    try {
        console.log(JSON.stringify(arr));
        const response = await fetch(`${BASE_URL}/add`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arr),
        });
        if(response.ok) //only go to next page if song was actually added
            window.location.href = "home.html";
        else{ //files that are too large can't be stored in the database in base64
            alert("Upload failed, please use smaller files.");
            console.log("response not ok");
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

async function newMsg(){ //save message, same as save song but without image
    const reader = new FileReader();
    let topic = document.getElementById("topic").value;
    let body = document.getElementById("desc").value;
    let reciever = document.getElementById("reciever").value
    let aud;
    let sender = localStorage.getItem("Current User");

    if(document.querySelector("input[type=file]").files[0] != null){
        reader.readAsDataURL(document.querySelector("input[type=file]").files[0]);
        reader.addEventListener('load', () => {
            let aud = reader.result;
            let arr = [sender, topic, body, aud];
            console.log(arr);
            if(arr.includes("")) {
                alert("Please fill all fields");
                return;
            }
            else{
                addMessage({sender, topic, body, reciever, aud});
            }
        });
    }
    else{
        addMessage({sender, topic, body, reciever});
    }
}

async function addMessage(arr){
    try {
        console.log(JSON.stringify(arr));
        const response = await fetch(`${BASE_URL}/addmsg`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arr),
        });
        if(response.ok)
            window.location.href = "dms.html";
        else
            console.log("response not ok");
    } catch (error) {
        console.log('Error:', error);
    }
}

async function loadDms() { //list messages for the user currently logged in
    try {
        const response = await fetch(`${BASE_URL}/messages`);
        const messages = await response.json();
        console.log("loading dms");

        messages.forEach(message => {
            //only list the messages for the current user in local storage
            if(message.reciever == localStorage.getItem("Current User")){
                //create the message row element
                const container = document.createElement("div");
                container.className = "container";
                const newDiv = document.createElement("div");
                const text = document.createElement("span");
                let title = document.createElement("h4");
                title.innerHTML = message.topic;
                let user = document.createElement("small");
                user.innerHTML = " | Sent By: " + message.sender;
                title.appendChild(user);
                let body = document.createElement("p");
                body.innerHTML = message.body;
                newDiv.className = "row";
                text.className = "col-12";

                newDiv.appendChild(text);
                newDiv.appendChild(document.createElement("br"));

                if(message.audio != null){ //only add the audio to the end if it was given
                    let aud = document.createElement("audio");
                    aud.controls = true;
                    aud.src = message.audio;
                    newDiv.appendChild(aud);
                }
                text.appendChild(title);
                text.appendChild(document.createElement("hr"));
                text.appendChild(body);

                const currentDiv = document.getElementById("feed");
                currentDiv.innerText = ""; //get rid of no posts found message
                document.body.insertBefore(newDiv, currentDiv.nextSibling);
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
//npx kill-port 3000