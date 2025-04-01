"use client"

import { Input } from "@nextui-org/react";
import { EyeSlashFilledIcon, EyeFilledIcon } from "../../icons";

// 재사용 가능한 비밀번호 입력 컴포넌트
export const PasswordInput = ({ 
  value, 
  onChange, 
  visible, 
  toggleVisibility, 
  label = "비밀번호", 
  defaultValue = "" 
}) => (
  <Input
    isRequired
    label={label}
    placeholder="비밀번호를 입력해주세요"
    variant="bordered"
    defaultValue={defaultValue}
    endContent={
      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
        {visible ? (
          <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        ) : (
          <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        )}
      </button>
    }
    type={visible ? "text" : "password"}
    value={value}
    onValueChange={onChange}
  />
);

export default PasswordInput;