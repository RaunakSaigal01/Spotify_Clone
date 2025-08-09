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
function secondsToMinuteSeconds(seconds){
    if(isNaN(seconds) || seconds<0){
        return "--";
    }
    const minutes = Math.floor(seconds/60);
    const remain = Math.floor(seconds%60);
    const formatMin = String(minutes).padStart(2,'0');
    const formatSec = String(remain).padStart(2,'0');
    return `${formatMin}:${formatSec}`;
}

const playMusic = (track , pause=false, prior=false) => {
    let play=document.getElementById("play");
    if(prior)currsong.src = "/songs/" + track
    else currsong.src = "/songs/" + track +".mp3"
    if(!pause){currsong.play()
        play.src="pause.svg"
    }
    document.querySelector(".song-info").innerHTML = decodeURIComponent(track.replace(".mp3",""))
    document.querySelector(".song-time").innerHTML = "00:00/00:00";

}
async function main() {
    let songs = await getSongs();
    playMusic(songs[0],true,true)
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

    currsong.addEventListener("timeupdate",()=>{
        console.log(currsong.currentTime,currsong.duration);
        document.querySelector(".song-time").innerHTML=`${secondsToMinuteSeconds(currsong.currentTime)}/${secondsToMinuteSeconds(currsong.duration)}`;
        document.querySelector(".circle").style.left = (currsong.currentTime/currsong.duration)*100+"%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = ((e.offsetX/e.target.getBoundingClientRect().width))*100
        document.querySelector(".circle").style.left = percent +"%";
        currsong.currentTime = (currsong.duration * percent)/100
    })
    document.querySelector(".hamcont").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })
}
main();