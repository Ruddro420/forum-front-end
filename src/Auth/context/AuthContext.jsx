/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from sessionStorage on refresh
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userId = sessionStorage.getItem("userId");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/me/${userId}`,
        {
          credentials: "include", // important if using cookies
        }
      );
      // console.log("respose of me", res);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Fetch user error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login using POST
  const login = async (email, password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("logindata", data.user);
      // setUser(data.user);
      fetchUserPost(); // Fetch user data after login
      // If API returns a user id
      if (data?.user?.id) {
        sessionStorage.setItem("userId", data.user.id); // optional
        await fetchUser(); // ✅ no id needed
        return { success: true };
      } else {
        return {
          success: false,
          message: data?.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    }
  };

  // const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("userId");
    setUser(null);
    window.location.reload();
  };

  const [posts, setPosts] = useState([]);

  // fetch post data
  const fetchPost = async () => {
    //   const userId = sessionStorage.getItem("userId");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/posts`);
      // console.log("respose of me",res);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setPosts(data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //fetch user specific posts
  const [userPost, setUserPosts] = useState([]);
  const fetchUserPost = React.useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/posts/filter/${user.category_id}/${
          user.sub_category_id
        }`
      );
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUserPosts(data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // statistics
  const [stats, setStats] = useState([]);
  // load statistics data
  const fetchTotalData = async () => {
    //   const userId = sessionStorage.getItem("userId");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/statistics`);
      // console.log("respose of me",res);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setStats(data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // recent post
  const [recentPost, setRecentPost] = useState([]);
  const fetchRecentPost = async () => {
    //   const userId = sessionStorage.getItem("userId");
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_API}/recentPosts`);
      // console.log("respose of me",res);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setRecentPost(data.data);
    } catch (error) {
      console.error("Fetch user error:", error);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // featured tags
  const [fetauredTag, setFeaturedTag] = useState([]);

  const fetchFeaturedTags = async () => {
    //   const userId = sessionStorage.getItem("userId");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_API}/tags/featured`
      );
      // console.log("respose of me",res);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setFeaturedTag(data.tags);
    } catch (error) {
      console.error("Fetch user error:", error);
      // setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  // get categories
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_SERVER_API}/category`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    fetchPost();
    fetchTotalData();
    fetchRecentPost();
    fetchFeaturedTags();
  }, []);

  useEffect(() => {
    if (user && user.category_id && user.sub_category_id) {
      fetchUserPost();
    }
  }, [user, fetchUserPost]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userPost,
        loading,
        login,
        logout,
        fetchUser,
        posts,
        stats,
        recentPost,
        fetauredTag,
        fetchPost,
        fetchUserPost,
        categories,
        fetchTotalData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
