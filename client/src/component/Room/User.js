import {BROWNISH} from '../../constants';


export default function User(props) {

  const style = {
    name:{
      fontSize: 24,
      margin: 12,
      textTransform: 'uppercase',
      fontWeight: 900,
      textAlign: 'center',
      alignSelf: 'center',
      color: BROWNISH,
    },
  };

  return (
    <div key={props.i} style={style.name}>
      {props.name}
      {props.isSpyMaster && <div>spymaster</div>}
    </div>
  );
}