import React, {ChangeEvent, memo, useState} from 'react';
import {
Input, Textarea, Button, CircularProgress
} from "@nextui-org/react";

import { ToastContainer, toast } from 'react-toastify';





const ModalInput = (
    {
        writed,
        personId,

    }: 
    {
    personId:string
    writed: (
        values: {
            replyWirter: string,
            replyPassword: string,
            replyContent: string
        }
) => void}) => {

    const [addedReplyPasswordInput, setAddedReplyPasswordInput] = useState<string>("");

    const [addedReplyWriterInput, setAddedReplyWriterInput] = useState<string>("");

    const [addedReplyContentInput, setAddedReplyContentInput] = useState<string>("");

    const notifySuccessEvent = (msg: string) => toast.success(msg);

    const [isLoading, setIsLoading] = useState<Boolean>(false);

    return (<>
            <div className="flex flex-col w-full items-start space-y-1">
                <h1 className=" text-blue-500">
                    {personId && `@${personId}`}
                </h1>
                <div className="flex flex-row w-full space-x-1">
                    <Input className="flex"
                        isRequired
                        type="text"
                        label="닉네임"
                        placeholder="닉네임을 입력해주세요"
                        variant="bordered"
                        defaultValue=""
                        value={addedReplyWriterInput}
                        onValueChange={setAddedReplyWriterInput}
                    />
                    <Input
                        isRequired
                        label="비밀번호"
                        placeholder="비밀번호을 입력해주세요"
                        variant="bordered"
                        type="password"
                        value={addedReplyPasswordInput}
                        onValueChange={setAddedReplyPasswordInput}
                    />

                </div>

                <div className="flex w-full">
                    <Textarea
                        label="답글"
                        type="text"
                        placeholder="답글을 입력해주세요"
                        variant="bordered"
                        value={addedReplyContentInput}
                        onValueChange={setAddedReplyContentInput}
                    />
                </div>

            </div>
            <div className="flex w-full justify-end pt-2">
                <Button color="warning" variant="flat" onPress={() => {

                    setIsLoading(true);
                    if (addedReplyContentInput === "" && addedReplyPasswordInput === "" && addedReplyWriterInput === "") {
                        notifySuccessEvent("빈칸이 존재합니다. 입력후 작성해주세요")
                        setIsLoading(false);
                    } else {

                        writed({
                            replyWirter: addedReplyWriterInput,
                            replyPassword: addedReplyPasswordInput,
                            replyContent: addedReplyContentInput
                        })
                        new Promise(f => setTimeout(f, 1000));

                        setAddedReplyContentInput("")
                        setAddedReplyPasswordInput("")
                        setAddedReplyWriterInput("")
                        setIsLoading(false);

                    }
                }}>
                    {isLoading ? <CircularProgress
                        size="sm"
                        color="warning"
                        aria-label="Loading..." /> : '답글 작성'}
                </Button>
            </div>

        </>

        )
  };
  
  export default ModalInput
  
  
  
  
  
