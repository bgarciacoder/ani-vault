import React from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export default function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}: Props) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = "/assets/images/no_image.png"
      }}
      {...props}
    />
  );
}