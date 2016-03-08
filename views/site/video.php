<?php

use yii\helpers\Url;

$host = Yii::$app->request->hostInfo;
$src = Url::base() . '/videos/example_video.mp4';

$this->registerCss("
    body{
        background: lightgray;
    }
    .btn{
        width:35px;
    }
    .control-container{
        background-color: aliceblue;
        padding: 5px;
        border-radius:5px;
    }
    #time{
        margin-left: 10px; 
        margin-right: 10px;
    }
    #videoSliderContainer, #volumeSliderContainer{
        display: inline-block; 
        margin-left: 10px;
        margin-right: 10px;
    }
    #videoSliderContainer .slider-selection, #volumeSliderContainer .slider-selection{
        background:darkgray;
    }
    #videoSlider{
        width: 290px;
    }
    #volumeSlider{
        width: 70px;
    }
        ");
$this->registerCssFile(Url::base() . '/components/slider/css/slider.css', ['depends' => [\yii\bootstrap\BootstrapAsset::className()]]);
$this->registerJsFile(Url::base() . '/js/socket.io-client/socket.io.js', ["depends" => \yii\web\JqueryAsset::className()]);
$this->registerJsFile(Url::base() . '/components/slider/js/bootstrap-slider.js', ["depends" => \yii\web\JqueryAsset::className()]);
$this->registerJsFile(Url::base() . '/components/FullscreenOverlayStyles/js/modernizr.custom.js', ["depends" => \yii\web\JqueryAsset::className()]);
$this->registerJsFile(Url::base() . '/js/video/function.js', ["depends" => \yii\web\JqueryAsset::className()]);
?>

<div class="row">
    <div class="col-sm-offset-3 col-sm-6">Server <span id="stat_server" style="font-weight: bold">-</span></div>
    <div class="col-sm-offset-3 col-sm-6">Video <span id="stat_video" style="font-weight: bold">-</span></div>
</div>
<div class="row">
    <div class="col-sm-offset-3 col-sm-6">
        <video id="myVideo" style="width: 100%">
            <source src="<?= $src ?>" type="video/mp4">
        </video>
    </div>
</div>
<div id="control" class="row" style="display: none">
    <div class="col-sm-offset-3 col-sm-6 control-container">
        <a id="play" href="#" class="btn btn-info btn-sm"><i class="fa fa-play"></i></a>
        <a id="pause" href="#" class="btn btn-info btn-sm" style="display: none"><i class="fa fa-pause"></i></a>
        <div id="videoSliderContainer">
            <div id="videoSlider"></div>
        </div>
        <span id="time">0:00</span>
        <a id="mute" href="#" class="btn btn-info btn-sm" ><i class="fa fa-volume-up"></i></a>
        <a id="unmute" href="#" class="btn btn-info btn-sm" style="display: none"><i class="fa fa-volume-off"></i></a>
        <div id="volumeSliderContainer">
            <div id="volumeSlider"></div>
        </div>
        <a id="fullscreen" href="#" class="btn btn-info btn-sm pull-right"><i class="fa fa-external-link"></i></a>
    </div>
</div>