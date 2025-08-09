let currsong = new Audio();
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}
const playMusic = (track) => {
    currsong.src = "/songs/" + track + ".mp3"
    currsong.play()
    let play=document.getElementById("play");
    play.src="pause.svg"

}
async function main() {
    let songs = await getSongs();
    console.log(songs);
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img src="music.svg" alt="">
                            <div class="info">
                                <div class="songname"> 
                                    ${song.replaceAll("%20", " ").replace(".mp3", "").split("-")[0]}
                                </div>
                                <div class="songart">
                                    ${song.replaceAll("%20", " ").replace(".mp3", "").split("-")[1].replaceAll("%24", "$").replaceAll("%2", ",").replaceAll(",C", ",")}
                                </div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="" height="35px" width="35px">

                            </div></li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let songaddr = (e.querySelector(".info").firstElementChild.innerHTML.trim()) + "-" + e.querySelector(".info").children[1].innerHTML.trim();
            playMusic(songaddr);
        })
    })
    let play=document.getElementById("play");
    play.addEventListener("click",()=>{
        if(currsong.paused){
            currsong.play();
            play.src="pause.svg"
        }else{
            currsong.pause();
            play.src="play.svg"
        }
    })
}
main();