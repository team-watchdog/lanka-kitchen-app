import React, { useState, FunctionComponent } from "react";
import { useMutation, gql, ApolloError } from "@apollo/client";
import { CropperRef, Cropper } from 'react-advanced-cropper';
import axios from "axios";
import 'react-advanced-cropper/dist/style.css'

// components
import Modal from "../Modal";
import Button from "../Button";
import { toast } from "react-toastify";

const unsafeAndReservedCharRegex = /(\&|\$|\+|\,|\/|\:|\;|\=|\?|\@|\||\#|\ |\<|\>|\[|\]|\{|\}|\||\\|\^|\%|\~)/ig;

const generateFileName = (file: File) => {
	let timestamp = new Date().getTime();
	const tmpFileName = `${timestamp}_${file.name.replace(/ /ig, "")}`;
	const cleanedFileName = tmpFileName.replace(unsafeAndReservedCharRegex, '_');
	return cleanedFileName;
};

interface FileSignedURLInput{
  fileName: string;
  folderName: string;
  fileType: string;
}

interface FilePresignedURLResponse{
  getPresignedUrl: {
    url: string;
    signedRequest: string;
  }
}

const Mutations = {
	getSignedUrl: gql`
    mutation GetPresignedUrl($data: FileUploadInput!){
      getPresignedUrl(data: $data) {
        signedRequest
        url
      }
    }
  `,
};

export async function dataUrlToFile(dataUrl: string, fileName: string, fileType: string): Promise<File> {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: fileType });
}

interface ImageCropperProps {
  folderName: string;
  onFileUpload: (fileUrl: string, fileName?: string) => void;
}

export const ImageCropper: FunctionComponent<ImageCropperProps> = (props) => {
  const { folderName, onFileUpload } = props;

  const [ uploading, setUploading ] = useState<boolean>(false);
  const [ selectedCropperRef, setSelectedCropperRef ] = useState<CropperRef>();
  const [ getSignedUrl, { loading: signing } ] = useMutation<FilePresignedURLResponse, { data: FileSignedURLInput }>(Mutations.getSignedUrl);

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
        setViewImage(imageReader.result as string);
      };
    }
  };
  
  const onChange = (cropper: CropperRef) => {
    setSelectedCropperRef(cropper);
  };

  const uploadFile = async () => {
    let presignedUrl;
    let fileUrl;

    let newFile;

    setUploading(true);

    if (selectedCropperRef?.getImage()?.src) {
      const croppedImage = selectedCropperRef.getCanvas()?.toDataURL()
      newFile = await dataUrlToFile(croppedImage as string, file?.name as string, file?.type as string);
    }


    try {
      const { data } = await getSignedUrl({
        variables: {
          data: {
            fileName: generateFileName(newFile as File),
            folderName: folderName,
            fileType: newFile?.type as string,
          }
        }
      });

      presignedUrl = data?.getPresignedUrl.signedRequest;
      fileUrl = data?.getPresignedUrl.url;
    } catch (e) {
      let parsedErrors = (e as ApolloError).graphQLErrors;
      const messages = parsedErrors.map((err) => err.message);
      
      for (let message of messages) {
          toast.error(message);
      }
    }
    

    // upload file
    if (!presignedUrl || !fileUrl) {
      toast.error("Error uploading file");
      setUploading(false);
      return;
    }

    var options = {
      withCredentials: false,
      headers: {
        "Content-Type": newFile?.type as string,
      },
    };

    try {
      await axios.put(presignedUrl, newFile, options);
      // e.onSuccess({}, file);
      toast.dismiss();
      toast.success("File Uploaded");

      setViewImage(null);

      if (onFileUpload){
        onFileUpload(fileUrl, (newFile as File).name);
      } 
    } catch (e) {
      console.log(e);
      toast.error("File upload error!");
    }
    setUploading(false);
  }

  return (
    <>
        <input
            id="upload-image"
            name="upload photo"
            type="file"
            multiple={false}
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
              <Button type="primary" onMouseDown={() => uploadFile()} loading={uploading}>Crop and upload</Button>
            </div>
          </Modal>
      ): null}
    </>
  );
}