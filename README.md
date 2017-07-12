# Days4God
## Description
I used to manually take every link, track title and duration of each track, this is a automation tool I made to create a playlist for amazingaudioplayer based on the place of track titles and links.

## How it works
Paste html from previous post of the track list with links. The script looks for a link and text that comes before it is used as the tracks title.

## Sample input
    <b>01.</b> Новая палитра неба <a href="http://days4god.org/music/anastasija_nakonechnaja/novaja_palitra_neba/01.%20%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BB%D0%B8%D1%82%D1%80%D0%B0%20%D0%BD%D0%B5%D0%B1%D0%B0.mp3" title="Скачать"><img alt="Скачать" src="http://days4god.org/save.png" style="border: medium none;"></a><br>
    <b>02.</b> Крылья веры <a href="http://days4god.org/music/anastasija_nakonechnaja/novaja_palitra_neba/02.%20%D0%9A%D1%80%D1%8B%D0%BB%D1%8C%D1%8F%20%D0%B2%D0%B5%D1%80%D1%8B.mp3" title="Скачать"><img alt="Скачать" src="http://days4god.org/save.png" style="border: medium none;"></a><br>
    <b>03.</b> Вернуться к самому себе <a href="http://days4god.org/music/anastasija_nakonechnaja/novaja_palitra_neba/03.%20%D0%92%D0%B5%D1%80%D0%BD%D1%83%D1%82%D1%8C%D1%81%D1%8F%20%D0%BA%20%D1%81%D0%B0%D0%BC%D0%BE%D0%BC%D1%83%20%D1%81%D0%B5%D0%B1%D0%B5.mp3" title="Скачать"><img alt="Скачать" src="http://days4god.org/save.png" style="border: medium none;" title="Скачать">
...

## Sample output
The output consists of html marked up for a script by amazingaudioplayer, which is going to use it to initialize a player w/ a playlist.
```
<div style="margin:12px auto;" align="center">
	<div id="amazingaudioplayer-1" style="display:block;position:relative;width:100%;height:auto;margin:0px auto 0px;">
		<ul class="amazingaudioplayer-audios" style="display:none;">
			<li data-artist="Artist" data-title=" Новая палитра неба " data-album="Album" data-info="" data-image="ArtworkLink" data-duration="200">
				<div class="amazingaudioplayer-source" data-src="http://days4god.org/music/anastasija_nakonechnaja/novaja_palitra_neba/01.%20%D0%9D%D0%BE%D0%B2%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BB%D0%B8%D1%82%D1%80%D0%B0%20%D0%BD%D0%B5%D0%B1%D0%B0.mp3 " data-type="audio/mpeg"></div>
			</li>
			<li data-artist="Artist" data-title=" Крылья веры " data-album="Album" data-info="" data-image="ArtworkLink" data-duration="187">
				<div class="amazingaudioplayer-source" data-src="http://days4god.org/music/anastasija_nakonechnaja/novaja_palitra_neba/02.%20%D0%9A%D1%80%D1%8B%D0%BB%D1%8C%D1%8F%20%D0%B2%D0%B5%D1%80%D1%8B.mp3 " data-type="audio/mpeg"></div>
			</li>
			<li data-artist="Artist" data-title=" Вернуться к самому себе " data-album="Album" data-info="" data-image="ArtworkLink" data-duration="212">
				<div class="amazingaudioplayer-source" data-src="http://days4god.org/music/anastasija_nakonechnaja/novaja_palitra_neba/03.%20%D0%92%D0%B5%D1%80%D0%BD%D1%83%D1%82%D1%8C%D1%81%D1%8F%20%D0%BA%20%D1%81%D0%B0%D0%BC%D0%BE%D0%BC%D1%83%20%D1%81%D0%B5%D0%B1%D0%B5.mp3 " data-type="audio/mpeg"></div>
			</li>
		</ul>
	</div>
</div>
```
