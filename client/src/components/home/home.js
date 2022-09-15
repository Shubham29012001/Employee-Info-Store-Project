import React from 'react';
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import "./home.css";

const Home = () => {
  return (
    <>
      <div class="container home_container">
        <Zoom duration={700}>
          <h1 className="home_h1">Employee Info Store App</h1>
        </Zoom>

        <Fade duration={700}>
          <p className="home_p">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
        </Fade>
      </div>

    </>
  )
};

export default Home;