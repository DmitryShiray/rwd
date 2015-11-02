(function($) {
	$.videoPlayer = function(options) {
		var self = $(options.videoSelector);
		var video = self[0];

		var startPlayButton = self.next(options.startPlayButtonSelector);
		var videoControls = startPlayButton.next(options.videoControlsSelector);
		var playButton = self.siblings(options.videoControlsSelector).find(options.playButtonSelector);
		var muteButton = self.siblings(options.videoControlsSelector).find(options.muteButtonSelector);

		var muteOnImage = $(options.muteButtonSelector).find(options.muteOnImageSelector);
		var muteOffImage = $(options.muteButtonSelector).find(options.muteOffImageSelector);
		
		var volumeBar = self.siblings(options.videoControlsSelector).find(options.volumeBarSelector);
		var volume = self.siblings(options.videoControlsSelector).find(options.volumeSelector);
		var timebar = self.siblings(options.videoControlsSelector).find(options.timeBarSelector);
		var progress = self.siblings(options.videoControlsSelector).find(options.progressBarSelector);

		function play() {
			if (video.paused && hasVideoStarted) {
				video.play();
			} else {
				video.pause();
			}
		}

		self.on("click", play);
		
		playButton.on("click", play);

		var hasVideoStarted = false;
		startPlayButton.on("click", function () {
			videoControls.removeClass("hidden");
			startPlayButton.addClass("hidden");
			hasVideoStarted = true;
			playButton.click();
		});

		var ismouseOnVolume = true;
		muteButton.on("click", function() {
			if (video.muted == false) {
				video.muted = true;
				muteOnImage.removeClass("hidden");
				muteOffImage.addClass("hidden");
			} else {
				video.muted = false;
				muteOnImage.addClass("hidden");
				muteOffImage.removeClass("hidden");
			}
		});

		muteButton.on({
			mouseenter: function() {
				volume.removeClass("hidden");
			},
			mouseleave: function () {
				setTimeout(function() {
					if (!ismouseOnVolume) {
						volume.addClass("hidden");
					}
				}, 500);
			}
		});

		volume.on({
			mouseenter: function () {
				ismouseOnVolume = true;
				volume.removeClass("hidden");
			},
			mouseleave: function () {
				ismouseOnVolume = false;
				volume.addClass("hidden");
			}
		});

		video.addEventListener("timeupdate", function() {
			var currentPos = video.currentTime; 
			var maxduration = video.duration; 
			var percentage = 100 * currentPos / maxduration;
			timebar.css("width", percentage + "%");
		});

		var timeDrag = false;
		progress.on("mousedown", function(e) {
			timeDrag = true;
			updateProgressBar(e.pageX);
		});

		$(document).on("mouseup", function(e) {
			if (timeDrag) {
				timeDrag = false;
				updateProgressBar(e.pageX);
			}
		});

		$(document).on("mousemove", function(e) {
			if (timeDrag) {
				updateProgressBar(e.pageX);
			}
		});

		volume.on("mousedown", function(e) {
			var position = e.pageY - volume.offset().top;
			var percentage = 100 - 100 * position / volume.width();
			volumeBar.css("width", percentage + "%");
			video.volume = percentage / 100;
		});

		var updateProgressBar = function(x) {
			var maxduration = video.duration;
			var position = x - progress.offset().left; 
			var percentage = 100 * position / progress.width();

			if (percentage > 100) {
				percentage = 100;
			}
			if (percentage < 0) {
				percentage = 0;
			}

			timebar.css("width", percentage + "%");
			video.currentTime = maxduration * percentage / 100;
		};

	};
	
	$.fn.videoPlayer = function(options) {
		var o = $.extend({}, $.fn.videoPlayer.defaultOptions, options);

		this.each(function() {
			new $.videoPlayer(o);
		});

		return this;
	};

	$.fn.videoPlayer.defaultOptions = { };
})(jQuery);