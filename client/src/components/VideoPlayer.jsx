import "../styles/videoRoom.css"

function VideoPlayer({ video }) {

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
        width="100%"
        height="450"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title="YouTube video player"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default VideoPlayer;