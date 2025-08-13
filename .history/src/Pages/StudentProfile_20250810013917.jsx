/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Link as LinkIcon, Award, MessageSquare, Eye, Star, Edit, Settings, Mail, Github, Twitter } from 'lucide-react';

import { useAuth } from '../Auth/context/AuthContext';
import { Link, NavLink } from 'react-router';
import Loader from '../components/Loader';
const StudentProfile = () => {
    const [activeTab, setActiveTab] = useState('questions');
    const { user, logout } = useAuth();
    // console.log(user);


  



    const [recentQuestions, setRecentQuestions] = useState([])
    const [loading, setLoading] = useState(true);
    // load statistics data
    const fetchTotalData = async () => {
        //   const userId = sessionStorage.getItem("userId");
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_API}/posts/student/${user?.id}`);
            // console.log("respose of me",res);
            if (!res.ok) throw new Error("Failed to fetch user");
            const data = await res.json();
            console.log(data);
            setRecentQuestions(data.data);
        } catch (error) {
            console.error("Fetch user error:", error);
            // setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTotalData();
    }, [user?.id]);
    // console.log(recentQuestions);
    const tabs = [
        // { id: 'overview', label: 'Overview' },
        { id: 'questions', label: 'Questions', count: recentQuestions.length },
        { id: 'tags', label: 'Tags' },
    ];

    return (
        <div className="mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                    <li><NavLink to={`/`} className="hover:text-blue-600">Home</NavLink></li>
                    <li>/</li>
                    <li><a href="#" className="hover:text-blue-600">Users</a></li>
                    <li>/</li>
                    <li className="text-gray-900">{user?.first_name}</li>
                </ol>
            </nav>

            {/* Profile Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar and Basic Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {user?.first_name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {/* <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </button> */}
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.first_name} {user?.last_name}</h1>
                                <p className="text-xl text-gray-600 mb-2">{user?.email}</p>
                                {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {profile.location}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Joined {profile.joinDate}
                                    </div>
                                    <div className="flex items-center">
                                        <LinkIcon className="h-4 w-4 mr-1" />
                                        <a href={profile.website} className="text-blue-600 hover:underline">
                                            {profile.website}
                                        </a>
                                    </div>
                                </div> */}
                            </div>
                            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Settings className="h-5 w-5" />
                                <button onClick={() => logout()} className='btn btn-primary'>Logout</button>
                            </button>
                        </div>

                        {/* <p className="text-gray-700 mb-6">{profile.bio}</p> */}

                        {/* Social Links */}
                        {/* <div className="flex items-center space-x-4 mb-6">
                            <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                            </a>
                            <a href="#" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                                <Github className="h-4 w-4 mr-1" />
                                GitHub
                            </a>
                            <a href="#" className="flex items-center text-gray-600 hover:text-blue-400 transition-colors">
                                <Twitter className="h-4 w-4 mr-1" />
                                Twitter
                            </a>
                        </div> */}

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            {/* <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.stats.reputation.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">Reputation</div>
                            </div> */}
                            <div className="text-center border p-5 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900">{recentQuestions.length}</div>
                                <div className="text-sm text-gray-500">Total Questions</div>
                            </div>
                            <div className="text-center border p-5 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900">{recentQuestions.filter(post => post.status == 0).length}</div>
                                <div className="text-sm text-gray-500">Pending Questions</div>
                            </div>
                            {/* <div className="text-center border p-5 shadow-sm">
                                <div className="text-2xl font-bold text-gray-900">{profile.stats.views.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">Profile Views</div>
                            </div> */}
                            {/* <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.stats.followers}</div>
                                <div className="text-sm text-gray-500">Followers</div>
                            </div> */}
                            {/* <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{profile.stats.following}</div>
                                <div className="text-sm text-gray-500">Following</div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                                {tab.count && (
                                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-8">
                    {activeTab === 'questions' && (
                        <div className="">

                            <div className='flex flex-col gap-6'>

                                {!loading ? recentQuestions.length > 0 ? (
                                    recentQuestions.map((question) => (
                                        <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <Link to={`/forum/question-detail/${question.id}`} className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                                    {question.title}
                                                </Link>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${question.status === 'answered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {question.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-1">
                                                <span>Class: {question.category?.name}</span>{' | '}
                                                {question.sub_category && <span>Group: {question.sub_category?.name}</span>}
                                            </div>
                                            {/* <div className="text-sm text-gray-500 mb-1">
                                                <span>Asked by: {question.student?.first_name} {question.student?.last_name}</span>
                                            </div> */}
                                            <div className="text-sm text-gray-500 mb-1">
                                                <span>Date: {new Date(question.created_at).toLocaleString()}</span>
                                            </div>
                                            {question.tag && (
                                                <div className="mt-2 text-xs text-blue-600">Tags: {question.tag}</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p>No recent questions found.</p>
                                ) : <Loader />}
                            </div>

                        </div>
                    )}

                    {activeTab === 'tags' && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Used Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {/* Filter all used tags from the all questions of recentQuestions and show them here here. and dont show duplicates if any tag has duplicates then show them as a number beside the tag */}
                                {recentQuestions.length > 0 ? (
                                    Object.entries(
                                        recentQuestions.reduce((acc, question) => {
                                            if (question.tag) {
                                                const tags = question.tag.split(',').map(tag => tag.trim());
                                                tags.forEach(tag => {
                                                    acc[tag] = (acc[tag] || 0) + 1;
                                                });
                                            }
                                            return acc;
                                        }, {})
                                    ).map(([tag, count]) => (
                                        <Link to={`/forum/?tag=${tag}`}
                                            key={tag}
                                            className={`inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full ${tag == " " ? "hidden" : ""}`}
                                        >
                                            {tag} {count > 1 && `(${count})`}
                                        </Link>
                                    ))
                                ) : (
                                    <p>No tags found.</p>
                                )}



                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
