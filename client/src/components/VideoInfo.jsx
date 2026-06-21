import "../styles/videoRoom.css"
function VideoInfo({ video }) {
  if(!video){
    return null;
  }

  return (
    <div className="video-info">
      <h2>{video.title}</h2>
      <p>{video.channelTitle}</p>
    </div>
  );
}

export default VideoInfo;