import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchUserByCarId } from '../features/cars/carSlice';
import { selectCurrentUserDetails } from '../features/auth/authSlice';
import { closeModal } from '../features/modal/modalSlice';
import { generateRoomId } from '../utils/generateRoomId';
import ChatModal from './ChatModal';

const ModalManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, content, carId } = useSelector((state: RootState) => state.modal);
  const currentUser = useSelector(selectCurrentUserDetails);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen && content === 'chat' && carId && currentUser?._id) {
      setLoading(true);
      dispatch(fetchUserByCarId(carId))
      .unwrap()
      .then(carOwnerId => {
        if (carOwnerId) {
          const newRoomId = generateRoomId(carOwnerId, carId);
          setRoomId(newRoomId);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching car owner:", error);
        setLoading(false);
      });
  }
}, [dispatch, isOpen, content, carId]);

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (!isOpen || !carId) {
    return null;
  }

  if (loading || !roomId) {
    return <div className="modal-background">Loading...</div>;
  }

  return (
    <div className="modal-background">
      {content === 'chat' && (
        <ChatModal roomId={roomId} carId={carId} handleClose={handleClose} />
      )}
    </div>
  );
};

export default ModalManager;
