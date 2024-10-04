"use client";


import {
  signInWithGitHub,
  signInWithGoogle,
  signInWithCredentials,
} from "@/serverActions/auth";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { useAuthStore } from "@/app/providers/auth-store-provider";
import { useRouter } from "next/navigation"
import { useUserStore } from "@/app/providers/user-store-provider";


export default function SignInComponent() {

    let router = useRouter();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [emailFoucus, setEmailFocus] = useState(false);
  const [passwordFoucus, setPasswordFocus] = useState(false);

  const validateEmail = (email: string) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const validatePassword = (password: string) => password.length >= 8;

  useEffect(() => {
    if (emailFoucus) {
      setIsInvalidEmail(email === "" || !validateEmail(email));
    } else {
      setIsInvalidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (passwordFoucus) {
      setIsInvalidPassword(password === "" || !validatePassword(password));
    } else {
      setIsInvalidPassword(false);
    }
  }, [password]);

 
  // 로그인 성공여부

  const { fetchSession  } = useUserStore((state)=> state);

  const notifyFailedEvent = (msg: string) => toast.error(msg);

  const { setSignInStatus } = useAuthStore((state)=> state)

  const handleSignIn = async (formData: FormData) => {
    const result = await signInWithCredentials(formData);

    if (result.success) {
      // 로그인 성공 처리
      fetchSession();

      setSignInStatus("success");

      setTimeout(() => {
        router.push("/");
      }, 500);

      

    } else {
      // 로그인 실패 처리
      notifyFailedEvent("로그인이 실패하였습니다. 다시 시도해주세요");
      console.error(result.error);
      
    }
  };



  const toggleVisibility = () => {
    if (passwordInputRef.current) {
      const cursorPosition = passwordInputRef.current.selectionStart;
      setIsVisible(!isVisible);

      // 상태 업데이트 후 커서 위치를 복원합니다.
      setTimeout(() => {
        passwordInputRef.current?.setSelectionRange(
          cursorPosition,
          cursorPosition
        );
      }, 0);
    }
  };

  const allConfirm =
    !isInvalidEmail && !isInvalidPassword && email !== "" && password !== "";  

  return (
    <div className="flex justify-center w-full">
      
      <div className="flex flex-col items-center w-[350px] rounded-[20px] bg-black py-[20px] gap-2">
        <form
          className="w-full flex items-center justify-center"
          action={async () => {
            await signInWithGitHub();
          }}
        >
          <Button className="w-[90%] h-[50px] mb-[10px]" type="submit">
            <FontAwesomeIcon className="size-[24px]" icon={faGithub} />
            Sign in with GitHub
          </Button>
        </form>

        <form
          className="w-full flex items-center justify-center"
          action={async () => {
            await signInWithGoogle();
          }}
        >
          <Button className="w-[90%] h-[50px] bg-blue-600" type="submit">
            <FontAwesomeIcon
              className="size-[24px]"
              icon={faGoogle}/>
            Sign in with Google
          </Button>
        </form>

        <div className="w-full flex justify-center">
          <h1>or</h1>
        </div>

        <form
          className="flex flex-col w-full mx-0 px-0 justify-center items-center gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleSignIn(formData);
          }}
        >
          <Input
            type="email"
            name="email"
            label="Email"
            variant="bordered"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocus(true)}
            isInvalid={isInvalidEmail}
            color={isInvalidEmail ? "danger" : "success"}
            errorMessage={
              isInvalidEmail ? "이메일 형식에 맞게 작성해주세요" : ""
            }
            className="max-w-xs h-[80px]"
          />

          <Input
            type={isVisible ? "text" : "password"}
            ref={passwordInputRef}
            name="password"
            label="Password"
            variant="bordered"
            placeholder="Enter your password"
            value={password}
            onFocus={() => {
              setPasswordFocus(true);
            }}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              setIsVisible(false);
            }}
            isInvalid={isInvalidPassword}
            color={isInvalidPassword ? "danger" : "success"}
            errorMessage={isInvalidPassword ? "8자 이상 입력해주세요" : ""}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleVisibility}
              >
                <FontAwesomeIcon
                  icon={isVisible ? faEye : faEyeSlash}
                  className="text-md text-default-400 pointer-events-none"
                />
              </button>
            }
            className="max-w-xs h-[80px]"
          />

          <Button
            disabled={!allConfirm}
            type="submit"
            color={allConfirm ? "primary" : "default"}
            className="w-[90%] h-[50px]"
          >
            <span className="text-white text-center text-[16px]">Sign In</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
