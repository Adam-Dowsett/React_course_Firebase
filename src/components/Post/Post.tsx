import { Post as postInterface} from "../../pages/MainPage/MainPage"
import "./Post.css"
import { db, auth } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import {Likes} from "../"
import { LikeType } from "../Likes/Likes"

interface IProps {
    post: postInterface,
    deletePost: (postId: string) => void
}


const Post = (Props: IProps) => {

    const {post, deletePost} = Props


    const [user] = useAuthState(auth)


    
    const isPostOwner = post?.userId === user?.uid

    

    return(
        <div className="post">
            {isPostOwner && <button onClick={() => deletePost(post?.id)} className="deleteButton">X</button>}
            <div className="title">
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p>{post.description}</p>
            </div>
            <div className="footer">
                <p>{post.username}</p>
                <Likes parentId={post?.id} LikeType={LikeType.post}/>
            </div>
        </div>
    )
}

export default Post