import React, { useEffect, useState, useRef } from "react";
import "./Img.css";
import { useDispatch } from "react-redux";

import { useParams } from "react-router-dom";

import {
  CloseOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Carousel } from "antd";

const Img = ({ url }) => {

  // const PortfolioImgCard = (props: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [activeImage, setActiveImage] = useState();
  const [zoomed, setZoomed] = useState(true);
  const [gallery, setGallery] = useState(url);
  useEffect(() => {
    setGallery(url);
  }, [url]);

  const modalRef = useRef(null);

  const serviceParam = useParams();
  const dispatch = useDispatch();

  const handleActiveImage = (element) => {
    setActiveImage(element);
    setOpenModal(true);
  };
  const imageCountPlus = (count) => {
    if (count !== undefined && count < filteredImages.length - 1) {
      setActiveImage((prev) => prev + 1);
    } else {
      setActiveImage(0);
    }
  };
  const imageCountMinus = (count) => {
    if (count > 0 && count <= filteredImages.length) {
      setActiveImage((prev) => prev - 1);
    } else {
      setActiveImage(filteredImages.length - 1);
    }
  };
  useEffect(() => {
    const handleScroll = (event) => {
      if (modalRef.current && modalRef.current.contains(event.target)) {
        const deltaY = event.deltaY;
        if (deltaY > 0) {
          imageCountMinus(activeImage);
        } else if (deltaY < 0) {
          imageCountPlus(activeImage);
        }
      }
    };

    if (openModal) {
      window.addEventListener("wheel", handleScroll);
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [openModal, activeImage]);

  const serviceFolderMap = {
    Plomberie: "Plomberie",
    electricité: "electricité",
    exécution: "exécution",
    structure: "structure",
    intérieur: "intérieur",
    exterieur: "exterieur",
  };

  const folderName = serviceFolderMap[serviceParam.service];

  const filteredImages = gallery.filter((el) => el.folder === folderName);

  return (
    <>
      {" "}
      <div className="bmes_service_portfolio">
        {filteredImages
          ? filteredImages.map((el, index) => (
              <div key={index} className="bmes_service_portfolio_images">
                <img
                  className="bmes_img"
                  src={el.secure_url}
                  alt=""
                  loading="lazy"
                  onClick={() => handleActiveImage(index)}
                />
              </div>
            ))
          : "loading"}
      </div>{" "}
      {openModal && (
        <div
          className="bmes_portfolio_images_caroussel animate__animated animate__zoomIn"
          ref={modalRef}
        >
          <div className="close_caroussel_portfolio">
            <div className="modal__menu">
              <CloseOutlined onClick={() => setOpenModal(false)} />
              {!zoomed ? (
                <ZoomOutOutlined onClick={() => setZoomed((prev) => !prev)} />
              ) : (
                <ZoomInOutlined onClick={() => setZoomed((prev) => !prev)} />
              )}
            </div>

            <Carousel
              autoPlay={false}
              animation={"fade"}
              duration={700}
              swipe={false}
              navButtonsAlwaysVisible
              index={activeImage}
              next={() => {
                setZoomed((prev) => prev);
                imageCountPlus(activeImage);
              }}
              prev={() => {
                setZoomed((prev) => prev);
                imageCountMinus(activeImage);
              }}
            >
              {filteredImages.map((item, i) => (
                <div
                  className={
                    zoomed
                      ? "bmes_active_portfolio_image"
                      : "bmes_active_portfolio_image zoomed_in"
                  }
                >
                  <img key={i} src={item.secure_url} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
};

export default Img;
