import { getDocs, collection, deleteDoc, doc } from "firebase/firestore"
import { useState, useEffect } from "react"
import { db } from "../../config/firebase"
import {Post} from "../../components"
import "./MainPage.css"

export interface Post {
    id: string;
    title: string;
    description: string;
    userId: string;
    username: string;
}



const MainPage = () => {
    const [postsList, setPostsList] = useState<Post[] | null>(null)
    const postRef = collection(db, "posts");

    const getPosts = async () => {
        const data = await getDocs(postRef);
        setPostsList(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]
        )
    }

    useEffect(() => {
        getPosts();
    }, [])

    const deletePost = async (postId: string) => {
        try{
            const postToDelete = doc(db, "posts", postId)
            await deleteDoc(postToDelete)
            setPostsList((prev) => prev && prev?.filter((post) => post.id !== postId))
        }
        catch (e){
            console.log(e)
        }
    }

    return (
        <div> 
            <div className="postContainer">
                {postsList?.map((post, key) => {
                    return (
                        <Post post={post} key={key} deletePost={deletePost}/>
                    )
                })}
            </div> 
        </div>
    )
}

export default MainPage