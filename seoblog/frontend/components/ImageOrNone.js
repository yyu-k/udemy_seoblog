'use client'
import { useEffect, useState } from "react"

export const ImageOrNone = ({src, ...imgProps}) => {
    const [img, setImg] = useState();

    const fetchImage = async () => {
      const res = await fetch(src);
      const imageBlob = await res.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      if (imageBlob.type !== 'undefined') {
        setImg(imageObjectURL);
      } else {
        setImg('/no_image.jpg')
      }
    };
  
    useEffect(() => {
      fetchImage();
    }, []);
  
    return (
      <>
        <img src={img} {...imgProps}/>
      </>
    );
}
