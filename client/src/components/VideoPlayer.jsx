import "../styles/videoRoom.css"

function VideoPlayer({ video, playerRef }) {

  if (!video) {
    return (
      <div className="video-player">
        No video found
      </div>
    );
  }
  return (
    <div className="video-player">
      <iframe
        id="youtube-player"
        width="100%"
        height="450"
        src={`https://www.youtube.com/embed/${video.videoId}?enablejsapi=1`}
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default VideoPlayer;