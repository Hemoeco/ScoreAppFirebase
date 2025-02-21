import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoScreen({ uri, style }) {
  const player = useVideoPlayer(
    uri,
    //player => {
    //  player.loop = true;
    //  player.play();
    //}
  );

  return (
    <VideoView style={style} player={player} allowsFullscreen />
  );
}
