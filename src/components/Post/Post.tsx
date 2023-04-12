import { Post as postInterface} from "../../pages/MainPage/MainPage"
import "./Post.css"
import { db, auth } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { useEffect, useState } from "react"

interface postProps {
    post: postInterface
}

interface Like {
    userId: string;
    likeId: string;
    // postId: string;
}

const Post = ({ post }: postProps) => {

    const [likes, setLikes] = useState<Like[] | null>(null)

    const [user] = useAuthState(auth)

    const likesRef = collection(db, "likes")

    const likesDoc = query(likesRef, where("postId", "==", post?.id))

    const getLikes = async () => {
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id})))
    }

    const addLike = async () => {
        try{
        const newDoc = await addDoc(likesRef, {
            userId: user?.uid,
            postId: post?.id,
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
            const likeToDeleteQuery = query(likesRef, where("userId", "==", user?.uid), where("postId", "==", post?.id))
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

    return(
        <div className="post">
            <div className="title">
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p>{post.description}</p>
            </div>
            <div className="footer">
                <p>{post.username}</p>
                <button onClick={hasUserLiked ? removeLike : addLike}>{hasUserLiked ? <>&#128078;</> : <>&#128077;</> }</button>
                {likes?.length && <p>Likes: {likes?.length}</p>}
            </div>
        </div>
    )
}

export default Post