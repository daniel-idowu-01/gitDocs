import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Google from "../../public/images/google.svg";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../ui/components/Spinner";
import "react-toastify/dist/ReactToastify.css";
import ORComponent from "../ui/components/widgets/ORComponent";

const SignUp = () => {
  const navigate = useNavigate();
  const [formInput, setFormInput] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const buttonStyle =
    "border bg-button p-3 rounded-md hover:bg-opacity-80 transition-all";
    const notifyCatchError = (error) => toast.warn(error);

  const handleFormChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    fetch("http://localhost:5000/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formInput),
    })
      .then((res) => {
        setIsLoading(false);
        return res.json();
      })
      .then((data) => {
        if (data.statusCode == 400) {
            notifyCatchError(`${data.message}`);
          }

        if (data.success) {
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        notifyCatchError(`${err}`);
        console.log("Errrrrrrrrrr", err);
      });
  };

  return (
    <section>
      <ToastContainer />
      <article className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[#031f39] h-screen">
        <div className="flex justify-center">
          <img
            className="absolute mx-auto top-32 w-[40rem] z-10 opacity-50 brightness-150"
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt=""
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center z-50">
          <h2 className="mt-5 text-2xl/9 font-bold tracking-tight text-gray-300">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm z-50">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-300"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={(e) => handleFormChange(e)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#ff7f50] sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-300"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => handleFormChange(e)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[#ff7f50] sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                disabled={isLoading}
                type="submit"
                className={`${
                  isLoading
                    ? "bg-[#e6e6e6]"
                    : "bg-[#ff7f50] hover:bg-[#ff7f50cb]"
                } flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7f50]`}
              >
                {isLoading && <Spinner />}
                {!isLoading && "Sign Up"}
              </button>
            </div>

            <ORComponent />

            <button
              type="button"
              className={`${buttonStyle} bg-white text-black w-full flex items-center justify-center gap-5`}
            >
              <img src={Google} alt="" className="inline w-5" />
              Continue with Google
            </button>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#ff7f50] hover:text-[#ff7f50] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </article>
    </section>
  );
};

export default SignUp;