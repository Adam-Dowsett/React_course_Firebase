import { getDocs, collection } from "firebase/firestore"
import { useState, useEffect } from "react"
import { db } from "../../config/firebase"
import {Post} from "../../components"

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

    return (
        <div> 
            {postsList?.map((post, key) => {
                return (
                    <Post post={post} key={key}/>
                )
            })}    
        </div>
    )
}

export default MainPage