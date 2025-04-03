
import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
  Modal, ModalContent, useDisclosure,
  Selection, SortDescriptor, Pagination, ModalHeader, ModalBody,
  ModalFooter,
  Tooltip,
  ModalProps,
  ScrollShadow
} from "@nextui-org/react";



const PasswordModal = ({
    deleteType, 
    onClose, 
    selectedDelete}: {
        deleteType:number, 
        onClose: () => void, 
        selectedDelete:(value:{
            deleteType: number
            password: string
}) => void}) => {

    const [passwordInput, setPasswordInput] = useState("")


    return(
        <>
              <ModalHeader className="flex flex-col gap-1">비밀번호를 입력하세요</ModalHeader>
              <ModalBody>
                <Input
                  label="비밀번호"
                  placeholder="비밀번호을 입력해주세요"
                  variant="bordered"
                  type="password"
                  value={passwordInput}
                  onValueChange={setPasswordInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={() => {
                  selectedDelete({
                    deleteType: deleteType,
                    password: passwordInput
                  })

                  setPasswordInput("")
                  onClose()
                }}>
                  확인
                </Button>
                <Button color="default" onPress={() => {
                  onClose()
                  setPasswordInput("")
                }}>
                  닫기
                </Button>
              </ModalFooter>
            </>
    )
}

export default PasswordModal