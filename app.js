/*
1. render songs
2. Scroll top
3. Play / pause / seek 
4. CD rotate
5. Next / prev 
6. random 
7. next / repeat when ended
8. active song
9. scroll active song into view 
10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist');
const cd = $('.cd');
const audio = $('#audio');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevtBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

let randomIds = [];


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeating: false,
    songs: [{
            id: 0,
            name: 'Hơn cả yêu',
            singer: 'Đức Phúc',
            path: 'assets/music/01.mp3',
            image: 'assets/img/01.jpg'
        },
        {
            id: 1,
            name: 'Cứ vội vàng',
            singer: 'Rô Ti',
            path: 'assets/music/02.mp3',
            image: 'assets/img/02.jpg'
        },
        {
            id: 2,
            name: 'Em đồng ý nha',
            singer: 'Nguyễn Qang Quý',
            path: 'assets/music/03.mp3',
            image: 'assets/img/03.jpg'
        },
        {
            id: 3,
            name: 'Anh từng cố gắng',
            singer: 'Nhật Phong',
            path: 'assets/music/04.mp3',
            image: 'assets/img/04.jpg'
        },
        {
            id: 4,
            name: 'Sắp 30',
            singer: 'Trịnh Đình Quang',
            path: 'assets/music/05.mp3',
            image: 'assets/img/05.jpg'
        }
    ],

    render: function() {
        let htmls = this.songs.map(function(song) {
            return `
            <div class="song">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    //tra ve song hien tai
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvent: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        //xu ly phong to, thu nho CD
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        //khi click vao nut play
        playBtn.onclick = function() {
            if (_this.isPlaying == false) {
                audio.play();
            } else {
                audio.pause();
            }
        }

        //khi song play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //khi song pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }

        //khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const percent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = percent;
            }
        }

        //xu li cd quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000, //quay trong 20s
            iterations: Infinity
        })
        cdThumbAnimate.pause();


        //xu li khi tua xong
        progress.onchange = function(e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        }

        //click nut next
        nextBtn.onclick = function() {
            if(_this.isRepeating===true){
                _this.repeatSong();
            }else{
                if(_this.isRandom === false) {
                    _this.nextSong();
                }else {
                    _this.randomIndex();
                }
                audio.play();
            }
        }

        //click nut prev
        prevtBtn.onclick = function() {

            if(_this.isRepeating===true){
                _this.repeatSong();
            }else{
                if(_this.isRandom === false) {
                    _this.prevSong();
                }else {
                    _this.randomIndex();
                }
                audio.play();
            }
        }
        
        //khi ket thuc bai hat
        audio.onended = function() {
            if(_this.isRepeating===true){
                _this.repeatSong();
            }else{
                if(_this.isRandom === false) {
                    _this.nextSong();
                }else {
                    _this.randomIndex();
                }
                this.play();
            }
        }
        //khi click vao nut random
        randomBtn.onclick = function() {
            if(_this.isRandom===false) {
                randomBtn.classList.add('active');
                _this.isRandom = true;
            }else{
                randomBtn.classList.remove('active');
                _this.isRandom = false;
            }
        }


        //khi click nut repeat
        repeatBtn.onclick = function(){
            if(_this.isRepeating===false) {
                repeatBtn.classList.add('active');
                _this.isRepeating = true;
            }else {
                repeatBtn.classList.remove('active');
                _this.isRepeating = false;
            }
        }

    },
    loadCurerntSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.loadCurerntSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.loadCurerntSong();
    },
    randomIndex: function(){
        if(randomIds.length==0){
            for(var i=0; i<this.songs.length; i++){
                randomIds.push(i);
            }
        } 
        //chon ngau nhien 1 index trong randmIds
        let newIndex = Math.floor((Math.random() * randomIds.length ));
        this.currentIndex = randomIds[newIndex];
        randomIds = randomIds.filter(function(item){
            return item!=randomIds[newIndex];
        })
        this.loadCurerntSong();
    },
    repeatSong: function(){
        this.loadCurerntSong();
        audio.play();
    },
    start: function() {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurerntSong();
        audio.play();

        //Render playlist
        this.render();
    }
}

app.start();



