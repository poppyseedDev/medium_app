import { GetStaticProps } from 'next';
import React, { useState } from 'react'
import Header from '../../components/Header';
import { sanityClient, urlFor} from "../../sanity";
import { Post } from '../../typings';
import PortableText from "react-portable-text";
//react hook form
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
    post: Post;
};

interface IFormInput {
    _id: string,
    name: string,
    email: string,
    comment: string
};
  

function Post({ post }: Props) {
    const [submitted, setSubmitted] = useState(false);
    console.log(post);

    //react hook form
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors } 
    } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async(data) => {
        await fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(data);
            setSubmitted(true);
        }).catch((err) => {
            console.log(err);
            setSubmitted(false);
        })
    };

    return (
        <main>
            <Header />

            <img 
            className="w-full h-40 object-cover"
            src={urlFor(post.mainImage).url()!} 
            alt=""/>

            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-gray-500 mb-2">{post.description}</h2>

                <div className="flex items-center px-5 space-x-2">
                    <img
                        className="h-10 w-10 rounded-full" 
                        src={urlFor(post.author.image).url()!}
                        alt=""
                    />
                    <p className="font-extralight text-sm">
                        Blog post by <span className="text-green-600">{post.author.name} </span>- Publish at {" "}
                        {new Date(post._createdAt).toLocaleString()}
                    </p>
                </div>

                <div className="py-5">
                    <PortableText
                    dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                    projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                    content={post.body}
                    serializers={
                        {
                            h1: (props: any) => (
                                <h1 className="text-2xl font-body my-5" {...props} />
                            ),
                            h2: (props: any) => (
                                <h1 className="text-2xl font-body my-5" {...props} />
                            ),
                            li: ({children}: any) => {
                                <li className="ml-4 list-disc">{children}</li>
                            },
                            link: ({href, children}: any) => {
                                <a href={href} className="text-blue-500 hover:underline">
                                    {children}
                                </a>
                            }
                        }
                    }
                    />
                </div>
            </article>


            <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
            
            {submitted ? (
                <div className='flex flex-col p-10 my-10 bg-yellow-500 text-gray-700 max-w-2xl font-bold mx-auto'>
                    <h3 className='text-3xl font-bold py-3'>
                        Thank you for submitting your comment!
                    </h3>
                    <p>
                        Once it has been approved it will appear below!
                    </p>
                </div>
            ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto">
                <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
                <h4 className="text-3xl font-bold">Leave a comment bellow!</h4>
                <hr className="py-3 mt-2" />
       
                <input
                    {...register("_id")}
                    type="hidden"
                    name="_id"
                    value={post._id}
                />

                <label className="block mb-5">
                    <span className="text-gray-500">Name</span>
                    <input 
                    {...register("name", { required: true })}
                    className="shadow border rounded py-2 px-3 form-input mt-1 block
                    w-full ring-yellow-500 outline-none focus:ring"
                    placeholder="Vitalik Buterin"
                    type="text" 
                    name="name"
                    />
                </label>
                <label className="block mb-5">
                    <span className="text-gray-500">Email</span>
                    <input 
                    {...register("email", { required: true })}
                    className="shadow border rounded py-2 px-3 form-input mt-1 block
                    w-full ring-yellow-500 outline-none focus:ring" 
                    placeholder="vitalik.buterin@ethereum.org" 
                    type="email" 
                    name="email"
                    />
                </label>
                <label className="block mb-5">
                    <span className="text-gray-500">Comment</span>
                    <textarea 
                    {...register("comment", { required: true })}
                    className="shadow border rounded py-2 px-3 form-textarea mt-1
                    block w-full ring-yellow-500 outline-none focus:ring" 
                    placeholder="Input a comment." 
                    rows={8}
                    name="comment"
                    />
                </label>
                
                <div className="flex flex-col p-5">
                    {/*All the errors are inside here */}
                    {errors.name && (
                        <span className="text-red-500">- The Name Field is required. </span>
                    )}
                    {errors.comment && (
                        <span className="text-red-500">- The Comment Field is required. </span>
                    )}
                    {errors.email && (
                        <span className="text-red-500">- The Email Field is required. </span>
                    )}
                </div>

                <input
                    type="submit"
                    className="shadow bg-yellow-500 py-2 rounded text-white text-bold cursor-pointer
                    hover:bg-yellow-400 focus:shadow-outline outline-none focus:ring"
                />
                
            </form>
            )}



        </main>
    )
}

export default Post;

//looks at all the pages that exist
export const getStaticPaths = async () => {
    const query = `*[_type == "post"] {
        _id,
        slug
      }`;
    
    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post)=>({
    params: {
        slug: post.slug.current
    }
    }));

    return {
        paths,
        fallback: "blocking"
    };
};

// populates the page with props
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type == "post" && slug.current == $slug][0] {
        _id,
        _createdAt,
        title,
        author -> {
        name,
        image
      },
      'comments': *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true],
        description,
        mainImage,
        slug,
      body
      }`
    
    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if (!post) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            post,
        },
        revalidate: 60,
        // after 60 seconds it updates the old cache
    };
};
