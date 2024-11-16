import React from "react";
import { useAuth } from "./contexts/AuthProvider";
import Todo from "./components/Todo";
import SignUp from "./screens/SignUp";

const Home = () => {
    const { authToken } = useAuth();

    return (
        <div>
            {authToken ? <Todo /> : <SignUp />}
        </div>
    );
};

export default Home;
