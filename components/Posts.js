import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import Post from "./Post";

function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(() =>
        onSnapshot(query(collection(db, 'posts'), orderBy('timestamp', 'desc')), snapshot => {
            setPosts(snapshot.docs);
        }), [db]);

    // const [realtimePosts] = useCollection(
    //     db.collection("posts").orderBy("timestamp", "desc")
    // );

    return (
        <div>
            {posts?.map(post => (
                    <Post
                        key={post.id}
                        name={post.data().name}
                        message={post.data().message}
                        // email={post.data().email}
                        timestamp={post.data().timestamp}
                        image={post.data().image}
                        postImage={post.data().postImage}
                    />
                ))}
        </div>
    )
}

export default Posts;