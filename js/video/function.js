var srv = window.location.host + ':3000';
var vid = document.getElementById('myVideo');
var sct = io.connect(srv, {reconnection: false});
var status = 'pause';
var slide = false;
var position = vid.currentTime;
var volume = vid.volume;
var mute = vid.muted;
var data = {'status': status, 'position': position, 'volume': volume, 'mute': mute};
var videoslider;
var volumeslider;

sct.on('connect', function () {
    console.log("Listening to " + srv);
    $('#stat_server').html("Listening to " + srv);
    vid.onplay = function () {
        $('#play').hide();
        $('#pause').show();
    };
    vid.onpause = function () {
        $('#play').show();
        $('#pause').hide();
    };
    vid.onloadeddata = function () {
        $('#play').show();
        $('#pause').hide();
        video_loaded(0, vid.duration);
    };
    vid.ontimeupdate = function () {
        video_timeupdate(vid.currentTime);
    };
    vid.onvolumechange = function () {
        if (vid.muted) {
            $('#mute').hide();
            $('#unmute').show();
        } else {
            $('#mute').show();
            $('#unmute').hide();
        }
        video_volumechange(vid.volume);
    };
    $('#play').click(function () {
        video_play();
    });
    $('#pause').click(function () {
        video_pause();
    });
    $('#mute').click(function () {
        video_mute();
    });
    $('#unmute').click(function () {
        video_unmute();
    });
    $('#fullscreen').click(function () {
        if (vid.requestFullscreen) {
            vid.requestFullscreen();
        } else if (vid.msRequestFullscreen) {
            vid.msRequestFullscreen();
        } else if (vid.mozRequestFullScreen) {
            vid.mozRequestFullScreen();
        } else if (vid.webkitRequestFullscreen) {
            vid.webkitRequestFullscreen();
        }
    });
});

sct.io.on('connect_error', function (e) {
    $('#stat_server').html('Error connecting to server');
    console.log('Error connecting to server');
});

sct.on('disconnect', function () {
    $('#stat_server').html('Disconnected');
    console.log('Disconnect from server');
});

sct.on('new_message', function (e) {
    console.log(e);
    socket_new_message(e);
});

function video_play() {
    status = 'play';
    position = vid.currentTime;
    volume = vid.volume;
    mute = vid.muted;
    emitdata();
}

function video_pause() {
    if (status !== 'pause' && position !== vid.currentTime) {
        status = 'pause';
        position = vid.currentTime;
        volume = vid.volume;
        mute = vid.muted;
        emitdata();
    }
}

function video_unmute() {
    position = vid.currentTime;
    volume = vid.volume;
    mute = false;
    emitdata();
}

function video_mute() {
    position = vid.currentTime;
    volume = vid.volume;
    mute = true;
    emitdata();
}

function video_loaded(min, max) {
    $('#stat_video').html('OK');
    //volume slider
    volumeslider = $('#volumeSlider').slider({
        tooltip: 'hide',
        step: 0.000000000001,
        min: 0.0001,
        max: 1,
        handle: 'triangle'
    });
    volumeslider.slider('setValue', 1);
    volumeslider.on('slideStop', function (e) {
        position = vid.currentTime;
        mute = vid.muted;
        volume = e.value;
        emitdata();
    });

    //video slider
    videoslider = $('#videoSlider').slider({
        tooltip: 'hide',
        min: min,
        max: max,
        handle: 'triangle'
    });
    videoslider.slider('setValue', 0);
    videoslider.on('slideStart', function (e) {
        slide = true;
        position = e.value;
        volume = vid.volume;
        mute = vid.muted;
        emitdata();
    });
    videoslider.on('slideStop', function (e) {
        slide = false;
        position = e.value;
        volume = vid.volume;
        mute = vid.muted;
        emitdata();
    });

    $('#control').fadeIn();
}

function video_timeupdate(pos) {
    $('#time').html(secondsToHms(pos));
    if (videoslider) {
        if (!slide) {
            videoslider.slider('setValue', pos);
        }
    }
}

function video_volumechange(vol) {
    if (volumeslider) {
        volumeslider.slider('setValue', vol);
    }
}

function socket_new_message(e) {
    var data_json = JSON.parse(e);
    var data_slide = false;
    var data_status = 'pause';
    var data_position = 0;
    var data_volume = 1;
    var data_mute = false;

    if (data_json['slide']) {
        data_slide = data_json['slide'];
    }
    if (data_json['status']) {
        data_status = data_json['status'];
    }
    if (data_json['position']) {
        data_position = data_json['position'];
    }
    if (data_json['volume']) {
        data_volume = data_json['volume'];
    }
    if (data_json['mute']) {
        data_mute = data_json['mute'];
    }

    if (data_slide) {
        vid.pause();
    } else {
        switch (data_status) {
            case 'play':
                vid.play();
                break;
            case 'pause':
                vid.pause();
                break;
        }
    }

    vid.muted = data_mute;
    vid.volume = data_volume;
    vid.currentTime = data_position;
}

function emitdata() {
    data = {'slide': slide, 'status': status, 'position': position, 'volume': volume, 'mute': mute};
    sct.emit('set_message', JSON.stringify(data));
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
}
