import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import usePanZoom from "use-pan-and-zoom";

import "../styles/photo-editor.scss";

const PhotoEditor = () => {
  const { transform, panZoomHandlers, setContainer, container, setZoom, setPan } = usePanZoom({
    minX: 0-(document.body.clientWidth * 0.1),
    maxX: document.body.clientWidth * 0.1,
    minY: 0-(document.body.clientHeight * 0.1),
    maxY: document.body.clientHeight * 0.1,
    enableZoom: false,
  });
  
  const onDrop = useCallback((droppedFiles) => {
    droppedFiles.forEach(file => {
      const reader = new FileReader();

      // Reading the image onload event to extract its data and assign it to a new instant of Image()
      reader.onload = (file) => {
        const img = new Image()

        //Reading the image width & height when it's uploaded
        img.src = file.target.result
        img.onload = () => {
          const widthRatio = container.offsetWidth/img.width,
          heightRatio = container.offsetHeight/img.height,
          heightCenter = ((container.firstChild.offsetHeight * Math.max(widthRatio, heightRatio)) - container.offsetHeight)/4

          // Set the image zoom and pan according to the container div dimentions
          if(widthRatio > 1 || heightRatio > 1) {
            setZoom(Math.max(widthRatio, heightRatio));
            setPan({x: 0, y: heightCenter});
          } else {
            setZoom(1);
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }, [container, setZoom, setPan]);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      multiple: false,
      accept: "image/*",
    });

  const selectedImage = acceptedFiles.length > 0 && (
    <img
      alt={acceptedFiles[0].name}
      key={acceptedFiles[0].path}
      src={URL.createObjectURL(acceptedFiles[0])}
    />
  );

  return (
    <div className="App">
      <div className="photo-editor">
        <div className="photo-viewer">
          <div
            className="image-outer-container"
            ref={(el) => setContainer(el)}
            {...panZoomHandlers}
          >
            <div className="image-inner-container" style={{ transform }}>
              {selectedImage}
            </div>
          </div>
        </div>
        <div className="drop-zone" {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="text">
            {isDragActive ? (
              <p>Drop the images here</p>
            ) : (
              <div>
                <i className="n-icon n-icon-upload"></i>
                <p>Drag &amp; Drop or click to select an image</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
