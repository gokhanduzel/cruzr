// ModalManager.tsx
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import ChatModal from './ChatModal';

const ModalManager = () => {
  const { isOpen, content, carId } = useSelector((state: RootState) => state.modal);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-background">
      {content === 'chat' && carId && (
        <ChatModal carId={carId} />
      )}
    </div>
  );
};

export default ModalManager;
