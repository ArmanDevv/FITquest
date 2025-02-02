import React from 'react'
import "./home.css"
import { Zoom } from 'react-slideshow-image';
import image1 from "../../assets/image1.png"
import image2 from "../../assets/image2.png"
import image3 from "../../assets/image3.png"
import image4 from "../../assets/image4.png"
const images = [image1, image2, image3, image4];

const zoomOutProperties = {
  duration: 2000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  scale: 0.4,
  arrows: true
};
const Slideshow = () => {
    return (
      <div className="slide-container justify-center items-center">
        <Zoom {...zoomOutProperties}>
          {images.map((each, index) => (
            <img key={index} style={{ width: "80%" , marginLeft: "10%", marginTop: "5%"}} src={each} />
          ))}
        </Zoom>
      </div>
    );
  };

const Home = () => {
  return (
    <div>
        <Slideshow />
    </div>
  )
}

export default Home
