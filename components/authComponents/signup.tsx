"use client";

import { signUpWithCredentials } from "@/lib/serverActions/auth";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";
import { useUserStore } from "@/components/providers/user-store-provider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/providers/auth-store-provider";

export default function SignUpComponent() {

  let router = useRouter();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [isInvalidConfirmPassword, setIsInvalidConfirmPassword] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] = useState(false);

  const [nameFoucus, setNameFocus] = useState(false);
  const [emailFoucus, setEmailFocus] = useState(false);
  const [passwordFoucus, setPasswordFocus] = useState(false);
  const [confirmPasswordFoucus, setConfirmPasswordFocus] = useState(false);

  const validateName = (name: string) => name.match(/^[가-힣a-zA-Z0-9]+$/);
  const validateEmail = (email: string) => email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const validatePassword = (password: string) => password.length >= 8;
  const validateConfirmPassword = (confirmPassword: string) => confirmPassword === password;

  useEffect(() => {
    if (nameFoucus) {
      setIsInvalidName(name === "" || !validateName(name));
    } else {
      setIsInvalidName(false);
    }
  }, [name, nameFoucus]);

  useEffect(() => {
    if (emailFoucus) {
      setIsInvalidEmail(email === "" || !validateEmail(email));
    } else {
      setIsInvalidEmail(false);
    }

  }, [email, emailFoucus]);

  useEffect(() => {
    if (passwordFoucus) {
      setIsInvalidPassword(password === "" || !validatePassword(password));
    } else {
      setIsInvalidPassword(false);
    }

  }, [password, passwordFoucus]);

  useEffect(() => {

    if (confirmPasswordFoucus) {
      setIsInvalidConfirmPassword(confirmPassword === "" || !validateConfirmPassword(confirmPassword));
    } else {
      setIsInvalidConfirmPassword(false);
    }


  }, [confirmPassword, password, confirmPassword]);

  const toggleVisibility = () => {
    if (passwordInputRef.current) {
      const cursorPosition = passwordInputRef.current.selectionStart;
      setIsVisible(!isVisible);

      // 상태 업데이트 후 커서 위치를 복원합니다.
      setTimeout(() => {
        passwordInputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }
  }
  const confirmToggleVisibility = () => {

    if (confirmPasswordInputRef.current) {
      const cursorPosition = confirmPasswordInputRef.current.selectionStart
      setConfirmPasswordIsVisible(!confirmPasswordIsVisible);

      setTimeout(() => {
        confirmPasswordInputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      }, 0);
    }


  }

  const allConfirm = !isInvalidName && !isInvalidEmail && !isInvalidPassword && !isInvalidConfirmPassword &&
    name !== "" && email !== "" && password !== "" && confirmPassword !== "";


    const { fetchSession  } = useUserStore((state)=> state);

    const { setSignUpStatus } = useAuthStore((state)=> state)



    const notifyFailedEvent = (msg: string) => toast.error(msg);

  const handleSignUp = async (formData: FormData) => {
    const result = await signUpWithCredentials(formData);

    if (result.success) {
      // 로그인 성공 처리
      fetchSession();

      setSignUpStatus("success");

      setTimeout(() => {
        router.push("/");
      }, 500);



    } else {
      // 로그인 실패 처리
      notifyFailedEvent("회원가입이 실패하였습니다. 다시 시도해주세요");
      console.error(result.error);
    }
  };

  return (
    <div className="flex justify-center w-full py-[20px]">
      <div className="custom-shadow flex flex-col items-center w-[350px] rounded-[20px] bg-white dark:bg-black py-[25px] gap-2">

        <form
          className="flex flex-col w-full mx-0 px-0 justify-center items-center gap-2"
          action={handleSignUp}
        >
          <Input
            type="text"
            name="name"
            label="Name"
            variant="bordered"
            placeholder="Enter your Name"
            value={name}
            onFocus={() => setNameFocus(true)}
            onChange={(e) => setName(e.target.value)}
            isInvalid={isInvalidName}
            color={isInvalidName ? "danger" : "success"}
            errorMessage={isInvalidName ? "1자 이상 입력해주세요" : ""}
            className="max-w-xs h-[80px]"
          />

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
            errorMessage={isInvalidEmail ? "이메일 형식에 맞게 작성해주세요" : ""}
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

          <Input
            type={confirmPasswordIsVisible ? "text" : "password"}
            label="Confirm Password"
            variant="bordered"
            placeholder="Confirm your password"
            value={confirmPassword}
            onFocus={() => {
              setConfirmPasswordFocus(true)
            }}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => {
              setConfirmPasswordIsVisible(false);
            }}
            isInvalid={isInvalidConfirmPassword}
            color={isInvalidConfirmPassword ? "danger" : "success"}
            errorMessage={isInvalidConfirmPassword ? "비밀번호가 일치하지 않습니다" : ""}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={confirmToggleVisibility}
              >
                <FontAwesomeIcon
                  icon={confirmPasswordIsVisible ? faEye : faEyeSlash}
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
            <span className="text-white text-center text-[16px]">Sign up</span>
          </Button>
        </form>
      </div>
    </div>
  );
}