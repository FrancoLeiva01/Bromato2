import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

interface ModalAppProps {
  openModal: boolean;
  handleCancel?: () => void;
  handleAccept?: () => void;
  ModalTitle: string;
  contentModal: string | JSX.Element;
  labelAcept?: string;
  labelCancel?: string;
  disabledAceptButton?: boolean;
}
const ModalApp = ({
  openModal,
  handleCancel,
  handleAccept,
  ModalTitle,
  contentModal,
  labelAcept = "Crear +",
  labelCancel = "Cancelar",
  disabledAceptButton,
}: ModalAppProps) => {
  return (
    <Modal show={openModal} onClose={handleCancel}>
      <ModalHeader>{ModalTitle}</ModalHeader>
      <ModalBody>
        <div className="space-y-2">{contentModal}</div>
      </ModalBody>
      <ModalFooter className="flex justify-between">
        {handleCancel && (
          <Button color="gray" onClick={handleCancel}>
            {labelCancel}
          </Button>
        )}
        {handleAccept && (
          <Button onClick={handleAccept} disabled={disabledAceptButton}>
            {labelAcept}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export { ModalApp };