import {MUD_BROWN} from '../../constants';

export default function TextInput (props) {
  const style = {
    input: {
      background: 'transparent',
      border: 'none',
      borderBottom: `1px solid ${MUD_BROWN}`,
      height: 30,
      width: 220,
      marginBottom: 24,
      color: `${MUD_BROWN}`,
      fontSize: '16px',
      ...props.style,
    }
  }

  return (
    <input
      class='login-input'
      style={style.input}
      type='text'
      placeholder={props.placeholder}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      autocomplete="off"
    />
  );

}