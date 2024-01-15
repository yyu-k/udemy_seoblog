'use client'
import { useEffect, useState } from "react"

export const ImageOrNone = ({src, ...imgProps}) => {
    const [img, setImg] = useState();

    const fetchImage = async () => {
      if (src.substring(0,4) === 'data'){
        setImg(src)
      } else {
        const res = await fetch(src);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        if (imageBlob.type.includes('image')) {
          setImg(imageObjectURL);
        } else {
          setImg('/no_image.jpg')
        }
      }
      
    };
  
    useEffect(() => {
      fetchImage();
    }, [src]);
  
    return (
      <>
        <img src={img} {...imgProps}/>
      </>
    );
}
