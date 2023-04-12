import {useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { db, auth } from '../../config/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import './CreateForm.css'
import { useNavigate } from 'react-router-dom'

interface CreateFormData {
    title: string;
    description: string;
}

const CreateForm = () => {

    const navigate = useNavigate();

    const [user] = useAuthState(auth);

    const schema = yup.object().shape({
        title: yup.string().required("You must enter a title"),
        description: yup.string()
        .required("You must have a description")
        .min(10, "Minimum 10 characters")
        .max(400, "Maximum 400 characters"),

    })

    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    });

    const postRef = collection(db, "posts")

    const onCreatePost = async (data: CreateFormData) => {
        await addDoc(postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
        })
        navigate("/");
    }

    return (
        <div>
            <form className='formDiv' onSubmit={handleSubmit(onCreatePost)}>
                <input type="text" placeholder="Title" {...register("title")}/>
                {errors.title?.message && <p>{errors.title?.message}</p>}
                <textarea placeholder="Description" {...register("description")}/>
                {errors.description?.message && <p>{errors.description?.message}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default CreateForm