import Button from '../../components/button/Button';

import './Home.css';

function Home (){
    return (
        <div class="container">
            <div class="image">
                <img src="/image_1.png" alt="Imagen" />
            </div>
            <div class="info">
                <h1>PLANNING TOOL</h1>
                <p>TUS PROYECTOS PUEDEN CAMBIAR EL MUNDO</p>
                <div class="sep"></div>
                <div class="buttons">
                    <Button text="Iniciar sesión con google" />
                </div>
            </div>
        </div>
    );
}

export default Home;