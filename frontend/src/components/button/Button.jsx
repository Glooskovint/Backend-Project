import './Button.css';

function Button(props){
    return(
        <button class="btn-fill">{props.text}</button>
    );
}

export default Button;