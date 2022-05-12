import Image from "next/image";
import {useSession} from "next-auth/react";
import {EmojiHappyIcon} from "@heroicons/react/outline";
import {CameraIcon, VideoCameraIcon} from "@heroicons/react/solid";
import { useRef } from "react";
import { db, storage } from "../firebase";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import { useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";

function InputBox() {
    const { data: session, status} = useSession();
    const inputRef = useRef(null);
    const filepickerRef = useRef(null);
    const [imageToPost, setImageToPost] = useState(null);

    const sendPost = async (e) => {
        e.preventDefault();

        if(!inputRef.current.value) return;

        const docRef = await addDoc(collection(db, 'posts'), {
            message: inputRef.current.value,
            name: session.user.name,
            // email: session.user.email,
            image: session.user.image,
            timestamp: serverTimestamp()
        });

        if(imageToPost) {
            const imageRef = ref(storage, `posts/${docRef.id}/image`);

            await uploadString(imageRef, imageToPost, "data_url").then(async snapshot => {
                const downloadURL = await getDownloadURL(imageRef);

                await updateDoc(doc(db, 'posts', docRef.id), {
                    postImage: downloadURL
                })
            });

            removeImage();
        }

        inputRef.current.value = "";
    };

   const addImageToPost = (e) => {
        const reader = new FileReader();
        if(e.target.files[0])
        {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setImageToPost(readerEvent.target.result)
        }
   }

   const removeImage = () => {
       setImageToPost(null);
   }


  return (
    <div className="bg-white p-2 rounded-2xl shadow-md
    text-grat-500 font-medium mt-6">
        <div className="flex space-x-4 p-4 items-center">
            <img
            className="rounded-full"
            src={session.user.image}
            width={40}
            height={40}
            layout="fixed"
             />
             <form className="flex flex-1">
                 <input
                 className="rounded-full h-12 bg-gray-100
                 flex-grow px-5 focus:outline-none"
                 type="text"
                 ref={inputRef}
                 placeholder={`What's on your mind, ${session.user.name}?`}  />
                 <button hidden type="submit" onClick={sendPost}>Submit</button>
             </form>

            {imageToPost && (
                <div onClick={removeImage} className="flex flex-col 
                filter hover:brightness-110 transition duration-150
                transform hover:scale-105 cursor-pointer">
                    <img className="h-10 object-contain" src={imageToPost} alt="" />
                    <p className="text-xs text-red-500 text-center">Remove</p>
                </div>
            )}

        </div>

        <div className="flex justify-evenly p-3 border-t">
            <div className="inputIcon">
                <VideoCameraIcon className="h-7 text-red-500" />
                <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
            </div>

            <div onClick={() => filepickerRef.current.click()} className="inputIcon">
                <CameraIcon className="h-7 text-green-400" />
                <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
                <input ref={filepickerRef} onChange={addImageToPost} type="file" hidden />
            </div>

            <div className="inputIcon">
                <EmojiHappyIcon className="h-7 text-yellow-300" />
                <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
            </div>
        </div>

    </div>
  )
}

export default InputBox