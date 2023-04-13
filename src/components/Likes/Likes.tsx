import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"

interface Like {
    userId: string;
    likeId: string;
    // postId: string;
}

export enum LikeType {
    post = "postId",
    comment = "commentId"
}

interface IProps {
    parentId: string;
    LikeType: LikeType;
}

const Likes = (Props : IProps) => {

    const {parentId, LikeType} = Props

    const [user] = useAuthState(auth)

    const [likes, setLikes] = useState<Like[] | null>(null)

    const likesRef = collection(db, "likes")

    const likesDoc = query(likesRef, where(LikeType, "==", parentId))

    const getLikes = async () => {
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id})))
    }

    const addLike = async () => {
        try{
            // let newDoc : any;
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                [LikeType]: parentId,
            });
            if (user){
                setLikes((prev) => prev ? [...prev, {userId: user?.uid, likeId: newDoc.id}] : [{userId: user?.uid, likeId: newDoc.id}])
            }
        } catch (e) {
            console.log(e) 
        }
    }

    const removeLike = async () => {
        try{
            const likeToDeleteQuery = query(likesRef, where("userId", "==", user?.uid), where(LikeType, "==", parentId))
            const likeToDeleteData = await getDocs(likeToDeleteQuery)
            const likeId = likeToDeleteData.docs[0].id
            const likeToDelete = doc(db, "likes", likeId)
            await deleteDoc(likeToDelete)
            if (user){
                setLikes((prev) => prev && prev?.filter((like) => like.likeId !== likeId))
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    const hasUserLiked = likes?.find((like) => like.userId === user?.uid)

    useEffect(() => {
        getLikes();
    }, []);

    return (
        <div className="likes">
            <button onClick={hasUserLiked ? removeLike : addLike}>{hasUserLiked ? <>&#128078;</> : <>&#128077;</> }</button>
            {likes?.length && <p>Likes: {likes?.length}</p>}
        </div>
    )
}

export default Likes;