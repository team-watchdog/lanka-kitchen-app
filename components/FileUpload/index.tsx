import React, { useState } from "react";
import { CropperRef, Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css'

// components
import Modal from "../Modal";
import Button from "../Button";

export function ImageCropper() {
  const allowedFileTypes = `image/gif image/png, image/jpeg, image/x-png`;
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let image = e.target.files ? e.target.files[0] : null;
    
    if (image) {
      setFile(image);

      const imageReader = new FileReader();
      imageReader.readAsDataURL(image);
      imageReader.onloadend = () => {
        console.log(imageReader.result);
        setViewImage(imageReader.result as string);
      };
    }
  };
  
  const onChange = (cropper: CropperRef) => {
    console.log(cropper.getCoordinates(), cropper.getCanvas());
  };

  return (
    <>
        <input
            id="upload-image"
            name="upload photo"
            type="file"
            multiple={false}
            value={""}
            accept={allowedFileTypes}
            onChange={handleFileChange}
        />
        {viewImage ? (
          <Modal
            title="Upload Image"
            onClose={() => setViewImage(null)}
            open={true}
          >
            <div className="max-h-[600px] w-full flex">
                <Cropper
                    src={viewImage}
                    onChange={onChange}
                    className={'cropper'}
                />
            </div>
            <div className="py-4">
              <Button type="primary" onMouseDown={() => setViewImage(null)}>Crop and upload</Button>
            </div>
          </Modal>
      ): null}
    </>
  );
}