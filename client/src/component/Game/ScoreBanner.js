import {MUD_BROWN, BLUE_CARD, RED_CARD} from '../../constants';

export default function ScoreBanner(props) {
  const style = {
    container: {
      position: 'absolute',
      top: 0,
      left: props.isRedTeam ? '90px' : 'initial',
      right: !props.isRedTeam ? '90px' : 'initial',
      zIndex: 1,
      backgroundColor: props.isRedTeam ? RED_CARD : BLUE_CARD,
      width: '85px',
      height: '130px',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 70%, 0% 100%)',
    },
    score: {
      color: MUD_BROWN,
      fontSize: 40,
      textAlign: 'center',
      marginTop: 20,
      fontWeight: 900,
    }
  };
  return (
    <div style={style.container}>
      <div style={style.score}>{props.score}</div>
    </div>
  );
}