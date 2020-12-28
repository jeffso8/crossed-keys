import {MUD_BROWN, BLUE_CARD, RED_CARD} from '../../constants';
import {Responsive} from '../shared/responsive';

export default function ScoreBanner(props) {
  const {isMobile} = Responsive();

  const webStyle = {
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

  const mobileStyle = {
    container: {
      position: 'absolute',
      top: 0,
      left: props.isRedTeam ? '20px' : 'initial',
      right: !props.isRedTeam ? '20px' : 'initial',
      zIndex: 1,
      backgroundColor: props.isRedTeam ? RED_CARD : BLUE_CARD,
      width: '55px',
      height: '90px',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 70%, 0% 100%)',
    },
    score: {
      color: MUD_BROWN,
      fontSize: 30,
      textAlign: 'center',
      marginTop: 20,
      fontWeight: 900,
    }
  };

  const style = isMobile ? mobileStyle : webStyle;

  return (
    <div style={style.container}>
      <div style={style.score}>{props.score}</div>
    </div>
  );
}