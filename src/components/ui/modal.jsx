// components/ui/Modal.jsx
import { motion, AnimatePresence } from "framer-motion";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { scale: 0.95, opacity: 0, y: "-10%" },
  visible: { scale: 1, opacity: 1, y: "0%" },
};

const Modal = ({ children, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 bg-opacity-40 backdrop-blur-sm"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
          className="relative bg-base-200 shadow-2xl p-6 rounded-2xl w-full max-w-2xl"
        >
          <button
            onClick={onClose}
            className="top-3 right-4 absolute focus:outline-none font-bold text-gray-500 hover:text-red-500 text-2xl btn"
            aria-label="Close modal"
          >
            &times;
          </button>
          <div className="mt-2">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
