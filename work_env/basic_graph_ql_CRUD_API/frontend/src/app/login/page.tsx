"use client"
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { schema } from "./SchemaValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormValues } from "./types";
import { useMutation } from "@apollo/client";
import LOG_IN from '../../graphql/ mutations/LOG_IN.graphql'
import { useRouter } from "next/navigation";


export default function LogIn() {
  const router = useRouter();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
      defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(schema)
  })

  const [loginUser, { data, loading, error }] = useMutation(LOG_IN);
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const loginresponse = await loginUser({
        variables: {
          input: 
            {
              email: values.email,
              password: values.password
            }
        }
      });

      if(loginresponse.data.login.token) {
        router.push('/profile-page')

        const token = loginresponse.data.login.token
        console.log(loginresponse.data.login.token)
        console.log("success")
        deleteCookie("AccessToken", { httpOnly: true, secure: true, sameSite: 'none'});
        setCookie('AccessToken', loginresponse.data.login.token, { httpOnly: false, secure: true, sameSite: 'none'})
        localStorage.setItem('AccessToken', token)

      } 
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <section className='h-screen'>
    <div className="grid grid-cols-1 lg:grid-cols-2"> 
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-gray-600">

            <Link href="/signup"> Don&#x27;t have an account?{" "} 
            <span
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Create a free account
            </span>
            </Link>
          </p>
          <form action="#" method="POST" className="mt-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div>
                <label htmlFor="" className="text-base font-medium text-gray-900">
                  {" "}
                  Email address{" "}
                </label>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="email"
                    placeholder="Email"
                    {...register("email")}

                  />
                  {errors.email && (
                    <p className='text-[#FF5733] text-xs  pt-2'>
                    {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="" className="text-base font-medium text-gray-900">
                    {" "}
                    Password{" "}
                  </label>
                  <a
                    href="#"
                    title=""
                    className="text-sm font-semibold text-black hover:underline"
                  >
                    {" "}
                    Forgot password?{" "}
                  </a>
                </div>
                <div className="mt-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className='text-[#FF5733] text-xs  pt-2'>
                      {errors.password.message}
                    </p>
                  )} 
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Get started{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
            >
              <span className="mr-2 inline-block">
                <svg
                  className="h-6 w-6 text-rose-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
              </span>
              Sign in with Google
            </button>
            <button
              type="button"
              className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
            >
              <span className="mr-2 inline-block">
                <svg
                  className="h-6 w-6 text-[#2563EB]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                </svg>
              </span>
              Sign in with Facebook
            </button>
          </div>
        </div>
      </div>
      <div className="h-screen w-full">
        <img
          className="mx-auto h-full w-full rounded-md object-cover"
          src="https://images.unsplash.com/photo-1630673245362-f69d2b93880e?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1740&amp;q=80"
          alt=""
        />
      </div>
    </div>
  </section>
  
  );
}
