const BASE_URL = "http://localhost:3000"; // Backend base URL
let currentUser;

async function login(){
    let usernam = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    try {
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();

        users.forEach(user => {
            if(user.password == pass && user.username == usernam){
                localStorage.setItem("Current User", user.username);
                window.location.href = "home.html";
                return;
            }
        });

        alert("User Not Found. Register or try again.");
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function addUser(){
    let email = document.getElementById("email").value;
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let passCheck = document.getElementById("checkPass").value;
    arr = [email, username, password, passCheck];
    if(arr.includes("") || password != passCheck){
        alert("Please fill all fields and make sure passwords match");
        return;
    }
    arr = {email, username, password}
    try {
        console.log(JSON.stringify(arr));
        const response = await fetch(`${BASE_URL}/adduser`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(arr),
        });
        if(response.ok)
            window.location.href = "login.html";
        else{
            alert("Error, user may already exist.");
            console.log("response not ok");
        }
    } catch (error) {
        console.log('Error:', error);
    }
}

async function fetchAndDisplayData() {
    try {
        const response = await fetch(`${BASE_URL}/songs`);
        const songs = await response.json();

        songs.forEach(song => {
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
            pic.className = "col-4";
            text.className = "col-8";
        
            // add the text node to the newly created div
            newDiv.appendChild(pic);
            newDiv.appendChild(text);
            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(aud);
            pic.appendChild(cover);
            if(song.link != null){
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

            const currentDiv = document.getElementById("feed");
            document.body.insertBefore(newDiv, currentDiv.nextSibling);


            // const newRow = table.insertRow();
            // newRow.dataset.id = emp.id; // Attach the ID for editing/updating
            // newRow.insertCell(0).innerText = emp.name;
            // newRow.insertCell(1).innerText = emp.job;
            // newRow.insertCell(2).innerText = emp.experience;
            // newRow.insertCell(3).innerText = emp.salary;
            // newRow.insertCell(4).innerHTML = `
            //     <button onclick="editRow(this, ${emp.id})">Edit</button>
            //     <button onclick="deleteRow(${emp.id})">Delete</button>
            // `;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function newPost(){
    const imgReader = new FileReader();
    const picReader = new FileReader();
    let titl = document.getElementById("song title").value;
    let arti = document.getElementById("artist").value;
    let bod = document.getElementById("desc").value;
    let imag = "https://i.scdn.co/image/ab67616d0000b2733f9f380ac07ba89619ce81fb";
    let user = localStorage.getItem("Current User");
    let link = document.getElementById("link").value;
    // let arr = {titl, bod, user, imag, aud, arti};
    //console.log(JSON.stringify(arr));
    // try {
    //     const response = await fetch(`${BASE_URL}/add`,{
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(arr),
    //     });
    //     //if(response.ok)
    //         //window.location.href = "home.html";
    // } catch (error) {
    //     console.log('Error:', error);
    // }
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
            else
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
        if(response.ok)
            window.location.href = "home.html";
        else
            console.log("response not ok");
    } catch (error) {
        console.log('Error:', error);
    }
}

function msgElement(msgTitle, username, msg, sng){
    this.title = msgTitle;
    this.sender = username;
    this.message = msg;
    this.audio = sng;
}

async function newMsg(){
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

async function loadDms() {
    try {
        const response = await fetch(`${BASE_URL}/messages`);
        const messages = await response.json();
        console.log("loading dms");

        messages.forEach(message => {
            if(message.reciever == localStorage.getItem("Current User")){
                const container = document.createElement("div");
                container.className = "container";
                const newDiv = document.createElement("div");
                const text = document.createElement("span");
                let title = document.createElement("h4");
                title.innerHTML = message.topic;
                let user = document.createElement("small");
                user.innerHTML = " Sent By: " + message.sender;
                title.appendChild(user);
                let body = document.createElement("p");
                body.innerHTML = message.body;
                newDiv.className = "row";
                text.className = "col-12";

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

                const CurrentDiv = document.getElementById("feed");
                document.body.insertBefore(newDiv, CurrentDiv.nextSibling);
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    // for (i = 0; i < messages.length; i++) {
    //     listMessage(messages[i])
    // }
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